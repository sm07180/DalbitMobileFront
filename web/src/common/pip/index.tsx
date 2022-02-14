import React, {useContext, useEffect} from "react"
import {GlobalContext} from "context";
import BroadCastPlayer from "./BroadCastPlayer";
import ClipAudioPlayer from "./ClipAudioPlayer";
import {rtcSessionClear, UserType} from "../realtime/rtc_socket";
import {broadcastExit, broadcastInfoNew, broadcastJoin} from "../api";
import {authCheck} from "../../pages/broadcast/side_wrapper";
import {useHistory} from "react-router-dom";

/**
 * index - 클립, 방송 라우팅
 * BroadCastPlayer - 비디오, 오디오 구분 및 effect 정의
 * BroadCastVideoPlayer - 비디오 뷰
 * BroadCastAudioPlayer - 오디오 뷰
 * ClipAudioPlayer - 클립 effect, 뷰
 * PlayerStyle - styled component, inline style util
 */
const PipPlayer = () =>{
  const { globalState } = useContext(GlobalContext);

  const { clipPlayer, clipInfo, rtcInfo } = globalState;

  const broadcastPage = window.location.pathname.startsWith("/broadcast");
  const clipPlayerPage = window.location.pathname.startsWith("/clip/");
  const mailboxChatting = window.location.pathname.startsWith("/mailbox");

  if(rtcInfo){
    if(!broadcastPage && !mailboxChatting){
      return <BroadCastPlayer />;
    }
  }else if(clipInfo){
    if(clipPlayer && !clipPlayerPage && !mailboxChatting){
      return <ClipAudioPlayer/>;
    }
  }

  return <></>;
}

export default PipPlayer
