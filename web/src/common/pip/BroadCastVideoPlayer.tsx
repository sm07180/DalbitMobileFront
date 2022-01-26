// others
import React, {useContext, useEffect, useRef, useState,} from "react";
import {useHistory} from "react-router-dom";
import {IMG_SERVER} from "constant/define";

import {PlayerVideoStyled} from "./PlayerStyle";
// others
import {rtcSessionClear, UserType} from "common/realtime/rtc_socket";

// static
import {GlobalContext} from "context";

import {broadcastExit} from "common/api";
import {initHostRtc, initListenerRtc} from "./BroadCastPlayer";

const BroadCastVideoPlayer = ()=>{
  const history = useHistory();
  const {globalState, globalAction} = useContext(GlobalContext);
  const {chatInfo, rtcInfo, isShowPlayer, guestInfo, exitMarbleInfo} = globalState;
  const displayWrapRef = useRef<HTMLDivElement>(null);
  const [playerState, setPlayerState] = useState<'play'|'stop'>('stop');

  const disconnectGuest = () => {
    if (guestInfo === null) {
      return;
    }
    Object.keys(guestInfo).forEach((v) => {
      guestInfo[v].stop();
    });
    globalAction.dispatchGuestInfo({type: "EMPTY"});
  };

  const closeClickEvent = async (e) => {
    e.stopPropagation();
    if(!rtcInfo){
      return;
    }

    const { data, result } = await broadcastExit({ roomNo: rtcInfo.getRoomNo() });
    if (result !== "success") {
      console.log(`broadcastExit fail`);
      return;
    }
    if(data && data.getMarbleInfo){
      globalAction.setExitMarbleInfo({
        ...exitMarbleInfo,
        rMarbleCnt: data.getMarbleInfo.rMarbleCnt,
        yMarbleCnt: data.getMarbleInfo.yMarbleCnt,
        bMarbleCnt: data.getMarbleInfo.bMarbleCnt,
        vMarbleCnt: data.getMarbleInfo.vMarbleCnt,
        isBjYn: data.getMarbleInfo.isBjYn,
        marbleCnt: data.getMarbleInfo.marbleCnt,
        pocketCnt: data.getMarbleInfo.pocketCnt,
      });
    }

    if (exitMarbleInfo.marbleCnt > 0 || exitMarbleInfo.pocketCnt > 0) {
      globalAction.setExitMarbleInfo({...exitMarbleInfo, showState: true});
    }
    if (guestInfo !== null) {
      guestInfo[Object.keys(guestInfo)[0]].stop();
      globalAction.dispatchGuestInfo({ type: "EMPTY" });
    }
    if (chatInfo && chatInfo.privateChannelHandle !== null) {
      chatInfo.privateChannelDisconnect();
    }
    rtcSessionClear();

    rtcInfo.socketDisconnect();
    rtcInfo.stop();
    disconnectGuest();
    globalAction.dispatchRtcInfo({ type: "empty" });
    globalAction.setIsShowPlayer(false);
  };

  const playerBarClickEvent = () => {
    if (!rtcInfo) {
      return;
    }
    history.push(`/broadcast/${rtcInfo?.getRoomNo()}`);
  };

  const toggleClick = (e)=>{
    e.stopPropagation();

    if (rtcInfo?.userType === UserType.HOST) {
      if (rtcInfo !== null) {
        if (rtcInfo.getPeerConnectionCheck()) {
          rtcInfo.publish();
        }
      } else {
        initHostRtc();
      }
    } else {
      if (rtcInfo !== null && rtcInfo.audioTag) {
        if (rtcInfo.getPeerConnectionCheck()) {
          rtcInfo.playMediaTag();
        }
      } else {
        initListenerRtc();
      }
    }
  }
  // globalAction.dispatchAgoraRtc({ type: "init", data: agora });
  //console.log(`@@rtcInfo`, rtcInfo)
  //console.log(`@@chatInfo`, chatInfo)
  // console.log(`@@isShowPlayer`, isShowPlayer)
  // console.log(`@@guestInfo`, guestInfo)
  // console.log(`@@exitMarbleInfo`, exitMarbleInfo)
  // console.log(`@@agoraRtc`, agoraRtc)

  // setDisplayWrapRef
  useEffect(()=>{
    if(!rtcInfo?.getDisplayListWrapRef()){
      rtcInfo?.setDisplayWrapRef(displayWrapRef)
    }

    if(rtcInfo){
      rtcInfo.join(rtcInfo.roomInfo);
      //setPlayerState('play');
    }
  }, [rtcInfo]);

  return(
    <PlayerVideoStyled
      style={{ display: isShowPlayer ? "" : "none" }}
      className={`${!rtcInfo && "back"} ${rtcInfo?.userType === UserType.HOST && "unVisible"}`}
      ref={displayWrapRef}
      onClick={playerBarClickEvent}
    >
      {/*{*/}
      {/*  rtcInfo &&*/}
      {/*  <div onClick={toggleClick} className="playToggle__play">*/}
      {/*    <div className="playBox">*/}
      {/*      <img src={`${IMG_SERVER}/broadcast/ico_circle_play_l.svg`} alt="play"/>*/}
      {/*      <br />*/}
      {/*      <p>방송이 일시정지 되었습니다.</p>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*}*/}
      {/*{*/}
      {/*  rtcInfo?.userType === UserType.HOST &&*/}
      {/*  <canvas id="deepar-canvas" onContextMenu={(e) => {e.preventDefault();}}/>*/}
      {/*}*/}
      {
        (!rtcInfo || !rtcInfo?.getPeerConnectionCheck()) &&
        <div className="playToggle__play auto">
          <div className="playBox">
            <img src={`${IMG_SERVER}/broadcast/ico_loading_l.svg`} alt="play"/>
          </div>
        </div>
      }
      {
        rtcInfo?.userType !== UserType.HOST &&
        <img src={`${IMG_SERVER}/broadcast/ico_close_w_m.svg`} className="close-btn" onClick={closeClickEvent} alt={"close"}/>
      }
    </PlayerVideoStyled>
  )
}

export default BroadCastVideoPlayer;
