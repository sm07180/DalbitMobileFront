import React, {useEffect, useState} from 'react'
//context
import {Hybrid, isIos} from 'context/hybrid'
// etc
import {useDispatch, useSelector} from "react-redux";
import {
  setGlobalCtxNativePlayerInfo,
} from "redux/actions/globalCtx";
import equalizerLiveAni from "pages/common/newPlayer/ani/equalizer_live.json";
import CloseBtn from "common/images/ic_player_close_btn.svg";

import Lottie from 'react-lottie'
import {AuthType} from "constant";
import {nativeEnd} from "redux/actions/broadcast/interface";
import Room, {RoomJoin} from "context/room";

export default (props) => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const lottieOption = {
    loop: true,
    autoplay: true,
    animationData: equalizerLiveAni,
  };
  // App Audio PIP - 방장은 PIP 없음
  return (
    <>
      {
        globalState.player &&
        globalState.nativePlayer &&
        globalState.nativePlayer.auth !== AuthType.DJ &&
        <div id="player" >
          <div className="inner-player" onClick={() => {
            RoomJoin({roomNo: globalState.nativePlayer.roomNo})
          }}>
            <div
              className="inner-player-bg"
              style={{background:`url(${globalState.nativePlayer.bjProfImg}) center/contain no-repeat`}}
            />
            <div className="info-wrap">
              <div className="equalizer">
                <Lottie
                  options={lottieOption}
                  isClickToPauseDisabled={true}
                  width={24}
                  height={27}
                />
              </div>
              <div
                className="thumb"
                style={{backgroundImage:`url(${globalState.nativePlayer.bjProfImg})`}}
              />
              <div className="room-info">
                <p className="title">{globalState.nativePlayer.title}</p>
                <p>{globalState.nativePlayer.bjNickNm}</p>
              </div>
              <div className="counting"></div>
              <div className="buttonGroup">
                <img src={CloseBtn} className="close-btn" alt={"close"}
                  onClick={(event) => {
                    event.stopPropagation();
                    dispatch(setGlobalCtxNativePlayerInfo({nativePlayerInfo:{state:'close', roomNo:globalState.nativePlayer.roomNo}}));
                    Hybrid('ExitRoom', '');

                    // ios pip는 native-end 브릿지를 안보내서 웹에서 닫기 버튼 누를때 강제로 줌..
                    // fixme ios 1.8.6 버전부터 제거 대상
                    dispatch(nativeEnd({}));
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      }
    </>
  )
}
