// others
import React, {useContext, useRef, useState,} from "react";
import {useHistory} from "react-router-dom";

// others
import {UserType} from "common/realtime/rtc_socket";

// static
import {GlobalContext} from "context";

import {
  broadcastExit,
} from "common/api";
import CloseBtn from "../images/ic_player_close_btn.svg";
import PlayIcon from "../static/ic_play.svg";
import {PlayerAudioStyled, thumbInlineStyle} from "./PlayerStyle";
import {initHostRtc, initListenerRtc} from "./BroadCastPlayer";

const BroadCastAudioPlayer = ()=>{
  const history = useHistory();
  const { globalState, globalAction } = useContext(GlobalContext);

  const {
    chatInfo,
    rtcInfo,
    isShowPlayer,
    guestInfo,
    exitMarbleInfo,
  } = globalState;

  const roomNo = sessionStorage.getItem("room_no") === null ? "" : sessionStorage.getItem("room_no") as string;

  const disconnectGuest = () => {
    if (guestInfo !== null) {
      const guestInfoKeyArray = Object.keys(guestInfo);

      if (guestInfoKeyArray.length > 0) {
        guestInfoKeyArray.forEach((v) => {
          guestInfo[v].stop();
          globalAction.dispatchGuestInfo!({
            type: "EMPTY",
          });
        });
      }
    }
  };

  const closeClickEvent = async (e: any) => {
    e.stopPropagation();
    // if ((rtcInfo !== null && rtcInfo !== undefined) || roomNo !== null) {
    //   if (rtcInfo?.getRoomNo()) {
    //     const { data, result } = await broadcastExit({ roomNo: roomNo1 });
    //     if (result === "success") {
    //       {
    //         globalAction.setExitMarbleInfo({
    //           ...exitMarbleInfo,
    //           rMarbleCnt: data.getMarbleInfo.rMarbleCnt,
    //           yMarbleCnt: data.getMarbleInfo.yMarbleCnt,
    //           bMarbleCnt: data.getMarbleInfo.bMarbleCnt,
    //           vMarbleCnt: data.getMarbleInfo.vMarbleCnt,
    //           isBjYn: data.getMarbleInfo.isBjYn,
    //           marbleCnt: data.getMarbleInfo.marbleCnt,
    //           pocketCnt: data.getMarbleInfo.pocketCnt,
    //         });
    //       }
    //       if (globalState.exitMarbleInfo.marbleCnt > 0 || globalState.exitMarbleInfo.pocketCnt > 0) {
    //         globalAction.setExitMarbleInfo({
    //           ...exitMarbleInfo,
    //           showState: true,
    //         });
    //       }
    //
    //       rtcSessionClear();
    //       if (chatInfo && chatInfo.privateChannelHandle !== null) {
    //         chatInfo.privateChannelDisconnect();
    //         if (rtcInfo !== null) {
    //           rtcInfo.socketDisconnect();
    //           rtcInfo.stop();
    //         }
    //         disconnectGuest();
    //         if (globalState.guestInfo !== null) {
    //           globalState.guestInfo[
    //             Object.keys(globalState.guestInfo)[0]
    //             ].stop();
    //           globalAction.dispatchGuestInfo!({
    //             type: "EMPTY",
    //           });
    //         }
    //         globalAction.dispatchRtcInfo &&
    //         globalAction.dispatchRtcInfo({ type: "empty" });
    //
    //         globalAction.setIsShowPlayer &&
    //         globalAction.setIsShowPlayer(false);
    //       }
    //     }
    //   }
    // }
  };

  const playerBarClickEvent = () => {
    if ((rtcInfo !== undefined && rtcInfo !== null) || roomNo !== null) {
      const roomNo1 = rtcInfo ? rtcInfo.getRoomNo() : roomNo;
      history.push(`/broadcast/${roomNo1}`);
    }
  };

  const imgClickHandler = ()=>{
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

  return (
    <PlayerAudioStyled style={{ display: isShowPlayer ? "" : "none" }}>
      <div className="inner-player" onClick={playerBarClickEvent}>
        <div className="info-wrap">
          <div className="equalizer">
            <p>{`LIVE`}</p>
          </div>
          <div className="thumb" style={thumbInlineStyle(rtcInfo?.roomInfo?.bjProfImg)} onClick={(e) => e.stopPropagation()}>
            <img onClick={imgClickHandler} src={PlayIcon} className="playToggle__play" alt={"thumb img"}/>
          </div>
          <div className="room-info">
            <p className="title">{`${rtcInfo?.roomInfo?.bjNickNm}`}</p>
            <p>{rtcInfo?.roomInfo?.title}</p>
          </div>
          <div className="counting"/>
        </div>
        {
          rtcInfo?.userType !== UserType.HOST &&
          <img src={CloseBtn} className="close-btn" onClick={closeClickEvent} alt={"close"}/>
        }
      </div>
    </PlayerAudioStyled>
  )
}

export default BroadCastAudioPlayer;
