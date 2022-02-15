import {call, fork, put, select, take, takeLatest} from "redux-saga/effects";
import {
  BROADCAST_CREATE,
  CREATE_AGORA_CLIENT,
  CREATE_RTC_INFO, GET_ROOM_INFO, HISTORY_PUSH_BROADCAST,
  SET_CLIENT, SET_GUEST, SET_GUEST_MANAGEMENT,
  SET_LOCAL_TRACK,
  SET_ROOM_INFO,
  SET_RTC_INFO
} from "../../actions/broadcast";
import AgoraRTC, {BeautyEffectOptions, IAgoraRTCClient} from "agora-rtc-sdk-ng";
import {broadcastCreate, broadcastInfoNew, guestList, guestManagement} from "../../../common/api";
import history from "../../../util/customHistory"
import {
  BroadcastRoomInfoType,
  GuestResponseType,
  GuestType,
  RoomInfoResponseType,
  RtcInfoType
} from "../../types/broadcastType";
import {Member} from "../../types/memberType";
import {CanvasElement, UserType} from "../../../common/realtime/rtc_socket";


function* createAgoraClient() {
  while (true) {
    // 3. take Effect로 CREATE_CLIENT Action이 dispatch 되길 기다린다.
    // 4. (특정 시점에 CREATE_CLIENT Action이 dispatch된다.)
    const action = yield take(CREATE_AGORA_CLIENT);
    const client = AgoraRTC.createClient({mode: "live", codec: "vp8"});
    client.on("connection-state-change", (curState, revState, reason) => {
      console.log(`@@ `,curState, revState, reason)
    })
    // 5. put Effect를 사용하여 SET_CLIENT를 dispatch한다.
    yield put({type: SET_CLIENT, payload: client})
  }
}

function* createBroadcast() {
  while (true) {
    const action = yield take(BROADCAST_CREATE);

    const {result, data, message, code} = yield call(broadcastCreate, action.payload);
    if(result === 'fail' && code === '-6'){

    }
    const roomInfo = data;
    sessionStorage.setItem("roomInfo", JSON.stringify(roomInfo));

    yield put({type: SET_ROOM_INFO, payload: roomInfo});
    const client:IAgoraRTCClient = yield select(({broadcast})=> broadcast.agora.client);

    if(client.connectionState === 'DISCONNECTED') {
      history.replace(`/broadcast/${roomInfo.roomNo}`);
      yield client.setClientRole("host");
      yield client.join(roomInfo.agoraAppId, roomInfo.roomNo, roomInfo.agoraToken || null, roomInfo.agoraAccount || null);

      let micId = sessionStorage.getItem("mic");
      let camId = sessionStorage.getItem("cam");

      const [audioTack, videoTrack] = yield Promise.all([
        //AgoraRTC.createMicrophoneAudioTrack({encoderConfig: 'high_quality_stereo'}),
        AgoraRTC.createMicrophoneAudioTrack({
          encoderConfig: {
            sampleRate: 48000,
            stereo: true,
            bitrate: 192,
          },
          microphoneId:micId?.replaceAll("\"","")
        }),
        AgoraRTC.createCameraVideoTrack({ encoderConfig: {
            width: 1280,
            // Specify a value range and an ideal value
            height: { ideal: 720, min: 720, max: 1280 },
            frameRate: 24,
            bitrateMin: 1130, bitrateMax: 2000,
          },cameraId:camId?.replaceAll("\"","")})
      ]);
      const localTracks = {audioTack, videoTrack};
      const effectOption: BeautyEffectOptions = {
        lighteningContrastLevel: 1,
        lighteningLevel: 0.7,
        rednessLevel: 0.1,
        smoothnessLevel: 0.5
      };
      yield videoTrack.setBeautyEffect(true, effectOption);
      yield videoTrack.play("local-player",{mirror:false});
      yield client.publish(Object.values(localTracks))
      yield put({type: SET_LOCAL_TRACK, payload: localTracks});

      try {
        if (window.fbq) window.fbq("track", "RoomMake");
        if (window.firebase) window.firebase.analytics().logEvent("RoomMake");
      } catch (e) {}


    }else if(client.connectionState === 'CONNECTED'){
      history.replace(`/broadcast/${roomInfo.roomNo}`);
      const localTrack = yield select(({broadcast})=> broadcast.agora.localTrack);

      client.remoteUsers.forEach(user=>{
        if(user.hasVideo){
          user.videoTrack?.play(`local-player`,{mirror:false})
        }
      })
      localTrack.videoTrack.play("local-player",{mirror:false});
    }else{
      // handling?
    }
  }
}

