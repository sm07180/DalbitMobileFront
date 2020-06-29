/**
 * @file /mypage/content/my-profile.js
 * @brief 마이페이지 상단에 보이는 내 프로필 component.
 */
import React, {useEffect, useContext, useState} from 'react'
//route
import {Link} from 'react-router-dom'
import {OS_TYPE} from 'context/config.js'
//styled
import styled from 'styled-components'
import Swiper from 'react-id-swiper'
//component
import ProfileReport from './profile_report'
import ProfileFanList from './profile_fanList'
import LayerPopupExp from './layer_popup_exp.js'

// context
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {WIDTH_TABLET_S, IMG_SERVER} from 'context/config'
import Api from 'context/api'
import {Context} from 'context'
// utility
import Utility, {printNumber} from 'components/lib/utility'
//svg
import LiveIcon from '../component/ic_live.svg'
import InfoIcon from '../static/profile/ic_info.svg'

const myProfile = (props) => {
  const {webview} = props
  //context
  const context = useContext(Context)
  const {mypageReport, close, closeFanCnt, closeStarCnt} = context
  // state
  const [popup, setPopup] = useState(false)
  const [popupExp, setPopupExp] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [Zoom, setZoom] = useState(false)
  const [reportShow, SetShowReport] = useState(false)
  //pathname
  const urlrStr = props.location.pathname.split('/')[2]
  const {profile} = props
  const myProfileNo = context.profile.memNo
  //image zoom -- 내 사진 클릭시 확대
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
    return <div style={{minHeight: '400px'}}></div>
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
  //function:팬해제
  const Cancel = (myProfileNo) => {
    async function fetchDataFanCancel(myProfileNo) {
      const res = await Api.mypage_fan_cancel({
        data: {
          memNo: myProfileNo
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
  //func
  const starContext = () => {
    if (profile.starCnt > 0) {
      context.action.updateCloseStarCnt(true)
    }
  }
  const fanContext = () => {
    if (profile.fanCnt > 0) {
      context.action.updateCloseFanCnt(true)
    }
  }
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
          <a href={link} key={index}>
            <FanRank style={{backgroundImage: `url(${profImg.thumb88x88})`}} className={`rank${rank}`}></FanRank>
          </a>
        )
      }
    }
    result = result.concat(
      <button className="moreFan" onClick={() => profile.fanRank.length > 0 && context.action.updateClose(true)} key="btn">
        <span></span>
      </button>
    )
    return (
      <>
        <FanListWrap>
          <span>팬 랭킹</span>
          {result}
        </FanListWrap>
      </>
    )
  }

  const popStateEvent = (e) => {
    console.log(e.state)
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

  useEffect(() => {
    window.addEventListener('popstate', popStateEvent)
    return () => {
      window.removeEventListener('popstate', popStateEvent)
    }
  }, [])

  useEffect(() => {
    if (mypageReport || close || closeFanCnt || closeStarCnt) {
      setPopup(true)
    } else {
      setPopup(false)
    }
  }, [mypageReport, close, closeFanCnt, closeStarCnt])
  //스와이퍼
  const params = {
    spaceBetween: 10,
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
  return (
    <MyProfile webview={webview}>
      <ProfileImg url={profile.profImg ? profile.profImg['thumb120x120'] : ''}>
        <figure onClick={() => figureZoom()}>
          <img src={profile.profImg ? profile.profImg['thumb120x120'] : ''} alt={profile.nickNm} />
          <div className="holder" style={{backgroundImage: `url(${profile.holder})`}}></div>
        </figure>
        {Zoom === true && (
          <div className="zoom" onClick={() => setZoom(false)}>
            <img src={profile.profImg ? profile.profImg['url'] : ''} alt={profile.nickNm} className="zoomImg" />
          </div>
        )}
        <span>
          {profile.level !== 0 && `${profile.grade} /`} Lv.{profile.level}
        </span>
      </ProfileImg>

      <ContentWrap>
        {urlrStr == 'profile' && (
          <>
            <LevelWrap>
              <button className="btn-info" onClick={() => setPopupExp(popup ? false : true)}>
                경험치
              </button>
              <div className="expBox">
                <LevelText>LEVEL {profile.level}</LevelText>
                <LevelStatusBarWrap>
                  <LevelStatus
                    style={{
                      width: `${expCalc < 20 ? `calc(${expCalc}% + 20px)` : `calc(${expCalc}%)`}`
                    }}></LevelStatus>
                </LevelStatusBarWrap>
                <div className="expWrap">
                  <span className="expBegin">0</span>
                  <span className="expPer">
                    EXP {Math.floor(((profile.expNext - profile.expBegin) * expPercent) / 100)} ({`${expCalc}%`})
                  </span>
                  <span className="expBegin">{profile.expNext - profile.expBegin}</span>
                </div>
              </div>
              <a href={`/level`} className="btn-level">
                레벨
              </a>
            </LevelWrap>
          </>
        )}
        <NameWrap>
          <strong>{profile.nickNm}</strong>
          <div>
            <span>{`@${profile.memId}`}</span>
            {profile.isSpecial === true && <em className="specialIcon">스페셜DJ</em>}
          </div>
        </NameWrap>
        {profile.fanBadgeList && profile.fanBadgeList.length > 0 ? (
          <BadgeWrap margin={profile.fanBadgeList.length === 1 ? '10px' : '0px'}>
            <Swiper {...params}>{BadgeSlide}</Swiper>
          </BadgeWrap>
        ) : (
          <></>
        )}
        <ProfileMsg>{profile.profMsg}</ProfileMsg>
        <CountingWrap>
          <span onClick={() => fanContext()}>
            팬 <em>{Utility.printNumber(profile.fanCnt)}</em>
          </span>
          <span onClick={() => starContext()}>
            스타 <em>{Utility.printNumber(profile.starCnt)}</em>
          </span>
          {urlrStr !== myProfileNo && urlrStr !== 'profile' && (
            <div onClick={() => context.action.updateMypageReport(true)}></div>
          )}
        </CountingWrap>
        <ButtonWrap>{createFanList()}</ButtonWrap>
      </ContentWrap>
      {context.mypageReport === true && <ProfileReport {...props} reportShow={reportShow} />}
      {context.close === true && <ProfileFanList {...props} reportShow={reportShow} name="팬 랭킹" />}
      {context.closeFanCnt === true && <ProfileFanList {...props} reportShow={reportShow} name="팬" />}
      {context.closeStarCnt === true && <ProfileFanList {...props} reportShow={reportShow} name="스타" />}
      {/* {context.closePresent === true && <ProfilePresent {...props} reportShow={reportShow} name="선물" />} */}

      {popupExp && <LayerPopupExp setPopupExp={setPopupExp} />}
    </MyProfile>
  )
}

export default myProfile
//styled======================================
const MyProfile = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  min-height: 300px;
  margin: 0 auto;
  padding: 40px 16px 57px 16px;
  .zoom {
    position: fixed;
    top: 0;
    left: 0;
    width:100%;
    height: 100vh;
    z-index:22;
    background-color:rgba(0,0,0,0.5)    
  }
  .zoomImg {
    position: absolute;
    top:50%;
    left:50%;
    transform:translate(-50%,-50%);
    display: block;
    width:95%;
   height:auto;
  }
  & > div {
    flex: 0 0 auto;
    padding: 0 10px;
  }

  @media (max-width: ${WIDTH_TABLET_S}) {
    flex-direction: column;
    padding: 16px 0 16px 0;
    /* padding-top: ${(props) => (props.webview && props.webview === 'new' ? '48px' : '')}; */
  }
`
//flex item3
const ButtonWrap = styled.div`
  display: flex;
  justify-content: center;
  flex-basis: 204px;
  padding-top: 35px;
  text-align: right;
  order: 3;
  @media (max-width: ${WIDTH_TABLET_S}) {
    display: flex;
    flex-basis: auto;
    padding-top: 0;
    order: 1;
  }
`

const ProfileImg = styled.div`
  display: block;
  position: relative;
  height: 161px;
  flex-basis: 161px;
  background-size: cover;
  background-position: center;
  text-align: center;
  order: 1;

  figure {
    position: relative;
    width: 100px;
    height: 100px;
    margin: 10px auto 0 auto;
    border-radius: 50%;
    background: url(${(props) => props.url}) no-repeat center center/ cover;

    img {
      display: none;
    }

    .holder {
      display: block;
      position: absolute;
      top: -20px;
      left: -20px;
      width: 140px;
      height: 140px;
      background-position: center;
      background-size: cover;
      background-repeat: no-repeat;
    }
  }
  span {
    display: inline-block;
    position: relative;
    padding: 0 12px;
    margin-top: 20px;
    border-radius: 30px;
    background: ${COLOR_POINT_Y};
    color: #fff;
    font-size: 12px;
    font-weight: 600;
    line-height: 30px;
    z-index: 2;
    transform: skew(-0.03deg);
  }

  @media (max-width: ${WIDTH_TABLET_S}) {
    order: 2;
  }
  & .liveIcon {
    position: absolute;
    right: 0;
    top: 0px;
    width: 52px;
    height: 26px;
    background: url(${LiveIcon}) no-repeat center center / cover;
  }
`

const ContentWrap = styled.div`
  width: calc(100% - 360px);
  padding: 0 0px;
  order: 2;

  @media (max-width: ${WIDTH_TABLET_S}) {
    width: 100%;
    margin: 0 auto;
    order: 3;
  }
  .expBox {
    margin: 0 8px;
  }
  .expWrap {
    width: 179px;
    display: flex;
    justify-content: space-between;
    margin: 4px auto 0;
  }
  .expPer {
    display: block;
    font-size: 10px;
    font-weight: 600;
    line-height: 1.08;
    letter-spacing: normal;
    text-align: center;
    color: #632beb;
  }
  .expBegin {
    font-size: 10px;
    font-weight: 600;
    line-height: 1.08;
    letter-spacing: normal;
    text-align: left;
    color: #000;
  }
  /* .expBegin:nth-child(1) {
    margin-left: 8px;
  }
  .expBegin:nth-child(2) {
    margin-right: 8px;
  } */
  .btn-info,
  .btn-level {
    display: inline-block;
    position: relative;
    top: -2px;
    font-size: 12px;
    color: #757575;
    font-weight: 600;
    letter-spacing: -1px;
    white-space: nowrap;
  }
  .btn-info {
    &::before {
      display: inline-block;
      content: '';
      width: 20px;
      height: 20px;
      vertical-align: -6px;
      background: url('${InfoIcon}') no-repeat 0 0; 
    }
  }
  .btn-level {
    &::after {
      display: inline-block;
      content: '';
      width: 20px;
      height: 20px;
      vertical-align: -5px;
      margin-left: 1px;
      background: url('${InfoIcon}') no-repeat 0 0; 
    }
  }
`
//------------------------------------------------------
//정보 레벨업관련
const LevelWrap = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: flex-start;
  @media (max-width: ${WIDTH_TABLET_S}) {
    margin-top: 10px;
  }
`
const LevelText = styled.span`
  color: ${COLOR_MAIN};
  font-size: 14px;
  line-height: 18px;
  font-weight: 800;
  letter-spacing: -0.35px;
  transform: skew(-0.03deg);
  @media (max-width: ${WIDTH_TABLET_S}) {
    display: none;
  }
`
const LevelStatusBarWrap = styled.div`
  position: relative;
  width: 179px;
  border-radius: 10px;
  border: 1px solid #e0e0e0;
  @media (max-width: ${WIDTH_TABLET_S}) {
    height: 14px;
  }
`
const LevelStatus = styled.div`
  position: absolute;
  top: -1px;
  left: -1px;
  height: calc(100% + 2px);
  max-width: calc(100% + 2px);
  border-radius: 10px;
  background-color: ${COLOR_MAIN};
  text-align: right;
  color: #fff;
  font-size: 9px;
  padding: 1px 0;
  padding-right: 6px;
  line-height: 15px;
  box-sizing: border-box;
  text-indent: 3px;
  @media (max-width: ${WIDTH_TABLET_S}) {
    line-height: 13px;
  }
`
//닉네임
const NameWrap = styled.div`
  margin-top: 10px;
  & > * {
    display: inline-block;
  }
  strong {
    color: #000;
    font-size: 24px;
    line-height: 32px;
    font-weight: 800;
  }
  .specialIcon {
    display: inline-block;
    width: 62px;
    margin-left: 4px;
    border-radius: 10px;
    background-color: #ec455f;
    color: #fff;
    font-size: 12px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: normal;
    height: 18px;
    line-height: 1.6;
    vertical-align: middle;
  }
  strong {
    color: #000;
    font-size: 24px;
    line-height: 32px;
    font-weight: 800;
  }
  span {
    padding-left: 5px;
    color: #424242;
    font-size: 14px;
    vertical-align: middle;
    transform: skew(-0.03deg);
  }

  @media (max-width: ${WIDTH_TABLET_S}) {
    text-align: center;
    & > * {
      display: block;
    }
    span {
      transform: skew(-0.03deg);
    }
  }
`
//팬, 스타 수
const CountingWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 12px;
  span {
    display: inline-block;
    font-size: 18px;
    letter-spacing: -0.35px;
    color: ${COLOR_MAIN};
    transform: skew(-0.03deg);
    font-weight: 600;
    em {
      display: inline-block;
      padding-left: 1px;
      color: #000;
      font-style: normal;
      font-weight: 600;
    }
  }
  & span:first-child:after {
    display: inline-block;
    width: 1px;
    height: 12px;
    margin: 0 11px -1px 12px;
    background: #e0e0e0;
    content: '';
  }
  & div {
    width: 36px;
    height: 36px;
    background: url(${IMG_SERVER}/images/api/ic_report.png);
    margin-left: 18px;
    position: relative;
    cursor: pointer;
    :after {
      display: block;
      width: 1px;
      height: 12px;
      position: absolute;
      left: -6px;
      top: 50%;
      transform: translateY(-50%);
      background: #e0e0e0;
      content: '';
    }
  }

  @media (max-width: ${WIDTH_TABLET_S}) {
    margin-top: 10px;
  }
`
//프로필메세지
const ProfileMsg = styled.p`
  word-break: break-all;
  margin-top: 8px;
  color: #616161;
  font-size: 14px;
  line-height: 20px;
  transform: skew(-0.03deg);
  word-break: break-all;
  @media (max-width: ${WIDTH_TABLET_S}) {
    text-align: center;
  }
`
//상단버튼
const InfoConfigBtn = styled.div`
  & > a {
    display: inline-block;
    padding: 0 44px 0 17px;
    user-select: none;
    border: 1px solid #757575;
    border-radius: 18px;
    background: url(${IMG_SERVER}/images/api/my_btn_img.png) no-repeat 92% center;
    background-size: 32px 32px;
    font-size: 14px;
    font-weight: 600;
    line-height: 36px;
    letter-spacing: -0.5px;
    color: #424242;
    cursor: pointer;
  }

  a + a {
    margin-left: 4px;
  }
  .notBjWrap {
    display: flex;

    & button {
      display: flex;
      justify-content: center;
      width: 62px;
      height: 36px;
      color: #9e9e9e;
      font-size: 14px;
      transform: skew(-0.03deg);
      margin-right: 4px;
      border-radius: 18px;
      border: solid 1px #bdbdbd;
      &.fanRegist {
        border: solid 1px ${COLOR_MAIN};
        color: ${COLOR_MAIN};
      }
      & span {
        display: block;
        width: 18px;
        height: 18px;
        background: url(${IMG_SERVER}/images/api/ic_moon_s.png) no-repeat center center / cover;
      }
      & em {
        display: block;
        font-weight: normal;
        font-style: normal;
        line-height: 1.41;
        letter-spacing: -0.35px;
        height: 18px;
      }
    }
  }
`
//팬랭킹
const FanListWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  > span {
    display: block;
    font-size: 14px;
    font-weight: bold;
    letter-spacing: -0.35px;
    text-align: left;
    margin-right: 10px;
    color: #000000;
    transform: skew(-0.03deg);
  }
  & .moreFan {
    width: 36px;
    height: 36px;
    border: 1px solid #757575;
    border-radius: 50%;
    vertical-align: top;
    margin-top: -5px;
    span {
      display: inline-block;
      position: absolute;
      top: 16px;
      left: 16px;
      width: 2px;
      height: 2px;
      margin: 0 auto;
      background: #424242;
      border-radius: 50%;

      :after,
      :before {
        display: inline-block;
        position: absolute;
        width: 2px;
        height: 2px;
        border-radius: 50%;
        background: #424242;
        content: '';
      }
      :after {
        right: -5px;
      }
      :before {
        left: -5px;
      }
    }
  }
  @media (max-width: ${WIDTH_TABLET_S}) {
    margin-top: 10px;
  }
  > a {
    &.none {
      display: none;
    }
  }
`
const FanRank = styled.div`
  display: inline-block;
  position: relative;
  width: 48px;
  height: 48px;
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

  @media (max-width: ${WIDTH_TABLET_S}) {
    width: 36px;
    height: 36px;
    border: 1px solid #757575;
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
//팬 뱃지 스타일링
const Slide = styled.a`
  color: #fff;
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
    width: 33px;
    height: 28px;
  }
  .fan-badge span {
    display: inline-block;
    vertical-align: middle;
    line-height: 2.2;
    color: #ffffff;
  }
`
