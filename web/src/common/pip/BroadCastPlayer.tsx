// others
import React, {useContext, useEffect} from "react";

// static
import {GlobalContext} from "context";
import {MediaType} from "pages/broadcast/constant";
import BroadCastVideoPlayer from "./BroadCastVideoPlayer";
import BroadCastAudioPlayer from "./BroadCastAudioPlayer";
import {rtcSessionClear, UserType} from "../realtime/rtc_socket";
import {broadcastExit, broadcastInfoNew} from "../api";
import {BroadcastContext} from "../../context/broadcast_ctx";

const BroadCastPlayer = ()=> {
  const {globalAction, globalState} = useContext(GlobalContext);
  const {broadcastAction} = useContext(BroadcastContext);
  const {baseData, rtcInfo, chatInfo, guestInfo} = globalState;
  const mediaType = rtcInfo?.roomInfo?.mediaType;

  useEffect(()=>{
    if (!baseData.isLogin && (rtcInfo || chatInfo)) {
      exit();
    }
    if(!rtcInfo){
      return;
    }
    broadcastInfoNewCheck();
  }, [baseData, rtcInfo, chatInfo]);
  const broadcastInfoNewCheck =()=>{
    broadcastInfoNew({ roomNo:rtcInfo?.getRoomNo() as string }).then(res=>{
      if(res.result === 'fail'){
        exit();
      }
    })
  }
  useEffect(()=>{
    if(!chatInfo){
      return;
    }
    if (chatInfo.privateChannelHandle === null) {
      if (
        chatInfo.socket != null &&
        chatInfo.socket.getState() === "open" &&
        chatInfo.chatUserInfo.roomNo !== null
      ) {
        chatInfo.binding(chatInfo.chatUserInfo.roomNo, (roomNo: string) => {});
      }
    }
  }, [chatInfo]);

  useEffect(() => {
    if (chatInfo !== null && rtcInfo !== null) {
      globalAction.setIsShowPlayer(true);
      //rtcInfo.initVideoTag();
      if (rtcInfo.getWsConnectionCheck()) {
        if (rtcInfo?.userType === UserType.HOST) {
          // rtcInfo.publish();
        }else{
          //rtcInfo.initVideoTag();
          // rtcInfo.playMediaTag();
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
        globalAction.dispatchRtcInfo({ type: "empty" });

        if (guestInfo) {
          Object.keys(guestInfo).forEach((v) => {
            guestInfo[v].stop();
          });
          globalAction.dispatchGuestInfo({type: "EMPTY"});
        }
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

export default BroadCastPlayer;