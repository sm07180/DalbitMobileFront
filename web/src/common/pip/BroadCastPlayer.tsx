// others
import React, {useContext, useEffect} from "react";

// static
import {MediaType} from "pages/broadcast/constant";
import BroadCastVideoPlayer from "./BroadCastVideoPlayer";
import BroadCastAudioPlayer from "./BroadCastAudioPlayer";
import {rtcSessionClear, UserType} from "../realtime/rtc_socket";
import {broadcastExit, broadcastInfoNew} from "../api";
import {useDispatch, useSelector} from "react-redux";
import {
  setGlobalCtxGuestInfoEmpty,
  setGlobalCtxIsShowPlayer,
  setGlobalCtxRtcInfoEmpty
} from "../../redux/actions/globalCtx";

const BroadCastPlayer = ()=> {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
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
    // if(!chatInfo.chatUserInfo.roomNo){
    //   chatInfo.setRoomNo(rtcInfo?.roomInfo?.roomNo)
    // }

    if(rtcInfo?.roomInfo?.mediaType === MediaType.VIDEO){
      if (chatInfo.privateChannelHandle === null) {
        if (
            chatInfo.socket != null &&
            chatInfo.socket.getState() === "open" &&
            chatInfo.chatUserInfo.roomNo !== null
        ) {
          chatInfo.binding(chatInfo.chatUserInfo.roomNo, (roomNo: string) => {});
        }
      }
    }else{
      if (chatInfo.privateChannelHandle === null) {
        if (
            chatInfo.socket != null &&
            chatInfo.socket.getState() === "open" &&
            chatInfo.chatUserInfo.roomNo !== null
        ) {
          chatInfo.binding(chatInfo.chatUserInfo.roomNo, (roomNo: string) => {
          });
        }
      }
    }
  }, [chatInfo]);

  useEffect(() => {
    if (chatInfo !== null && rtcInfo !== null) {
      dispatch(setGlobalCtxIsShowPlayer(true));
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
      dispatch(setGlobalCtxIsShowPlayer(false));
    }
  },[chatInfo, rtcInfo]);

  const exit = async ()=>{
    const {result} = await broadcastExit({ roomNo:rtcInfo?.getRoomNo() as string });
    if (result === "success") {
      rtcSessionClear();
      dispatch(setGlobalCtxIsShowPlayer(false));
      if (rtcInfo !== null) {
        chatInfo?.privateChannelDisconnect();
        rtcInfo.socketDisconnect();
        rtcInfo.stop();
        dispatch(setGlobalCtxRtcInfoEmpty());

        if (guestInfo) {
          Object.keys(guestInfo).forEach((v) => {
            guestInfo[v].stop?.();
          });
          dispatch(setGlobalCtxGuestInfoEmpty());
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
