import React, {useContext} from "react"
import BroadCastPlayer from "./BroadCastPlayer";
import ClipAudioPlayer from "./ClipAudioPlayer";
import qs from 'query-string'
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";

/**
 * index - 클립, 방송 라우팅
 * BroadCastPlayer - 비디오, 오디오 구분 및 effect 정의
 * BroadCastVideoPlayer - 비디오 뷰
 * BroadCastAudioPlayer - 오디오 뷰
 * ClipAudioPlayer - 클립 effect, 뷰
 * PlayerStyle - styled component, inline style util
 */
const PipPlayer = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const {clipPlayer, clipInfo, rtcInfo} = globalState;

  const broadcastPage = history.location.pathname.startsWith("/broadcast");
  const clipPlayerPage = history.location.pathname.startsWith("/clip/");
  const mailboxChatting = history.location.pathname.startsWith("/mailbox");
  const {webview} = qs.parse(location.search)

  if (history.location.pathname.startsWith(`/rule`) || webview === 'new') {
    return <></>;
  }

  if (rtcInfo) {
    if (!broadcastPage && !mailboxChatting) {
      return <BroadCastPlayer/>;
    }
  } else if (clipInfo) {
    if (clipPlayer && !clipPlayerPage && !mailboxChatting) {
      return <ClipAudioPlayer/>;
    }
  }

  return <></>;
}

export default PipPlayer
