// others
import React, {useContext, useEffect,} from "react";
import {useHistory} from "react-router-dom";

// static
import {GlobalContext} from "context";

import {clipPlayConfirm,} from "common/api";
import CloseBtn from "../images/ic_player_close_btn.svg";

import PauseIcon from "../static/ic_pause.svg";
import PlayIcon from "../static/ic_play.svg";
import {audioEndHandler} from "../../pages/clip_player/components/player_box";

import {PlayerAudioStyled, thumbInlineStyle} from "./PlayerStyle"

const ClipAudioPlayer = ()=>{
  const history = useHistory();
  const { globalState, globalAction } = useContext(GlobalContext);
  const { clipPlayer, clipPlayList, clipInfo, baseData, userProfile } = globalState;

  useEffect(() => {
    if (baseData.isLogin) {
      globalAction.setIsShowPlayer(true);
    }
  },[baseData]);

  useEffect(() => {
    if(!clipInfo || !clipPlayer){
      return;
    }

    if(clipInfo.isSaved60seconds && clipPlayer.save60seconds >= 59){
      clipPlayConfirm({clipNo: clipInfo.clipNo, playIdx: clipInfo.playIdx,}).then(res => {
        const { result } = res;
        if (result === "success") {
          clipPlayer.initSave60seconds();
        }
      })
    }
  }, [clipInfo, clipPlayer]);

  useEffect(() => {
    if (clipPlayList.length > 0) {
      clipPlayer?.clipAudioTag?.addEventListener("ended", audioEndHandler);
    }

    return () => {
      clipPlayer?.clipAudioTag?.removeEventListener("ended", audioEndHandler);
    };
  }, [clipPlayer, clipPlayList]);

  const closeClickEvent = async (e) => {
    e.stopPropagation();
    clipPlayer?.clipExit();
    sessionStorage.removeItem("clip");
    sessionStorage.removeItem("clipPlayListInfo");
  };

  const playerBarClickEvent = () => {
    if (clipInfo !== undefined && clipInfo !== null) {
      const { clipNo } = clipInfo;
      history.push(`/clip/${clipNo}`);
    }
  };

  const playIconClick = () => {
    if (clipInfo!.isPaused) {
      clipPlayer!.start();
    } else {
      clipPlayer!.stop();
    }
  }

  const playToggle = (e)=>{
    e.stopPropagation()
    if(!clipInfo?.isPaused){
      clipPlayer?.stop()
    }else{
      clipPlayer?.start()
    }
  }
  // 클립 정보가 있고, 로그인 상태
  if(clipInfo && clipPlayer && baseData.isLogin){
    const isPaused = clipInfo?.isPaused;
    const toggleInfo = {
      src:isPaused ? PlayIcon : PauseIcon
      , className:isPaused ? "playToggle__play":"playToggle__stop"
      , alt:isPaused? "start":"stop"
    }
    return(
      <div id="player">
        <div className="inner-player" onClick={playerBarClickEvent}>
          <div className="info-wrap">
            <div className="inner-player-bg"
                 style={{background: `url("${userProfile.profImg.thumb500x500}") center/contain no-repeat`,}} />
            <div className="equalizer clip" />
            <div className="thumb" style={thumbInlineStyle(clipInfo.bgImg)} onClick={playToggle}>
              <img src={toggleInfo.src} className={toggleInfo.className} alt={toggleInfo.alt}/>
            </div>
            <div className="room-info">
              <p className="title">{`${clipInfo.nickName}`}</p>
              <p>{clipInfo.title}</p>
            </div>
            <div className="counting"/>
          </div>
          <div className="buttonGroup">
             <img onClick={playIconClick} src={clipInfo!.isPaused ? PauseIcon : PlayIcon} className="playToggle__play" alt={"thumb img"}/>
            <img src={CloseBtn} className="close-btn" onClick={closeClickEvent} alt={"close"}/>
          </div>
          
        </div>
      </div>
    )
  }else{
    return (<></>)
  }
}

export default ClipAudioPlayer
