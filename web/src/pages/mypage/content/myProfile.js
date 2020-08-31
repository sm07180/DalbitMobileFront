/**
 * @file /mypage/content/my-profile.js
 * @brief 마이페이지 상단에 보이는 내 프로필 component
 */
import React, {useEffect, useContext, useState} from 'react'
import qs from 'query-string'
import {useHistory} from 'react-router-dom'

//route
import {OS_TYPE} from 'context/config.js'
import Room, {RoomJoin} from 'context/room'
//styled
import styled from 'styled-components'
import Swiper from 'react-id-swiper'
//component
import ProfileReport from './profile_report'
import ProfileFanList from './profile_fanList'
import ProfilePresent from './profile_present'
import LayerPopupExp from './layer_popup_exp.js'
import {saveUrlAndRedirect} from 'components/lib/link_control.js'
// context
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {WIDTH_TABLET_S, IMG_SERVER} from 'context/config'
import Api from 'context/api'
import {Context} from 'context'
import Utility, {printNumber, addComma} from 'components/lib/utility'
//util
import LiveIcon from '../component/ic_live.svg'
import {Hybrid, isHybrid} from 'context/hybrid'
import ProfileDetail from './profile_detail'

//render -----------------------------------------------------------------
const myProfile = (props) => {
  const history = useHistory()
  const {webview, profile, locHash} = props
  //context
  const context = useContext(Context)
  const {mypageReport, close, closeFanCnt, closeStarCnt, closePresent} = context
  //pathname & MemNo
  const urlrStr = props.location.pathname.split('/')[2]
  const myProfileNo = context.profile.memNo

  //state
  const [Zoom, setZoom] = useState(false)
  const [popup, setPopup] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [reportShow, SetShowReport] = useState(false)
  //pop
  const [popupExp, setPopupExp] = useState(false)
  // function
  //zoom
  const figureZoom = () => {
    setZoom(true)
  }
  //팬등록
  async function fetchDataFanRegist(myProfileNo) {
    const res = await Api.fan_change({
      data: {
        memNo: urlrStr
      }
    })
    if (res.result === 'success') {
      context.action.alert({
        callback: () => {
          context.action.updateMypageFanCnt(myProfileNo)
        },
        msg: '팬등록에 성공하였습니다.'
      })
    } else if (res.result === 'fail') {
      context.action.alert({
        callback: () => {},
        msg: res.message
      })
    }
  }
  //function:팬해제
  const Cancel = (myProfileNo) => {
    async function fetchDataFanCancel(myProfileNo) {
      const res = await Api.mypage_fan_cancel({
        data: {
          memNo: urlrStr
        }
      })
      if (res.result === 'success') {
        context.action.alert({
          callback: () => {
            context.action.updateMypageFanCnt(myProfileNo + 1)
          },
          msg: '팬등록을 해제하였습니다.'
        })
      } else if (res.result === 'fail') {
        context.action.alert({
          callback: () => {},
          msg: res.message
        })
      }
    }
    fetchDataFanCancel(myProfileNo)
  }
  //function:팬등록
  const fanRegist = (myProfileNo) => {
    fetchDataFanRegist(myProfileNo)
  }
  //func star count
  const starContext = () => {
    if (profile.starCnt > 0) {
      context.action.updateCloseStarCnt(true)
    }
  }
  //func fuan count
  const fanContext = () => {
    if (profile.fanCnt > 0) {
      context.action.updateCloseFanCnt(true)
    }
  }
  // 팬랭킹 리스트 func
  const createFanList = () => {
    if (profile.fanRank == false) return null
    let result = []
    for (let index = 0; index < 3; index++) {
      if (profile.fanRank[index] == undefined) {
      } else {
        const {memNo, profImg, rank} = profile.fanRank[index]
        let link = ''
        if (memNo == myProfileNo) {
          link = `/menu/profile`
        } else {
          link = webview ? `/mypage/${memNo}?webview=${webview}` : `/mypage/${memNo}`
        }
        result = result.concat(
          <div
            style={{backgroundImage: `url(${profImg.thumb88x88})`}}
            className={`fanItem rank${rank}`}
            onClick={() => history.push(link)}
            key={index}></div>
        )
      }
    }
    result = result.concat(
      <button
        className="btn__fanMore"
        onClick={() => profile.fanRank.length > 0 && context.action.updateClose(true)}
        key="btn"
        style={{display: 'none'}}>
        <span></span>
      </button>
    )
    return (
      <>
        <div className="fanRankList">
          <button className="btn__fanRank" onClick={() => profile.fanRank.length > 0 && context.action.updateClose(true)}>
            팬랭킹
          </button>
          {result}
        </div>
      </>
    )
  }
  // rank popup toggle
  const popStateEvent = (e) => {
    if (e.state === null) {
      setPopup(false)
      context.action.updateMypageReport(false)
      context.action.updateClose(false)
      context.action.updateCloseFanCnt(false)
      context.action.updateCloseStarCnt(false)
      context.action.updateClosePresent(false)
    } else if (e.state === 'layer') {
      setPopup(true)
    }
  }
  //--------------------------------------------
  useEffect(() => {
    if (popup) {
      if (window.location.hash === '') {
        window.history.pushState('layer', '', '/#layer')
        setScrollY(window.scrollY)
      }
    } else if (!popup) {
      if (window.location.hash === '#layer') {
        window.history.back()
        setTimeout(() => window.scrollTo(0, scrollY))
      }
    }
  }, [popup])
  //--------------------------------------------
  useEffect(() => {
    window.addEventListener('popstate', popStateEvent)
    return () => {
      window.removeEventListener('popstate', popStateEvent)
    }
  }, [])
  //--------------------------------------------
  useEffect(() => {
    if (mypageReport || close || closeFanCnt || closeStarCnt || closePresent) {
      setPopup(true)
    } else {
      setPopup(false)
    }
  }, [mypageReport, close, closeFanCnt, closeStarCnt, closePresent])
  //--------------------------------------------
  //깜빡임 fake
  if (profile === null) {
    return <div></div>
  }
  //func back
  const goBack = () => {
    const {webview} = qs.parse(location.search)
    if (webview && webview === 'new' && isHybrid()) {
      Hybrid('CloseLayerPopup')
    } else {
      if (locHash instanceof Object && locHash.state) {
        locHash.state.hash === '#layer' ? history.go(-2) : history.goBack()
      } else {
        history.goBack()
      }
    }
  }
  //스와이퍼
  const swiperParams = {
    spaceBetween: 2,
    slidesPerView: 'auto',
    resistanceRatio: 0
  }
  //뱃지
  const BadgeSlide = profile.fanBadgeList.map((item, index) => {
    if (!profile.hasOwnProperty('fanBadgeList')) return null
    const {text, icon, startColor, endColor} = item
    //-----------------------------------------------------------------------
    return (
      <div className="badgeSlide" key={index}>
        <span
          className="fan-badge"
          style={{
            background: `linear-gradient(to right, ${startColor}, ${endColor}`
          }}>
          <img src={icon} alt={text} />
          <span>{text}</span>
        </span>
      </div>
    )
  })

  if (myProfileNo === profile.memNo) return null

  return (
    <>
      <div className="profile-info" webview={webview}>
        <button className="closeBtn" onClick={goBack}>
          <span className="blind">프로필 닫기</span>
        </button>
        <ProfileDetail {...props} />
      </div>
    </>
  )
}
export default myProfile
