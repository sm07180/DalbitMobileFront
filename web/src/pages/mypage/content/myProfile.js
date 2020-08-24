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
import FemaleIcons from '../static/ico_female.svg'
import MaleIcons from '../static/ico_male.svg'
import KoreaIcons from '../static/ico_korea.svg'
import PlusCircle from '../static/ico_plus_circle.svg'
import GrayHeart from '../static/ico_like_g.svg'
import CloseIcon from '../static/ico_close.svg'
import BlueHoleIcon from '../static/bluehole.svg'
import StarIcon from '../static/star.svg'
import ReportIcon from '../component/ic_report.svg'
import CloseBtnIcon from '../component/ic_closeBtn.svg'
import QuestionIcon from '../static/ic_question.svg'
import MoonIcon from '../static/profile/ic_moon_s.svg'
import {Hybrid, isHybrid} from 'context/hybrid'
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
        {urlrStr !== context.token.memNo && (
          <>
            <div onClick={() => context.action.updateMypageReport(true)} className="reportIcon"></div>
          </>
        )}
        <div className="profile-detail" webview={webview}>
          <div className="profile-content">
            <div className="profile-image" url={profile.profImg ? profile.profImg['thumb190x190'] : ''}>
              <figure onClick={() => figureZoom()} style={{backgroundImage: `url(${profile.profImg.thumb190x190})`}}>
                <img src={profile.profImg ? profile.profImg['thumb190x190'] : ''} alt={profile.nickNm} />
                {/* {profile.level > 100 && <div className="profileBg" style={{backgroundImage: `url(${profile.profileBg})`}}></div>} */}
                {profile.level > 50 && <div className="holderBg" style={{backgroundImage: `url(${profile.holderBg})`}}></div>}
                <div className="holder" style={{backgroundImage: `url(${profile.holder})`}}></div>
              </figure>

              {/* {profile.level > 100 && <div className="profileBg" style={{backgroundImage: `url(${profile.profileBg})`}}></div>} */}
              {/* {profile.level > 50 && <div className="holderBg" style={{backgroundImage: `url(${profile.holderBg})`}}></div>}
              <div className="holder" style={{backgroundImage: `url(${profile.holder})`}} onClick={() => figureZoom()}></div>

              <figure onClick={() => figureZoom()}>
                <img src={profile.profImg ? profile.profImg['thumb190x190'] : ''} alt={profile.nickNm} />
              </figure> */}
              {Zoom === true && (
                <div className="zoom" onClick={() => setZoom(false)}>
                  <img src={profile.profImg ? profile.profImg['url'] : ''} alt={profile.nickNm} className="zoomImg" />
                </div>
              )}
            </div>
            <div className="title">
              Lv{profile.level} {profile.level !== 0 && `${profile.grade}`}
            </div>
            {profile.roomNo !== '' && (
              <button
                className="liveIcon"
                onClick={() => {
                  if (context.adminChecker === true) {
                    context.action.confirm_admin({
                      //콜백처리
                      callback: () => {
                        RoomJoin({
                          roomNo: profile.roomNo,
                          shadow: 1
                        })
                      },
                      //캔슬콜백처리
                      cancelCallback: () => {
                        RoomJoin({
                          roomNo: profile.roomNo,
                          shadow: 0
                        })
                      },
                      msg: '관리자로 입장하시겠습니까?'
                    })
                  } else {
                    RoomJoin({
                      roomNo: profile.roomNo
                    })
                  }
                }}>
                <img src={LiveIcon}></img>
                <span>Live</span>
              </button>
            )}
            <div className="nameWrap">
              {/* <span>ID : {`@${profile.memId}`}</span> */}
              <strong>{profile.nickNm}</strong>
            </div>
            <div className="subIconWrap">
              {/* {<em className="nationIcon"></em>} */}
              {profile.gender === 'f' && <em className="femaleIcon"></em>}
              {profile.gender === 'm' && <em className="maleIcon"></em>}
              {profile.isSpecial === true && <em className="specialIcon">스페셜 DJ</em>}
            </div>
            {profile.profMsg && <div className="profileMsgWrap">{profile.profMsg}</div>}
            {profile.fanBadgeList && profile.fanBadgeList.length > 0 ? (
              <div className="badgeWrap">
                <Swiper {...swiperParams}>{BadgeSlide}</Swiper>
              </div>
            ) : (
              <></>
            )}
            {profile.fanRank.length !== 0 && <div className="fanListWrap">{createFanList()}</div>}
            <div className="categoryCntWrap">
              <div className="count-box" onClick={() => fanContext()}>
                <span className="icoWrap">
                  <span className="icoImg type1"></span>
                  <em className="icotitle">팬</em>
                </span>
                <em className="cntTitle">
                  {profile.fanCnt > 9999 ? Utility.printNumber(profile.fanCnt) : Utility.addComma(profile.fanCnt)}
                </em>
              </div>
              <div className="count-box" onClick={() => starContext()}>
                <span className="icoWrap">
                  <span className="icoImg type2"></span>
                  <em className="icotitle">스타</em>
                </span>
                <em className="cntTitle">
                  {profile.starCnt > 9999 ? Utility.printNumber(profile.starCnt) : Utility.addComma(profile.starCnt)}
                </em>
              </div>
              <div className="count-box">
                <span className="icoWrap">
                  <span className="icoImg"></span>
                  <em className="icotitle">좋아요</em>
                </span>
                <em className="cntTitle">
                  {profile.likeTotCnt > 9999 ? Utility.printNumber(profile.likeTotCnt) : Utility.addComma(profile.likeTotCnt)}
                </em>
              </div>
            </div>
            {urlrStr !== myProfileNo && urlrStr !== 'profile' && (
              <div onClick={() => context.action.updateMypageReport(true)}></div>
            )}
            <div className="buttonWrap">
              <div className="buttonWrapInner">
                {urlrStr !== context.token.memNo && (
                  <div className="notBjWrap">
                    {context.customHeader['os'] === OS_TYPE['IOS'] ? (
                      <></>
                    ) : (
                      <button
                        onClick={() => {
                          context.action.updateClosePresent(true)
                        }}
                        className="giftbutton">
                        {/* <span></span> */}
                        <em>선물하기</em>
                      </button>
                    )}
                    {profile.isFan === 0 && (
                      <button className="fanRegist" onClick={() => Cancel(myProfileNo)}>
                        팬
                      </button>
                    )}
                    {profile.isFan === 1 && (
                      <button onClick={() => fanRegist(myProfileNo)}>
                        <em>팬</em> <em className="plus"></em>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
            {context.mypageReport === true && <ProfileReport {...props} reportShow={reportShow} />}
            {context.close === true && <ProfileFanList {...props} reportShow={reportShow} name="팬 랭킹" />}
            {context.closeFanCnt === true && <ProfileFanList {...props} reportShow={reportShow} name="팬" />}
            {context.closeStarCnt === true && <ProfileFanList {...props} reportShow={reportShow} name="스타" />}
            {context.closePresent === true && <ProfilePresent {...props} reportShow={reportShow} name="선물" />}
            {popupExp && <LayerPopupExp setPopupExp={setPopupExp} />}
          </div>
        </div>
      </div>
    </>
  )
}
export default myProfile

//flex item3
const GiftButtonWrap = styled.div`
  @media (max-width: ${WIDTH_TABLET_S}) {
  }
`
//상단버튼
const InfoConfigBtn = styled.div``
