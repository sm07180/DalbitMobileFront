/**
 *
 * @code context.action.updateMediaPlayerStatus(true)
 */
import React, {useState} from 'react'
//context
import {Hybrid} from 'context/hybrid'
// etc
import Utility from 'components/lib/utility'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxNativePlayerState, setGlobalCtxPlayer} from "redux/actions/globalCtx";
import equalizerLiveAni from "pages/common/newPlayer/ani/equalizer_live.json";
import CloseBtn from "common/images/ic_player_close_btn.svg";

import Lottie from 'react-lottie'
import {AuthType} from "constant";
import {nativeEnd} from "redux/actions/broadcast/interface";

export default (props) => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const lottieOption = {
    loop: true,
    autoplay: true,
    animationData: equalizerLiveAni,
  };
  // App Pip - 방장은 PIP 없음
  return (
    <>
      {
        globalState.nativePlayer &&
        globalState.player &&
        globalState.nativePlayer.auth !== AuthType.DJ &&
        <div id="player" >
          <div className="inner-player" onClick={() => {
            if (Utility.getCookie('listen_room_no')){
              Hybrid('EnterRoom', '')
            }
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
                    // dispatch(nativeEnd());
                    // sessionStorage.removeItem('room_no')
                    // Utility.setCookie('listen_room_no', null)
                    // dispatch(setGlobalCtxPlayer(false));
                    // alert('@@ExitRoom')
                    dispatch(setGlobalCtxNativePlayerState({nativePlayerState:'progress'}))
                    Hybrid('ExitRoom', '')
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
