/**
 *
 * @code context.action.updateMediaPlayerStatus(true)
 */
import React, {useEffect, useState} from 'react'
import Lottie from 'react-lottie'
// etc
import equalizerLiveAni from "../ani/equalizer_live.json";
import CloseBtn from "../../../../common/images/ic_player_close_btn.svg";
import {useDispatch, useSelector} from "react-redux";
// image

// !Deprecated
export default (props) => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const [info, setInfo] = useState(globalState.nativePlayer)

  //useEffect Native
  useEffect(() => {
    //@Native
    if (globalState.nativePlayer !== null && globalState.nativePlayer !== undefined) {
      setInfo(globalState.nativePlayer)
    }
  }, [globalState.nativePlayer])
  //--
  useEffect(() => {
    if (info.auth === 3) {
      props.update({playerRemove: false})
    } else {
      props.update({playerRemove: true})
    }
  }, [info.auth])

  //---------------------------------------------------------------------

  return (
    <div id="player" >
      <div
        className="inner-player"
        onClick={() => {props.update({playerNavigator: true})}}
      >
        <div
          className="inner-player-bg"
          style={{background:`url(${info && info.bjProfImg}) center/contain no-repeat`}}
        />
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
          <div
            className="thumb"
            style={{backgroundImage:`url(${info && info.bjProfImg})`}}
          />
          <div className="room-info">
            <p className="title">{info.title}</p>
            <p>{info.bjNickNm}</p>
          </div>
          <div className="counting"></div>
          <div className="buttonGroup">
            <img
              src={CloseBtn} className="close-btn"
              onClick={() => {props.update({playerClose: true})}}
              alt={"close"}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
