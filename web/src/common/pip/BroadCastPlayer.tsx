// others
import React, {useContext, useEffect} from "react";

// static
import {GlobalContext} from "context";
import {MediaType} from "pages/broadcast/constant";
import BroadCastVideoPlayer from "./BroadCastVideoPlayer";
import BroadCastAudioPlayer from "./BroadCastAudioPlayer";
import {HostRtc, ListenerRtc, rtcSessionClear, UserType} from "../realtime/rtc_socket";
import {broadcastExit} from "../api";
import {BroadcastContext} from "../../context/broadcast_ctx";

const BroadCastPlayer = ()=> {
  const {globalAction, globalState} = useContext(GlobalContext);
  const {broadcastAction} = useContext(BroadcastContext);
  const {baseData, rtcInfo, chatInfo} = globalState;
  const mediaType = rtcInfo?.roomInfo?.mediaType;

  useEffect(()=>{
    if (!baseData.isLogin && (rtcInfo || chatInfo)) {
      exit();
    }
  }, [baseData, rtcInfo, chatInfo]);

  useEffect(()=>{
    if (!rtcInfo?.getRoomNo() || chatInfo === null) {
      return;
    }
    // chat init logic
    chatInfo.setRoomNo(rtcInfo?.getRoomNo());
    chatInfo.setMsgListWrapRef(null);
    chatInfo.setGlobalAction(globalAction);
    chatInfo.setBroadcastAction(broadcastAction);
    chatInfo.setDefaultData({ history });

    if (chatInfo.privateChannelHandle !== null) {
      return;
    }
    if (chatInfo.socket === null || chatInfo.socket.getState() !== "open" || chatInfo.chatUserInfo.roomNo === null) {
      return;
    }
    chatInfo.binding(chatInfo.chatUserInfo.roomNo, () => {});
  }, [chatInfo]);

  useEffect(() => {
    if (chatInfo !== null && rtcInfo !== null) {
      globalAction.setIsShowPlayer(true);
      rtcInfo.initVideoTag();
      if (rtcInfo.getWsConnectionCheck()) {
        if (rtcInfo?.userType === UserType.HOST) {
          rtcInfo.publish();
        }else{
          rtcInfo.initVideoTag();
          rtcInfo.playMediaTag();
        }
      }
    } else {
      globalAction.setIsShowPlayer(false);
    }
  },[chatInfo, rtcInfo]);

  const exit = async ()=>{
    const {result} = await broadcastExit({ roomNo:rtcInfo?.getRoomNo() as string });
    if (result === "success") {
      rtcSessionClear();
      globalAction.setIsShowPlayer(false);
      if (rtcInfo !== null) {
        chatInfo?.privateChannelDisconnect();
        rtcInfo.socketDisconnect();
        rtcInfo.stop();
        disconnectGuest();
        globalAction.dispatchRtcInfo({ type: "empty" });
      }
    }
  }

  if(mediaType == MediaType.VIDEO){
    return <BroadCastVideoPlayer/>
  }else if(mediaType == MediaType.AUDIO){
    return <BroadCastAudioPlayer/>
  }else{
    return <></>
  }
}

export const disconnectGuest = () => {
  const { globalState, globalAction } = useContext(GlobalContext);
  const {guestInfo} = globalState;

  if (!guestInfo) {
    return;
  }
  Object.keys(guestInfo).forEach((v) => {
    guestInfo[v].stop();
    globalAction.dispatchGuestInfo({type: "EMPTY"});
  });
};

export const initListenerRtc = (displayWrapRef=null) => {
  const { globalState, globalAction } = useContext(GlobalContext);

  const {rtcInfo} = globalState;

  if (!rtcInfo || !rtcInfo.roomInfo) {
    console.log('BroadCastPlayer initListenerRtc error');
    return;
  }

  const videoConstraints = {
    isVideo: rtcInfo.roomInfo.mediaType === MediaType.VIDEO,
  };

  const listenerRtc = new ListenerRtc(
    UserType.LISTENER,
    rtcInfo.roomInfo.webRtcUrl,
    rtcInfo.roomInfo.webRtcAppName,
    rtcInfo.roomInfo.webRtcStreamName,
    rtcInfo.roomInfo.roomNo,
    videoConstraints
  );
  listenerRtc.setRoomInfo(rtcInfo.roomInfo);
  listenerRtc.setDisplayWrapRef(displayWrapRef);
  listenerRtc.initVideoTag();
  globalAction.dispatchRtcInfo({ type: "init", data: listenerRtc });
}

export const initHostRtc = () => {
  const { globalState, globalAction } = useContext(GlobalContext);

  const {
    rtcInfo,
  } = globalState;

  const sessionRoomNo = sessionStorage.getItem("room_no") === null ? "" : sessionStorage.getItem("room_no") as string;

  if (!sessionRoomNo || !rtcInfo || !rtcInfo.roomInfo) {
    console.log('BroadCastPlayer initHostRtc error');
    return;
  }
  const videoConstraints = {
    isVideo: rtcInfo.roomInfo.mediaType === MediaType.VIDEO,
    videoFrameRate: rtcInfo.roomInfo.videoFrameRate,
    videoResolution: rtcInfo.roomInfo.videoResolution,
  };

  const hostRtc = new HostRtc(
    UserType.HOST,
    rtcInfo.roomInfo.webRtcUrl,
    rtcInfo.roomInfo.webRtcAppName,
    rtcInfo.roomInfo.webRtcStreamName,
    sessionRoomNo,
    false,
    videoConstraints
  );
  hostRtc.setRoomInfo(rtcInfo.roomInfo);
  globalAction.dispatchRtcInfo({ type: "init", data: hostRtc });
};

export default BroadCastPlayer;
