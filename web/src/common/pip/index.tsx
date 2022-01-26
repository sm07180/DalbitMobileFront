import React, {useContext, useEffect} from "react"
import {GlobalContext} from "../../context";
import BroadCastPlayer, {disconnectGuest} from "./BroadCastPlayer";
import ClipAudioPlayer from "./ClipAudioPlayer";
import {rtcSessionClear, UserType} from "../realtime/rtc_socket";
import {broadcastExit, broadcastInfoNew, broadcastJoin} from "../api";
import {authCheck} from "../../pages/broadcast/side_wrapper";
import {useHistory} from "react-router-dom";
import {BroadcastContext} from "../../context/broadcast_ctx";

/**
 * index - 클립, 방송 라우팅
 * BroadCastPlayer - 비디오, 오디오 구분 및 effect 정의
 * BroadCastVideoPlayer - 비디오 뷰
 * BroadCastAudioPlayer - 오디오 뷰
 * ClipAudioPlayer - 클립 effect, 뷰
 * PlayerStyle - styled component, inline style util
 */
const PipPlayer = () =>{
  const history = useHistory();
  const { globalState, globalAction } = useContext(GlobalContext);
  const { broadcastAction } = useContext(BroadcastContext);

  const { clipPlayer, clipInfo, rtcInfo, baseData, chatInfo, guestInfo } = globalState;

  const broadcastPage = window.location.pathname.startsWith("/broadcast");
  const clipPlayerPage = window.location.pathname.startsWith("/clip/");
  const mailboxChatting = window.location.pathname.startsWith("/mailbox");
  const roomNo = rtcInfo?.roomInfo?.roomNo;

  // const broadcastJoinAction = async () => {
  //   if (!roomNo) {
  //     return;
  //   }
  //   const {result, data, code, message} = await broadcastJoin({roomNo: roomNo, shadow: globalState.shadowAdmin});
  //   if (result === "success") {
  //     // 방 정보 설정
  //     const dispatchRoomInfo = {
  //       ...data,
  //       currentMemNo: globalState.baseData.isLogin ? globalState.baseData.memNo : "",
  //       broadState: data.state !== 2,
  //     };
  //
  //     broadcastAction.dispatchRoomInfo!({type: "reset", data: dispatchRoomInfo});
  //     broadcastAction.setChatFreeze!(data.isFreeze);
  //     chatInfo?.setChatFreeze(data.isFreeze);
  //     broadcastAction.setExtendTimeOnce!(data.isExtend);
  //     broadcastAction.setLikeClicked!(data.isLike);
  //     sessionStorage.setItem("room_no", roomNo);
  //   } else if (result === "fail") {
  //     globalAction.setIsShowPlayer(false);
  //     if (code === "-6") {
  //       // 20세 이상
  //       authCheck();
  //     } else if (code === "-8") {
  //       // Host Join case
  //       globalAction.setAlertStatus({
  //         status: true,
  //         title: "알림",
  //         content:
  //           "해당 방송은 다른 기기에서 DJ로 방송 중이므로 청취자로 입장할 수 없습니다.",
  //         callback: () => history.push("/"),
  //         cancelCallback: () => history.push("/"),
  //       });
  //     } else {
  //       if (chatInfo) {
  //         chatInfo.privateChannelDisconnect();
  //         if (rtcInfo !== null) rtcInfo!.stop();
  //         disconnectGuest();
  //         globalAction.dispatchRtcInfo!({type: "empty"});
  //       }
  //       rtcSessionClear();
  //       globalAction.setAlertStatus({
  //         status: true,
  //         title: "알림",
  //         content: `${message}`,
  //         callback: () => history.push("/"),
  //         cancelCallback: () => history.push("/"),
  //       });
  //     }
  //   }
  // }
  // async function broadcastInit() {
  //   if (!roomNo) {
  //     console.log(`broadcastInit sessionRoomNo undefined`)
  //     return;
  //   }
  //   const { result, data, message, code } = await broadcastInfoNew({roomNo: roomNo});
  //   if(result === "success"){
  //     if(!data){
  //       console.log(`broadcastInit data undefined`)
  //       return;
  //     }
  //     // 방 정보 설정
  //     const resetData = {
  //       ...data,
  //       currentMemNo: globalState.baseData.isLogin ? globalState.baseData.memNo : "",
  //       broadState: data.state !== 2,
  //     };
  //
  //     broadcastAction.dispatchRoomInfo({type: "reset", data: resetData});
  //     broadcastAction.setChatFreeze!(data.isFreeze);
  //     chatInfo?.setChatFreeze(data.isFreeze);
  //     broadcastAction.setExtendTimeOnce!(data.isExtend);
  //     broadcastAction.setLikeClicked!(data.isLike);
  //     globalAction.setIsShowPlayer(true);
  //   }else{
  //     // 스트림아이디_요청회원_방소속아님
  //     if(code === "-3"){
  //       broadcastJoinAction();
  //     }else{
  //       chatInfo?.privateChannelDisconnect();
  //       rtcInfo?.stop();
  //       globalAction.dispatchRtcInfo({ type: "empty" });
  //       globalAction.setIsShowPlayer(false);
  //       rtcSessionClear();
  //       disconnectGuest();
  //     }
  //   }
  // }

  // useEffect(()=>{
  //   if(rtcInfo){
  //     return;
  //   }
  //   if(!broadcastPage && !mailboxChatting && roomNo){
  //     broadcastInit();
  //   }
  // }, [rtcInfo]);

  // rtcInfo, clipInfo 동시에 있는 케이스가 있는지..?
  if(rtcInfo){
    if(!broadcastPage && !mailboxChatting){
      return <BroadCastPlayer />;
    }
  }else if(clipInfo){
    if(!clipPlayer && !clipPlayerPage && !mailboxChatting){
      return <ClipAudioPlayer/>;
    }
  }

  return <></>;
}

export default PipPlayer
