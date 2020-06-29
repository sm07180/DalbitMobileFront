/**
 * @file /mypage/content/my-profile.js
 * @brief 마이페이지 상단에 보이는 내 프로필 component
 */
import React, {useEffect, useContext, useState} from 'react'
//route
import {OS_TYPE} from 'context/config.js'
import Room, {RoomJoin} from 'context/room'
//styled
import styled from 'styled-components'
import Swiper from 'react-id-swiper'
//component
import Header from '../component/header.js'
import ProfileReport from './profile_report'
import ProfileFanList from './profile_fanList'
import ProfilePresent from './profile_present'
import LiveIcon from '../component/ic_live.svg'

// context
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {WIDTH_TABLET_S, IMG_SERVER} from 'context/config'
import Api from 'context/api'
import {Context} from 'context'
//util
import Utility, {printNumber} from 'components/lib/utility'
import {saveUrlAndRedirect} from 'components/lib/link_control.js'

const myProfile = (props) => {
  const {webview} = props

  //context
  const context = useContext(Context)
  const {mypageReport, close, closeFanCnt, closeStarCnt, closePresent} = context

  //pathname
  const urlrStr = props.location.pathname.split('/')[2]
  const {profile} = props

  const myProfileNo = context.profile.memNo
  //zoom
  const [Zoom, setZoom] = useState(false)
  const figureZoom = () => {
    setZoom(true)
  }

  const [popup, setPopup] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [reportShow, SetShowReport] = useState(false)

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
          <div key={`fan-${index}`} onClick={() => saveUrlAndRedirect(link)}>
            <FanRank style={{backgroundImage: `url(${profImg.thumb88x88})`}} className={`rank${rank}`}></FanRank>
          </div>
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
    if (mypageReport || close || closeFanCnt || closeStarCnt || closePresent) {
      setPopup(true)
    } else {
      setPopup(false)
    }
  }, [mypageReport, close, closeFanCnt, closeStarCnt, closePresent])

  if (profile === null) {
    return <div style={{minHeight: '400px'}}></div>
  }
  //스와이퍼
  const params = {
    spaceBetween: 10,
    slidesPerView: 'auto',
    resistanc: false,
    resistanceRatio: 0
  }
  //뱃지
  const BadgeSlide = profile.fanBadgeList.map((item, index) => {
    const {text, icon, startColor, endColor} = item
    //-----------------------------------------------------------------------
    return (
      <Slide key={index} margin={profile.fanBadgeList.length === 0 ? '10px' : '10px'}>
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
      <Header>
        <div className="category-text">프로필</div>
      </Header>

      <ProfileImg url={profile.profImg ? profile.profImg['thumb190x190'] : ''}>
        {urlrStr !== context.token.memNo && (
          <div onClick={() => context.action.updateMypageReport(true)} className="reportIcon"></div>
        )}
        <div className="holder" style={{backgroundImage: `url(${profile.holder})`}} onClick={() => figureZoom()}></div>
        {profile.roomNo !== '' && (
          <button
            className="liveIcon"
            onClick={() => {
              RoomJoin(profile.roomNo)
            }}>
            <img src={LiveIcon}></img>
          </button>
        )}
        <figure onClick={() => figureZoom()}>
          <img src={profile.profImg ? profile.profImg['thumb190x190'] : ''} alt={profile.nickNm} />
        </figure>
        {Zoom === true && (
          <div className="zoom" onClick={() => setZoom(false)}>
            <img src={profile.profImg ? profile.profImg['url'] : ''} alt={profile.nickNm} className="zoomImg" />
          </div>
        )}

        <span>
          {profile.grade} / Lv.{profile.level}
        </span>
      </ProfileImg>

      <ContentWrap>
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
        </CountingWrap>
        <ButtonWrap>
          <InfoConfigBtn>
            {createFanList()}
            {urlrStr !== context.token.memNo && (
              <div className="notBjWrap">
                {context.customHeader['os'] === OS_TYPE['IOS'] ? (
                  <></>
                ) : (
                  <button
                    onClick={() => {
                      context.action.updateClosePresent(true)
                    }}>
                    <span></span>
                    <em>선물</em>
                  </button>
                )}
                {profile.isFan === 0 && (
                  <button className="fanRegist" onClick={() => Cancel(myProfileNo)}>
                    팬
                  </button>
                )}
                {profile.isFan === 1 && <button onClick={() => fanRegist(myProfileNo)}>+ 팬등록</button>}
              </div>
            )}
          </InfoConfigBtn>
        </ButtonWrap>
      </ContentWrap>
      {context.mypageReport === true && <ProfileReport {...props} reportShow={reportShow} />}
      {context.close === true && <ProfileFanList {...props} reportShow={reportShow} name="팬 랭킹" />}
      {context.closeFanCnt === true && <ProfileFanList {...props} reportShow={reportShow} name="팬" />}
      {context.closeStarCnt === true && <ProfileFanList {...props} reportShow={reportShow} name="스타" />}
      {context.closePresent === true && <ProfilePresent {...props} reportShow={reportShow} name="선물" />}
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
    background-color:rgba(0,0,0,0.5);
    
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
  }

  @media (max-width: ${WIDTH_TABLET_S}) {
    flex-direction: column;
    padding: 0px 0 16px 0;
    /* padding-top: ${(props) => (props.webview && props.webview === 'new' ? '48px' : '')}; */
  }
`
//flex item3
const ButtonWrap = styled.div`
  padding-top: 35px;

  @media (max-width: ${WIDTH_TABLET_S}) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-top: 0;
  }
`

const ProfileImg = styled.div`
  display: block;
  position: relative;
  flex-basis: 156px;
  background-size: cover;
  background-position: center;
  text-align: center;
  order: 1;
  .holder {
    display: block;
    position: absolute;
    top: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 140px;
    height: 140px;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
  }

  figure {
    width: 100px;
    height: 100px;
    margin: 10px auto 0 auto;
    border-radius: 50%;
    background: url(${(props) => props.url}) no-repeat center center/ cover;

    img {
      display: none;
    }
  }

  span {
    display: inline-block;
    position: relative;
    padding: 0 13px;
    margin-top: 24px;
    border-radius: 30px;
    background: ${COLOR_POINT_Y};
    color: #fff;
    font-size: 12px;
    line-height: 30px;
    z-index: 2;
    transform: skew(-0.03deg);
  }

  @media (max-width: ${WIDTH_TABLET_S}) {
    margin-top: 10px;
    order: 2;
  }
  & .liveIcon {
    position: absolute;
    right: 0;
    top: 0px;
    img {
      padding: 0 0 3px 3px;
    }
  }
  & .reportIcon {
    position: absolute;
    top: -5px;
    width: 36px;
    height: 36px;
    background: url(${IMG_SERVER}/images/api/ic_report.png);
    cursor: pointer;
  }
`

const ContentWrap = styled.div`
  width: calc(100% - 360px);
  padding: 0 24px;
  order: 2;

  @media (max-width: ${WIDTH_TABLET_S}) {
    width: 100%;
    margin: 0px auto;
    order: 3;

    & > div {
      display: flex;
      justify-content: center;
    }
  }
`
//------------------------------------------------------
//정보 레벨업관련
const LevelWrap = styled.div`
  display: flex;
  flex-direction: row;
  height: 16px;
  margin-top: 3px;

  @media (max-width: ${WIDTH_TABLET_S}) {
    margin-top: 15px;
    align-items: center;
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
  width: 156px;
  margin-left: 8px;
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
    display: block !important;
    text-align: center;
    & > * {
      display: block;
    }
    span {
    }
  }
`

//팬뱃지
const FanBadgeWrap = styled.div`
  margin-top: 10px;
  text-align: center;

  .fan-badge {
    display: inline-block;
    height: 28px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 400;
    font-stretch: normal;
    font-style: normal;
    line-height: 1;
    letter-spacing: -0.35px;
    padding: 0 10px 0 3px;
    text-align: left;
    color: #ffffff;
  }

  .fan-badge img {
    width: 28px;
    height: 28px;
  }
  .fan-badge span {
    display: inline-block;
    vertical-align: middle;
    line-height: 2.2;
  }
`

//팬, 스타 수
const CountingWrap = styled.div`
  display: flex;
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
  @media (max-width: ${WIDTH_TABLET_S}) {
    text-align: center;
  }
`
//상단버튼
const InfoConfigBtn = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  & > a {
    display: inline-block;
    padding: 0 20px;
    user-select: none;
    border: 1px solid #bdbdbd;
    border-radius: 18px;
    font-size: 14px;
    line-height: 36px;
    color: #9e9e9e;
    cursor: pointer;
  }

  a + a {
    margin-left: 4px;
  }
  .notBjWrap {
    display: flex;
    text-align: center;
    margin-top: 10px;
    & button {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100px;
      height: 36px;
      color: #424242;
      font-size: 14px;
      font-weight: 600;
      transform: skew(-0.03deg);
      letter-spacing: -0.35px;
      margin-right: 4px;
      border-radius: 18px;
      border: solid 1px #424242;
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
        font-weight: 600;
        color: #424242;
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
  margin: 10px 0 0 0;
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
  margin: 10px auto;
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
    margin-right: 7px;
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
