/**
 *
 * @code context.action.updateMediaPlayerStatus(true)
 */
import React, {useState, useEffect, useContext} from 'react'
import _ from 'lodash'
import Lottie from 'react-lottie'
//context
import {Context} from 'context'
// etc
import equalizerLiveAni from "../ani/equalizer_live.json";
import CloseBtn from "../../../../common/images/ic_player_close_btn.svg";
// image

export default (props) => {
  //---------------------------------------------------------------------
  //context
  const context = useContext(Context)
  const {broadcastTotalInfo} = context
  //useState
  // const [info, setInfo] = useState({
  //   /**
  //    * {roomNo,bjNickNm,title,bjProfImg,auth}
  //    */
  //   bjNickNm: '',
  //   roomNo: null,
  //   bjProfImg: 'https://6.viki.io/image/a11230e2d98d4a73825a4c10c8c6feb0.jpg?x=b&a=0x0&s=460x268&e=t&f=t&cb=1',
  //   title: '',
  //   auth: 0
  // })
  const [info, setInfo] = useState(context.nativePlayer)

  //---------------------------------------------------------------------
  const makeCloseBtn = () => {
    if (info.auth === 3) return
    return (
      <button
        className="close"
        onClick={() => {
          props.update({playerClose: true})
        }}>
        닫기
      </button>
    )
  }
  //useEffect Native
  useEffect(() => {
    //@Native
    if (context.nativePlayer !== null && context.nativePlayer !== undefined) {
      setInfo(context.nativePlayer)
    }
  }, [context.nativePlayer])
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
          style={{backgroundImage:`url(${info && info.bjProfImg})`}}
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
