// others
import React, {useState,} from "react";
import {useHistory} from "react-router-dom";

import Lottie from 'react-lottie'
// others
import {rtcSessionClear, UserType} from "common/realtime/rtc_socket";

// static

import {broadcastExit,} from "common/api";
import CloseBtn from "../images/ic_player_close_btn.svg";
import {thumbInlineStyle} from "./PlayerStyle";

import equalizerLiveAni from "./ani/equalizer_live.json";
import {useDispatch, useSelector} from "react-redux";
import {
  setGlobalCtxExitMarbleInfo,
  setGlobalCtxGuestInfoEmpty,
  setGlobalCtxIsShowPlayer,
  setGlobalCtxRtcInfoEmpty
} from "../../redux/actions/globalCtx";

const BroadCastAudioPlayer = ()=>{
  const history = useHistory();
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
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
          dispatch(setGlobalCtxGuestInfoEmpty())
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
      dispatch(setGlobalCtxExitMarbleInfo({...exitMarbleInfo, showState: true}))
    }
    if (guestInfo !== null) {
      guestInfo[Object.keys(guestInfo)[0]].stop?.();
      dispatch(setGlobalCtxGuestInfoEmpty())
    }
    if (chatInfo && chatInfo.privateChannelHandle !== null) {
      chatInfo.privateChannelDisconnect();
    }
    rtcSessionClear();

    rtcInfo.socketDisconnect();
    rtcInfo.stop();
    disconnectGuest();
    dispatch(setGlobalCtxRtcInfoEmpty())
    dispatch(setGlobalCtxIsShowPlayer(false));
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
             style={{background: `url("${rtcInfo?.roomInfo?.bjProfImg.thumb500x500}") center/contain no-repeat`}} />
        <div className="info-wrap">
          <div className="equalizer">
            <Lottie
              options={{
                loop: true,
                autoplay: true,
                animationData: equalizerLiveAni,
              }}
              isClickToPauseDisabled={true}
              width={24}
              height={27}
            />
          </div>
          <div className="thumb"
               style={thumbInlineStyle(rtcInfo?.roomInfo?.bjProfImg)}
               onClick={(e) => e.stopPropagation()} />
          <div className="room-info">
            <p className="title">{rtcInfo?.roomInfo?.title}</p>
            <p>{`${rtcInfo?.roomInfo?.bjNickNm}`}</p>
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