function* createRtcInfo() {
  while (true) {
    const action = yield take(CREATE_RTC_INFO);
    //roomInfoType
    const roomInfo:BroadcastRoomInfoType = yield select(({broadcast})=> broadcast.roomInfo);
    const member:Member = yield select(({member})=> member.data);

    const guestListResult:GuestResponseType = yield call(guestList, {roomNo: roomInfo.roomNo});
    const gstList:Array<GuestType> = guestListResult?.data?.list;
    let userType:UserType;
    if(roomInfo.mediaType === 'a'){
      if(roomInfo.bjMemNo === member.memNo){
        userType = UserType.HOST
        // UserType.HOST AgoraHostRtc
      }else{
        userType = UserType.LISTENER
        // UserType.LISTENER AgoraListenerRtc
      }
    }else{
      if(roomInfo.bjMemNo === member.memNo){
        userType = UserType.HOST
        // UserType.HOST HostRtc
      }else if(gstList && gstList.length > 0 && gstList.find(value => value.memNo === member.memNo)){
        userType = UserType.GUEST
        // UserType.GUEST HostRtc
      }else{
        userType = UserType.LISTENER
        // UserType.LISTENER ListenerRtc
      }
    }
    const rtcInfoPayload:RtcInfoType = {
      userType,
      // roomInfo,
      socketUrl: roomInfo.webRtcUrl,
      appName: roomInfo.webRtcAppName,
      streamName: roomInfo.webRtcStreamName,
      // roomNo:roomInfo.roomNo,
      wsConnection:null,
      // isMono: roomInfo.mediaType === 'v',
      videoConstraints: {
        isVideo: roomInfo.mediaType === 'v',
        videoFrameRate: roomInfo.videoFrameRate,
        videoResolution: roomInfo.videoResolution
      }
    }
    yield put({type:SET_RTC_INFO, payload:rtcInfoPayload})
  }
}

function* historyPushBroadcast() {
  while (true) {
    const action = yield take(HISTORY_PUSH_BROADCAST);
    //
  }
}

/**
 * 1. 방송중->방생성
 * call /broad/check GET
 * "현재 방송 중인 방송방이 있습니다. 방송을 생성하시겠습니까?"
 * chatInfo.privateChannelDisconnect();
 * rtcInfo.socketDisconnect();
 * rtcInfo.stop();
 * globalAction.dispatchRtcInfo({ type: "empty" });
 * rtcSessionClear();
 *
 * call /broad/exit DELETE
 * history.push(`/broadcast_setting`)
 * call /mypage/broadcast/setting GET
 *
 * 2. 방송중->타 방송 입장 (클릭)
 * "해당 방송은 다른 기기에서 DJ로 방송 중이므로 청취자로 입장할 수 없습니다."
 * "현재 방송중 입니다. 방송을 종료 하시겠습니까?"
 *
 * 3. 방송중->타 방송 입장 (url 입력)
 * "해당 방송은 다른 기기에서 DJ로 방송 중이므로 청취자로 입장할 수 없습니다."
 *
 * 4. 청취중->방생성
 * "현재 청취 중인 방송방이 있습니다. 방송을 생성하시겠습니까?"
 *
 */


/**
 * 방장 방 생성시
 * create
 * code: "0"
 * data(roomInfo): {roomNo: "91644396397960", title: "qwdwqdwq",…}
 * message: "방송이 생성되었습니다."
 *
 * 방장 방 입장시(타인)
 * info
 * code: "-3"
 * data: {}
 * message: "회원정보 오류입니다.\n회원정보를 확인해주세요."
 * join
 * code: "C006"
 * data: {}
 * message: "방송 입장을 실패했습니다.\n잠시 후 다시 시도해 주세요."
 * 방장 방 입장시(본인)
 * info
 * code: "-8"
 * data: {}
 * message: "본인이 방송 중인 방은 청취자로 입장 할 수 없습니다.\n방송하기를 클릭해주세요."
 *
 * 리스너 방 입장시
 * info
 * code: "-3"
 * data: {}
 * message: "회원정보 오류입니다.\n회원정보를 확인해주세요."
 * join
 * code: "0"
 * data(roomInfo): {roomNo: "91644396397960", title: "qwdwqdwq",…}
 * message: "방송 참가를 하였습니다."
 * 리스너 방 입장시(강퇴당함)
 * info
 * code: "-3"
 * data: {}
 * join
 * code: "-7"
 * data: {remainTime: 0}
 * message: "강제퇴장된 방송입니다.\nDJ의 다음 방송부터 입장 가능합니다."
 */

function* getRoomInfo(action) {
  try{
    const roomNo = action.payload.roomNo;
    const roomInfoResult:RoomInfoResponseType = yield call(broadcastInfoNew, {roomNo});



  }catch (e){
    // 에러처리..
    console.error(`saga getRoomInfo error =>`, e)
  }
}

function * getSagas() {
  takeLatest(GET_ROOM_INFO, getRoomInfo);
}
const rtc = [
  // 2. fork Effect로 인해 createClient Task 실행
  fork(createAgoraClient),
  fork(createBroadcast),
  fork(createRtcInfo),
  fork(historyPushBroadcast),
  getSagas()
]

// SET_RTC_INFO
// 1. root saga effect
export default rtc
