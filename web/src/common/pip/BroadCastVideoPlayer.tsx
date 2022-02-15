// others
import React, {useContext, useEffect, useRef, useState,} from "react";
import {useHistory} from "react-router-dom";
import {IMG_SERVER} from "constant/define";

import {NoticeDisplayStyled, PlayerVideoStyled} from "./PlayerStyle";
// others
import {rtcSessionClear, UserType} from "common/realtime/rtc_socket";

// static
import {GlobalContext} from "context";

import {broadcastExit} from "common/api";

const BroadCastVideoPlayer = ()=>{
  const history = useHistory();
  const {globalState, globalAction} = useContext(GlobalContext);
  const {chatInfo, rtcInfo, isShowPlayer, guestInfo, exitMarbleInfo} = globalState;
  const displayWrapRef = useRef<HTMLDivElement>(null);

  const disconnectGuest = () => {
    if (guestInfo === null) {
      return;
    }
    Object.keys(guestInfo).forEach((v) => {
      guestInfo[v].stop?.();
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
      guestInfo[Object.keys(guestInfo)[0]].stop?.();
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

  useEffect(()=>{
    if(!rtcInfo){
      return
    }
    if (rtcInfo.userType === UserType.HOST) {
      rtcInfo.join(rtcInfo.roomInfo);
    }else{
      if(!rtcInfo?.getDisplayListWrapRef()){
        rtcInfo?.setDisplayWrapRef(displayWrapRef)
      }
      rtcInfo.join(rtcInfo.roomInfo);
    }
  }, [rtcInfo]);

  // if(rtcInfo?.userType === UserType.HOST){
  const playerVideoStyledProps = {
    style:{ display: isShowPlayer ? "" : "none" },
    className:`${!rtcInfo && "back"}`,
    ref:displayWrapRef,
    onClick:playerBarClickEvent
  }
  // fixme 스타일 잡히면 제거
  const localPlayerStyledProps = {
    style: {height: "100%"}
  }
  return(
    <div id={"broadcast-page"}>
      <div className="left-side">
        <PlayerVideoStyled {...playerVideoStyledProps}>
          <div id="local-player" className="player" {...localPlayerStyledProps} />
          <div className="chat-display" ref={displayWrapRef} style={{ backgroundImage: `url(${rtcInfo?.roomInfo?.bgImg.url})` }}>
            <NoticeDisplayStyled id="broadcast-notice-display"/>
          </div>
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
            rtcInfo?.userType === UserType.LISTENER &&
            <img src={`${IMG_SERVER}/broadcast/ico_close_w_m.svg`} className="close-btn" onClick={closeClickEvent} alt={"close"}/>
          }

        </PlayerVideoStyled>
      </div>
    </div>
  )
}

export default BroadCastVideoPlayer;