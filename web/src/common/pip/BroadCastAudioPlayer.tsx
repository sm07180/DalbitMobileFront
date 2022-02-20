// others
import React, {useContext, useState,} from "react";
import {useHistory} from "react-router-dom";

// others
import {rtcSessionClear, UserType} from "common/realtime/rtc_socket";

// static
import {GlobalContext} from "context";

import {broadcastExit,} from "common/api";
import CloseBtn from "../images/ic_player_close_btn.svg";
import PlayIcon from "../static/ic_play.svg";
import PauseIcon from "../static/ic_pause.svg";
import {thumbInlineStyle} from "./PlayerStyle";


const BroadCastAudioPlayer = ()=>{
  const history = useHistory();
  const { globalState, globalAction } = useContext(GlobalContext);
  const {
    chatInfo,
    rtcInfo,
    isShowPlayer,
    guestInfo,
    exitMarbleInfo,
    userProfile
  } = globalState;
  const [mute, setMute] = useState(rtcInfo?.audioTag?.muted);
  const roomNo = sessionStorage.getItem("room_no") === null ? "" : sessionStorage.getItem("room_no") as string;

  const disconnectGuest = () => {
    if (guestInfo !== null) {
      const guestInfoKeyArray = Object.keys(guestInfo);

      if (guestInfoKeyArray.length > 0) {
        guestInfoKeyArray.forEach((v) => {
          guestInfo[v].stop?.();
          globalAction.dispatchGuestInfo!({
            type: "EMPTY",
          });
        });
      }
    }
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
    if ((rtcInfo !== undefined && rtcInfo !== null) || roomNo !== null) {
      const roomNo1 = rtcInfo ? rtcInfo.getRoomNo() : roomNo;
      history.push(`/broadcast/${roomNo1}`);
    }
  };

  const imgClickHandler = ()=>{
    if(mute){
      rtcInfo?.playMediaTag();
    }else{
      rtcInfo?.mutedMediaTag();
    }
    setMute(!mute);
  }


  return (
    <div id="player" style={{display: isShowPlayer ? "" : "none"}}>
      <div className="inner-player" onClick={playerBarClickEvent}>
        <div className="inner-player-bg"
             style={{background: `url("${rtcInfo?.roomInfo?.bgImg.thumb500x500}") center/contain no-repeat`}} />
        <div className="info-wrap">
          <div className="equalizer broadcast" />
          <div className="thumb"
               style={thumbInlineStyle(rtcInfo?.roomInfo?.bjProfImg)}
               onClick={(e) => e.stopPropagation()} />
          <div className="room-info">
            <p className="title">{`${rtcInfo?.roomInfo?.bjNickNm}`}</p>
            <p>{rtcInfo?.roomInfo?.title}</p>
          </div>
          <div className="counting"/>
        </div>
        {
          rtcInfo?.userType !== UserType.HOST &&
          <div className="buttonGroup">
            <img src={CloseBtn} className="close-btn" onClick={closeClickEvent} alt={"close"}/>
          </div>
        }
      </div>
    </div>
  )
}

export default BroadCastAudioPlayer;
