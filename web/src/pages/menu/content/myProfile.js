/**
 * @file /mypage/content/my-profile.js
 * @brief 2.5v 마이페이지 상단에 보이는 내 프로필 component.
 */
import React, {useEffect, useContext, useState} from 'react'
import Swiper from 'react-id-swiper'
import qs from 'query-string'
//component
import ProfileReport from './profile_report'
import ProfileFanList from './profile_fanList'
import {useHistory} from 'react-router-dom'
import LayerPopupExp from './layer_popup_exp.js'
import ProfileDetail from '../../mypage/content/profile_detail'
// context
import Api from 'context/api'
import {Context} from 'context'
// utility
import Utility, {printNumber, addComma} from 'components/lib/utility'
//svg
import AdminIcon from '../static/ic_home_admin.svg'
import {Hybrid, isHybrid} from 'context/hybrid'
// render----------------------------------------------------------------
const myProfile = (props) => {
  let history = useHistory()
  //context & webview
  const {webview} = props
  const context = useContext(Context)
  const {mypageReport, close, closeFanCnt, closeStarCnt, token} = context
  // state
  const [popup, setPopup] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [Zoom, setZoom] = useState(false)
  const [reportShow, SetShowReport] = useState(false)
  const [showAdmin, setShowAdmin] = useState(false)
  //pop
  const [popupExp, setPopupExp] = useState(false)
  //pathname
  const urlrStr = props.location.pathname.split('/')[2]
  const {profile} = props

  const myProfileNo = context.profile.memNo
  //image zoom function
  const figureZoom = () => {
    setZoom(true)
  }
  // expCalculate function
  let expCalc = Math.floor(((profile.exp - profile.expBegin) / (profile.expNext - profile.expBegin)) * 100)
  if (expCalc == 'Infinity') expCalc = 0
  let expPercent = ((profile.exp - profile.expBegin) / (profile.expNext - profile.expBegin)) * 100
  if (expPercent == 'Infinity') expCalc = 0
  // loading
  if (profile === null) {
    return <div style={{minHeight: '300px'}}></div>
  }
  //api
  async function fetchDataFanRegist(myProfileNo) {
    const res = await Api.fan_change({
      data: {
        memNo: myProfileNo
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
  //func 스타팝업 실행
  const starContext = () => {
    if (profile.starCnt > 0) {
      context.action.updateCloseStarCnt(true)
    }
  }
  //func 팬팝업 실행
  const fanContext = () => {
    if (profile.fanCnt > 0) {
      context.action.updateCloseFanCnt(true)
    }
  }
  //func 랭크팬리스트 생성
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
  //팝업실행
  const popStateEvent = (e) => {
    if (e.state === null) {
      setPopup(false)
      context.action.updateMypageReport(false)
      context.action.updateClose(false)
      context.action.updateCloseFanCnt(false)
      context.action.updateCloseStarCnt(false)
    } else if (e.state === 'layer') {
      setPopup(true)
    }
  }

  //func back
  const goBack = () => {
    const {webview} = qs.parse(location.search)

    if (webview && webview === 'new' && isHybrid()) {
      Hybrid('CloseLayerPopup')
    } else {
      history.goBack()
    }
  }
  //function모바일 레어어 실행
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
  //--------------------------------------------------------------
  useEffect(() => {
    window.addEventListener('popstate', popStateEvent)
    return () => {
      window.removeEventListener('popstate', popStateEvent)
    }
  }, [])
  //--------------------------------------------------------------
  useEffect(() => {
    if (mypageReport || close || closeFanCnt || closeStarCnt) {
      setPopup(true)
    } else {
      setPopup(false)
    }
  }, [mypageReport, close, closeFanCnt, closeStarCnt])
  //--------------------------------------------------------------
  const goFanEdite = () => {
    history.push(`/mypage/${profile.memNo}/edit_fan`)
  }
  const goStarEdite = () => {
    history.push(`/mypage/${profile.memNo}/edit_star`)
  }
  //뱃지
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

  useEffect(() => {
    if (context.adminChecker === true) {
      setShowAdmin(true)
    } else if (context.adminChecker === 'fail') {
      setShowAdmin(false)
    }
  }, [])

  return (
    <>
      <div className="profile-info" webview={webview}>
        <ProfileDetail {...props} />
      </div>
    </>
  )
}
export default myProfile
