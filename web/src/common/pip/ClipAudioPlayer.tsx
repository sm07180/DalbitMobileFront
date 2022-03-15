// others
import React, {useEffect,} from "react";
import {useHistory} from "react-router-dom";

import Lottie from 'react-lottie'
// static

import {clipPlayConfirm,} from "common/api";
import CloseBtn from "../images/ic_player_close_btn.svg";

import PauseIcon from "../static/ic_pause.svg";
import PlayIcon from "../static/ic_play.svg";
import {audioEndHandler} from "../../pages/clip_player/components/player_box";

import {thumbInlineStyle} from "./PlayerStyle"

import equalizerClipAni from "./ani/equalizer_clip.json";
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxIsShowPlayer} from "../../redux/actions/globalCtx";

const ClipAudioPlayer = ()=>{
  const history = useHistory();
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const { clipPlayer, clipPlayList, clipInfo, baseData, userProfile } = globalState;

  useEffect(() => {
    if (baseData.isLogin) {
      dispatch(setGlobalCtxIsShowPlayer(true));
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

  const playerBarClickEvent = (e) => {
    e.preventDefault();
    if (clipInfo !== undefined && clipInfo !== null) {
      const { clipNo } = clipInfo;
      history.push(`/clip/${clipNo}`);
    }
  };

  const playIconClick = (e) => {
    e.stopPropagation();
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
          <div className="inner-player-bg"
               style={{background: `url("${clipInfo.bgImg.thumb500x500}") center/contain no-repeat`,}} />
          <div className="info-wrap">
            <div className="equalizer">
              <Lottie
                options={{
                  loop: true,
                  autoplay: true,
                  animationData: equalizerClipAni,
                }}
                isClickToPauseDisabled={true}
                width={24}
                height={27}
              />
            </div>
            <div className="thumb" style={thumbInlineStyle(clipInfo.bgImg)} onClick={playToggle} />
            <div className="room-info">
              <p className="title">{clipInfo.title}</p>
              <p>{`${clipInfo.nickName}`}</p>
            </div>
            <div className="counting"/>
          </div>
          <div className="buttonGroup">
            <img onClick={playIconClick} src={clipInfo!.isPaused ? PlayIcon : PauseIcon} className="playToggle__play" alt={"thumb img"}/>
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
