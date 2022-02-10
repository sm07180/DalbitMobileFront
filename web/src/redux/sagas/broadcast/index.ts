// noinspection SpellCheckingInspection

import {takeEvery, call, put, select, fork, take, getContext} from "redux-saga/effects";
import {
	BROADCAST_CREATE,
	AGORA_JOIN,
	CREATE_CLIENT,
	SET_CLIENT,
	SET_CLIENT_STATE,
	SET_ROOM_INFO, SET_LOCAL_TRACK
} from "../../actions/broadcast";
import AgoraRTC, {BeautyEffectOptions, ClientConfig, IAgoraRTCClient} from "agora-rtc-sdk-ng";
import {broadcastCreate, getBroadcastSetting} from "../../../common/api";
import {BroadcastSettingType} from "../../types/broadcastType";

function* createClient() {
	while (true) {
		// 3. take Effect로 CREATE_CLIENT Action이 dispatch 되길 기다린다.
		// 4. (특정 시점에 CREATE_CLIENT Action이 dispatch된다.)
		const action = yield take(CREATE_CLIENT);
		const client = AgoraRTC.createClient({mode: "live", codec: "vp8"});
		client.on("connection-state-change", (curState, revState, reason) => {
			console.log(`@@ `,curState, revState, reason)
		})
		// 5. put Effect를 사용하여 SET_CLIENT를 dispatch한다.
		yield put({type: SET_CLIENT, payload: client})
	}
}

function* agoraCreate() {
	while (true) {
		const action = yield take(BROADCAST_CREATE);
		console.log(`@AGORA_CREATE`, action);
		const client:IAgoraRTCClient = yield select(({broadcast})=> broadcast.agora.client);

		const createResult = yield call(broadcastCreate, action.payload);
		const roomInfo = createResult.data;
		console.log(`@createResult`, createResult);

		yield put({type: SET_ROOM_INFO, payload: roomInfo});

		if(client.connectionState === 'DISCONNECTED') {
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
			// todo saga history move 찾기
		}else if(client.connectionState === 'CONNECTED'){
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

const broadcast = [
	// 2. fork Effect로 인해 createClient Task 실행
	fork(createClient),
	// fork(join),
	fork(agoraCreate),
]

// 1. root saga effect
export default broadcast
