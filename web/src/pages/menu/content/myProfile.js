/**
 * @file /mypage/content/my-profile.js
 * @brief 2.5v 마이페이지 상단에 보이는 내 프로필 component.
 */
import React, {useEffect, useContext, useState} from 'react'
import {Link} from 'react-router-dom'
import {OS_TYPE} from 'context/config.js'
import styled from 'styled-components'
import Swiper from 'react-id-swiper'
import qs from 'query-string'
//component
import ProfileReport from './profile_report'
import ProfileFanList from './profile_fanList'
import {useHistory} from 'react-router-dom'
import LayerPopupExp from './layer_popup_exp.js'
// context
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {WIDTH_TABLET_S, IMG_SERVER} from 'context/config'
import Api from 'context/api'
import {Context} from 'context'
// utility
import Utility, {printNumber, addComma} from 'components/lib/utility'
//svg
import LiveIcon from '../static/ic_live.svg'
import FemaleIcon from '../static/ico_female.svg'
import MaleIcon from '../static/ico_male.svg'
import PlusCircle from '../static/ico_circle.svg'
import GrayHeart from '../static/ico_like_g.svg'
import CloseIcon from '../static/ic_close.svg'
import KoreaIcon from '../static/ico_korea.svg'
import BlueHoleIcon from '../static/bluehole.svg'
import StarIcon from '../static/star.svg'
import CloseBtnIcon from '../static/ic_closeBtn.svg'
import QuestionIcon from '../static/ic_help.svg'
import CrownIcon from '../static/ic_crown.svg'
import AdminIcon from '../static/ic_home_admin.svg'
import FanSettingIcon from '../static/fan_setting.svg'
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
    return <div style={{minHeight: '391px'}}></div>
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
    console.log(profile)
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
          <a onClick={() => history.push(link)} key={index}>
            <FanRank style={{backgroundImage: `url(${profImg.thumb88x88})`}} className={`rank${rank}`}></FanRank>
          </a>
        )
      }
    }
    result = result.concat(
      <button
        className="moreFan"
        onClick={() => profile.fanRank.length > 0 && context.action.updateClose(true)}
        key="btn"
        style={{display: 'none'}}>
        <span></span>
      </button>
    )
    return (
      <>
        <div className="fanRankList">
          <span onClick={() => profile.fanRank.length > 0 && context.action.updateClose(true)}>
            <span>팬랭킹</span>
            <em onClick={() => profile.fanRank.length > 0 && context.action.updateClose(true)} key="btn"></em>
          </span>
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
    history.push(`/mypage/${profile.memNo}/edite_fan`)
  }
  const goStarEdite = () => {
    history.push(`/mypage/${profile.memNo}/edite_star`)
  }
  //뱃지
  //스와이퍼
  const params = {
    spaceBetween: 2,
    slidesPerView: 'auto',
    resistanceRatio: 0
  }
  //뱃지
  const BadgeSlide = profile.fanBadgeList.map((item, index) => {
    const {text, icon, startColor, endColor} = item
    //-----------------------------------------------------------------------
    return (
      <Slide key={index}>
        <span
          className="fan-badge"
          style={{
            background: `linear-gradient(to right, ${startColor}, ${endColor}`
          }}>
          <img src={icon} />
          <span>{text}</span>
        </span>
      </Slide>
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
      <div className="profile-info">
        {token && token.isLogin && showAdmin && (
          <a href="/admin/image" className="adminBtn">
            <img src={AdminIcon} />
          </a>
        )}
        <button className="closeBtn" onClick={goBack}>
          <span className="blind">프로필 닫기</span>
        </button>
        <div className="profile-detail" webview={webview}>
          <div className="profile-image" url={profile.profImg ? profile.profImg['thumb120x120'] : ''}>
            <figure onClick={() => figureZoom()} style={{backgroundImage: `url(${profile.profImg.thumb190x190})`}}>
              <img src={profile.profImg ? profile.profImg['thumb120x120'] : ''} alt={profile.nickNm} />
              {/* {profile.level > 100 && <div className="profileBg" style={{backgroundImage: `url(${profile.profileBg})`}}></div>} */}
              {profile.level > 50 && <div className="holderBg" style={{backgroundImage: `url(${profile.holderBg})`}}></div>}
              <div className="holder" style={{backgroundImage: `url(${profile.holder})`}}></div>
            </figure>
            {Zoom === true && (
              <div className="zoom" onClick={() => setZoom(false)}>
                <img src={profile.profImg ? profile.profImg['url'] : ''} alt={profile.nickNm} className="zoomImg" />
              </div>
            )}
          </div>

          <div className="profile-content">
            <div
              className={`title 
              ${expCalc < 10 ? `레벨 0 ~ 10` : ''}
              ${expCalc < 20 ? `레벨 10 ~ 20` : ''}
              ${expCalc < 30 ? `레벨 20 ~ 30` : ''}
              ${expCalc < 40 ? `레벨 30 ~ 40 ` : ''}
              ${expCalc < 50 ? `레벨 40 ~ 50` : ''}                                                
            `}>
              Lv{profile.level} {profile.level !== 0 && `${profile.grade}`}
            </div>
            <div className="levelInfoWrap">
              {urlrStr == 'profile' && (
                <>
                  <LevelWrap>
                    <LevelStatusBarWrap>
                      <LevelStatus
                        style={{
                          width: `${expCalc < 20 ? `calc(${expCalc}% + 20px)` : `${expCalc}%`}`
                        }}></LevelStatus>
                      <span className="expTitle expTitle--start">0</span>
                      <span className="expTitle expTitle--end">{profile.expNext - profile.expBegin}</span>
                    </LevelStatusBarWrap>

                    <div className="levelInfo">
                      <button className="btn-info" onClick={() => setPopupExp(popup ? false : true)}>
                        <span className="blind">경험치</span>
                      </button>
                      EXP
                      <span className="expTitle">{Math.floor(((profile.expNext - profile.expBegin) * expPercent) / 100)}</span>
                      <span className="expTitle expTitle--rate">{profile.expRate}%</span>
                    </div>
                  </LevelWrap>
                </>
              )}
            </div>

            <div className="nameWrap">
              <strong>{profile.nickNm}</strong>
            </div>
            <div className="subIconWrap">
              {/* {<em className="nationIcon"></em>} */}
              {profile.gender === 'f' && <em className="femaleIcon"></em>}
              {profile.gender === 'm' && <em className="maleIcon"></em>}
              {profile.isSpecial === true && <em className="specialIcon">스페셜 DJ</em>}
            </div>
            {/* <ProfileMsg dangerouslySetInnerHTML={{__html: profile.profMsg.split('\n').join('<br />')}}></ProfileMsg> */}
            <div className="profileMsgWrap">{profile.profMsg}</div>
            {profile.fanBadgeList && profile.fanBadgeList.length > 0 ? (
              <BadgeWrap margin={profile.fanBadgeList.length === 1 ? '10px' : '0px'}>
                <Swiper {...params}>{BadgeSlide}</Swiper>
              </BadgeWrap>
            ) : (
              <div className="topMedal">TOP 랭킹에 도전해보세요</div>
            )}
            {profile.fanRank.length !== 0 && <div className="fanListWrap">{createFanList()}</div>}

            <div className="categoryCntWrap">
              {profile.fanCnt > 0 ? (
                <div className="count-box" onClick={goFanEdite}>
                  <span className="icoWrap">
                    <span className="icoImg type1"></span>
                    <em className="icotitle icotitle--active">팬</em>
                  </span>
                  <em className="cntTitle">
                    {profile.fanCnt > 9999 ? Utility.printNumber(profile.fanCnt) : Utility.addComma(profile.fanCnt)}
                  </em>
                </div>
              ) : (
                <div className="count-box">
                  <span>
                    <span className="icoImg type1"></span>
                    <em className="icotitle">팬</em>
                  </span>
                  <em className="cntTitle">
                    {profile.fanCnt > 9999 ? Utility.printNumber(profile.fanCnt) : Utility.addComma(profile.fanCnt)}
                  </em>
                </div>
              )}

              {profile.starCnt > 0 ? (
                <div className="count-box" onClick={goStarEdite}>
                  <span className="icoWrap">
                    <span className="icoImg type2"></span>
                    <em className="icotitle icotitle--active">스타</em>
                  </span>
                  <em className="cntTitle">
                    {profile.starCnt > 9999 ? Utility.printNumber(profile.starCnt) : Utility.addComma(profile.starCnt)}
                  </em>
                </div>
              ) : (
                <div className="count-box">
                  <span>
                    <span className="icoImg type2"></span>
                    <em className="icotitle">스타</em>
                  </span>
                  <em className="cntTitle">
                    {profile.starCnt > 9999 ? Utility.printNumber(profile.starCnt) : Utility.addComma(profile.starCnt)}
                  </em>
                </div>
              )}

              <div className="count-box">
                <span>
                  <span className="icoImg"></span>
                  <em className="icotitle">좋아요</em>
                </span>
                <em className="cntTitle">
                  {profile.likeTotCnt > 9999 ? Utility.printNumber(profile.likeTotCnt) : Utility.addComma(profile.likeTotCnt)}
                </em>
              </div>
            </div>
          </div>
          {context.mypageReport === true && <ProfileReport {...props} reportShow={reportShow} />}
          {context.close === true && <ProfileFanList {...props} reportShow={reportShow} name="팬 랭킹" />}
          {context.closeFanCnt === true && <ProfileFanList {...props} reportShow={reportShow} name="팬" />}
          {context.closeStarCnt === true && <ProfileFanList {...props} reportShow={reportShow} name="스타" />}
          {/* {context.closePresent === true && <ProfilePresent {...props} reportShow={reportShow} name="선물" />} */}
        </div>
        {popupExp && <LayerPopupExp setPopupExp={setPopupExp} />}
      </div>
    </>
  )
}
export default myProfile

const ContentWrap = styled.div``

//------------------------------------------------------
//정보 레벨업관련
const LevelWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  .expTitle {
    font-size: 12px;
    font-weight: bold;
    color: #000;
    &--start {
      position: absolute;
      left: 0;
      top: 21px;
    }
    &--end {
      position: absolute;
      right: 0;
      top: 21px;
    }
    &--rate {
      &::before {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 0px;
        content: '';
        width: 1px;
        height: 8px;
        background-color: #bdbdbd;
      }
    }
  }
  .expRate {
    margin-left: 6px;
    font-weight: 600;
    font-size: 10px;
    color: #000;
  }
  .levelInfo {
    display: flex;
    justify-content: center;
    flex-direction: row;
    width: 100%;
    padding: 4px 0;
    font-size: 16px;
    color: #757575;
    font-weight: bold;
    .expTitle {
      position: relative;
      padding: 0 8px;
      font-size: 16px;
    }
  }
`
const LevelStatusBarWrap = styled.div`
  position: relative;
  width: 300px;
  height: 16px;
  border-radius: 10px;
  background-color: #eee;
`
const LevelStatus = styled.div`
  position: absolute;
  top: 0px;
  left: -1px;
  height: 16px;
  max-width: calc(100% + 2px);
  border-radius: 10px;
  background-color: #000;
  text-align: right;
  color: #fff;
  font-size: 9px;
  padding: 1px 0;
  padding-right: 6px;
  line-height: 15px;
  box-sizing: border-box;
  text-indent: 3px;
  line-height: 16px;
`
//팬랭킹
const FanListWrap = styled.div``
const FanRank = styled.div`
  display: inline-block;
  position: relative;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  margin-right: 3px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  & > a {
    display: block;
    width: 100%;
    height: 100%;
  }
  & + & {
    margin-left: 4px;
  }
  :after {
    display: block;
    position: absolute;
    bottom: 0;
    right: -4px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-size: 12px 12px !important;
    content: '';
  }
  &.rank1:after {
    background: url(${IMG_SERVER}/images/api/ic_gold.png) no-repeat;
  }
  &.rank2:after {
    background: url(${IMG_SERVER}/images/api/ic_silver.png) no-repeat;
  }
  &.rank3:after {
    background: url(${IMG_SERVER}/images/api/ic_bronze.png) no-repeat;
  }
`
const BadgeWrap = styled.div`
  display: flex;
  margin: 10px auto 10px auto;
  margin-left: ${(props) => props.margin} !important;
  justify-content: center;
  align-items: center;
  & .swiper-slide {
    display: block;

    width: auto;
    height: auto;
  }
  & .swiper-wrapper {
    height: auto;
    margin: 0 auto;
  }
  & .swiper-pagination {
    position: static;
    margin-top: 20px;
  }
  & .swiper-pagination-bullet {
    width: 11px;
    height: 11px;
    background: #000000;
    opacity: 0.5;
  }
  & .swiper-pagination-bullet-active {
    background: ${COLOR_MAIN};
    opacity: 1;
  }

  .fan-badge {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 28px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 800;
    font-stretch: normal;
    font-style: normal;
    line-height: 1;
    letter-spacing: -0.35px;
    padding: 0 10px 0 3px;
    text-align: left;
    color: #ffffff;
  }
  .fan-badge:last-child {
    margin-right: 0;
  }

  .fan-badge img {
    width: 42px;
    height: 26px;
  }
  .fan-badge span {
    display: inline-block;
    vertical-align: middle;
    line-height: 2.2;
    color: #ffffff;
  }
`
//팬 뱃지 스타일링
const Slide = styled.a`
  color: #fff;
`
