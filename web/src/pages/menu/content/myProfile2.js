/**
 * @file /mypage/content/my-profile.js
 * @brief 2.5v 마이페이지 상단에 보이는 내 프로필 component.
 */
import React, {useEffect, useContext, useState} from 'react'
//route
import {Link} from 'react-router-dom'
import {OS_TYPE} from 'context/config.js'
//styled
import styled from 'styled-components'
//component
import ProfileReport from './profile_report'
import ProfileFanList from './profile_fanList'
// context
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {WIDTH_TABLET_S, IMG_SERVER} from 'context/config'
import Api from 'context/api'
import {Context} from 'context'
// utility
import Utility, {printNumber} from 'components/lib/utility'
//svg
import LiveIcon from '../component/ic_live.svg'
import FemaleIcon from '../static/ico_female.svg'
import MaleIcon from '../static/ico_male.svg'
import PlusCircle from '../static/ico_circle.svg'
import GrayHeart from '../static/ico_like_g.svg'
import CloseIcon from '../static/ic_close.svg'
import KoreaIcon from '../static/ico_korea.svg'
import BlueHoleIcon from '../static/bluehole.svg'
import StarIcon from '../static/star.svg'
import CloseBtnIcon from '../component/ic_closeBtn.svg'
// render----------------------------------------------------------------
const myProfile = props => {
  const {webview} = props
  //context
  const context = useContext(Context)
  const {mypageReport, close, closeFanCnt, closeStarCnt} = context
  // state
  const [popup, setPopup] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [Zoom, setZoom] = useState(false)
  const [reportShow, SetShowReport] = useState(false)
  //pathname
  const urlrStr = props.location.pathname.split('/')[2]
  const {profile} = props
  const myProfileNo = context.profile.memNo
  //function-----------------------------------------------------

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
  //function:팬해제
  const Cancel = myProfileNo => {
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
  const fanRegist = myProfileNo => {
    fetchDataFanRegist(myProfileNo)
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
          <span>
            <span>팬랭킹</span>
            <em onClick={() => profile.fanRank.length > 0 && context.action.updateClose(true)} key="btn"></em>
          </span>
          {result}
        </FanListWrap>
      </>
    )
  }
  //팝업실행
  const popStateEvent = e => {
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
  //func back
  const goBack = () => {
    window.location.href = '/'
  }
  return (
    <>
      <ProfileWrap>
        <MyProfile webview={webview}>
          <button className="closeBtn" onClick={goBack}></button>
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
            <div className="InfoWrap">
              <div className="title">
                Lv{profile.level}. {profile.level !== 0 && `${profile.grade}`}
              </div>
              {urlrStr == 'profile' && (
                <>
                  <LevelWrap>
                    <LevelStatusBarWrap>
                      <LevelStatus
                        style={{
                          width: `${expCalc < 20 ? `calc(${expCalc}% + 20px)` : `calc(${expCalc}%)`}`
                        }}></LevelStatus>
                    </LevelStatusBarWrap>
                    <div className="levelInfo">
                      <div className="subInfo line">
                        <span className="expTitle">0</span>
                        <span className="expTitle red mr7">
                          EXP {Math.floor(((profile.expNext - profile.expBegin) * expPercent) / 100)}
                        </span>
                      </div>
                      <div className="subInfo">
                        <span className="expTitle ml6">{profile.expRate}%</span>
                        <span className="expTitle">{profile.expNext - profile.expBegin}</span>
                      </div>
                    </div>
                  </LevelWrap>
                </>
              )}
            </div>
          </ProfileImg>

          <ContentWrap>
            <NameWrap>
              {/* <span>ID : {`@${profile.memId}`}</span> */}
              <strong>{profile.nickNm}</strong>
              <div className="subIconWrap">
                {<em className="nationIcon"></em>}
                {profile.gender === 'f' && <em className="femaleIcon"></em>}
                {profile.gender === 'm' && <em className="maleIcon"></em>}
                {profile.isSpecial === true && <em className="specialIcon">스페셜 DJ</em>}
              </div>
            </NameWrap>
            <ButtonWrap>{createFanList()}</ButtonWrap>
            <div className="categoryCntWrap">
              <div onClick={() => fanContext()}>
                <span>
                  <span className="icoImg type1"></span>
                  <em className="icotitle">팬</em>
                </span>
                <em className="cntTitle">{Utility.printNumber(profile.fanCnt)}</em>
              </div>
              <div onClick={() => starContext()}>
                <span>
                  <span className="icoImg type2"></span>
                  <em className="icotitle">스타</em>
                </span>
                <em className="cntTitle">{Utility.printNumber(profile.starCnt)}</em>
              </div>
              <div>
                <span>
                  <span className="icoImg"></span>
                  <em className="icotitle">좋아요</em>
                </span>
                <em className="cntTitle">{Utility.printNumber(profile.likeTotCnt)}</em>
              </div>
              {urlrStr !== myProfileNo && urlrStr !== 'profile' && (
                <div onClick={() => context.action.updateMypageReport(true)}></div>
              )}
            </div>
            {/* <CountingWrap></CountingWrap> */}
          </ContentWrap>
          {context.mypageReport === true && <ProfileReport {...props} reportShow={reportShow} />}
          {context.close === true && <ProfileFanList {...props} reportShow={reportShow} name="팬 랭킹" />}
          {context.closeFanCnt === true && <ProfileFanList {...props} reportShow={reportShow} name="팬" />}
          {context.closeStarCnt === true && <ProfileFanList {...props} reportShow={reportShow} name="스타" />}
          {/* {context.closePresent === true && <ProfilePresent {...props} reportShow={reportShow} name="선물" />} */}
        </MyProfile>
      </ProfileWrap>
    </>
  )
}

export default myProfile
//2.5v

const PurpleWrap = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 387px;
  padding-bottom: 8px;
  z-index: 2;
`
const ProfileWrap = styled.div`
  padding-top: 87px;
  position: relative;
  background-color: #424242;
  min-height: 391px;
`
//styled======================================
const MyProfile = styled.div`
  display: flex;
  flex-direction: row;
    background-color:#fff;
  width: calc(100% - 16px);
  border-radius:20px;
  min-height: 296px;
  margin: 0 auto 0 auto;
  padding: 40px 16px 57px 16px;
position: relative;
z-index:3;
.closeBtn {
    position: absolute;
    right: 0;
    width: 32px;
    height: 32px;
    top: -40px;
    right: 0px;
    z-index: 16;
    background: url(${CloseBtnIcon});
  }
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
  }
  .categoryCntWrap {
      margin: 2px 0 0px 0;
      display: flex;
      div {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        position: relative;
        width: 88px;
        height: 50px;
        :after {
          content: '';
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          height: 40px;
          width: 1px;
          background-color: #eeeeee;
        }
        .icoImg {
            margin:0 auto;
            display: inline-block;
            width:24px;
            height:24px;
            background:url(${GrayHeart})no-repeat center center /cover;

            &.type1 {
              background:url(${BlueHoleIcon})no-repeat center center /cover;
            }
            &.type2 {
              background:url(${StarIcon})no-repeat center center /cover;
            }
        }
        .icotitle {
            float:right;
            margin-left:2px;
            line-height:24px;
                            font-size: 12px;
                font-weight: normal;
                font-stretch: normal;
                font-style: normal;
                letter-spacing: normal;
                text-align: center;
                color: #424242;
        }
        .cntTitle {
            
  font-size: 16px;
  font-weight: 800;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.13;
  letter-spacing: normal;
  text-align: center;
  color: #000000;
  margin-left:2px;
        }
      }
      div:last-child {
        :after {
          height: 0;
          width: 0;
        } 
      }
  }
  @media (max-width: ${WIDTH_TABLET_S}) {
    flex-direction: column;
    padding: 0px 0 16px 0;
    
    /* padding-top: ${props => (props.webview && props.webview === 'new' ? '48px' : '')}; */
  }
`
//flex item3
const ButtonWrap = styled.div`
  flex-basis: 204px;
  padding-top: 35px;
  text-align: right;
  order: 3;
  @media (max-width: ${WIDTH_TABLET_S}) {
    margin-top: 11px;
    display: flex;
    justify-content: space-between;
    flex-basis: auto;
    padding-top: 0;
    order: 1;
  }
`

const ProfileImg = styled.div`
  display: block;
  position: relative;
  flex-basis: 151px;
  background-size: cover;
  background-position: center;
  text-align: center;
  order: 1;
  margin-top: -61px;
  figure {
    position: relative;
    width: 100px;
    height: 100px;
    margin: 10px auto 19px auto;
    border-radius: 50%;
    background: url(${props => props.url}) no-repeat center center/ cover;
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

  .InfoWrap {
    display: flex;
    flex-direction: column;
    margin: 14px auto 0 auto;
    position: relative;
    border-radius: 30px;
    background: #eeeeee;
    width: 280px;
    min-height: 60px;
    font-size: 12px;
    text-align: center;
    z-index: 2;
    transform: skew(-0.03deg);
    .title {
      color: #000;
      padding: 8px 0 4px 0;
      font-size: 14px;
      font-weight: 800;
      letter-spacing: -0.35px;
    }
    .expWrap {
      width: 280px;
      display: flex;
      justify-content: space-between;
      margin: 8px auto 10px auto;
    }
    .expPer {
      display: block;
      font-size: 12px;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.08;
      letter-spacing: normal;
      text-align: center;
      color: #632beb;
    }
    .expBegin {
      font-size: 12px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.08;
      letter-spacing: normal;
      text-align: left;
      color: #424242;
    }
    .expBegin:nth-child(1) {
      margin-left: 8px;
    }
    .expBegin:nth-child(2) {
      margin-right: 8px;
    }
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
  padding: 0 24px;
  order: 2;

  @media (max-width: ${WIDTH_TABLET_S}) {
    width: 100%;
    margin: 0 auto;
    order: 3;

    & > div {
      display: flex;
      justify-content: center;
    }
  }
  .expWrap {
    width: 280px;
    display: flex;
    justify-content: space-between;
    margin: 8px auto 10px auto;
  }
  .expPer {
    display: block;
    font-size: 12px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.08;
    letter-spacing: normal;
    text-align: center;
    color: #632beb;
  }
  .expBegin {
    font-size: 12px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.08;
    letter-spacing: normal;
    text-align: left;
    color: #424242;
  }
  .expBegin:nth-child(1) {
    margin-left: 8px;
  }
  .expBegin:nth-child(2) {
    margin-right: 8px;
  }
`

//------------------------------------------------------
//정보 레벨업관련
const LevelWrap = styled.div`
  display: flex;
  flex-direction: column;
  /* height: 16px; */
  .expTitle {
    margin-right: 4px;
    margin-left: 2px;
    font-weight: 600;
    font-size: 10px;
    color: #000;
    line-height: 1.1;
    &.mr7 {
      margin-right: 7px;
    }
    &.ml6 {
      margin-left: 6px;
    }
    &.red {
      color: #f54640;
    }
  }
  .expRate {
    margin-left: 6px;
    font-weight: 600;
    font-size: 10px;
    color: #000;
    line-height: 1.1;
  }
  .levelInfo {
    width: 100%;
    display: flex;
    justify-content: center;
    flex-direction: row;
    padding: 4px 0;
    .subInfo {
      position: relative;
      display: flex;
      justify-content: space-between;
      width: 100px;

      &.line:after {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: 0px;
        content: '';
        width: 1px;
        height: 8px;
        background-color: #bdbdbd;
      }
    }
  }
  @media (max-width: ${WIDTH_TABLET_S}) {
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
  width: 200px;
  border-radius: 10px;
  background-color: #fff;

  @media (max-width: ${WIDTH_TABLET_S}) {
    height: 12px;
  }
`
const LevelStatus = styled.div`
  position: absolute;
  top: -1px;
  left: -1px;
  height: calc(100% + 2px);
  max-width: calc(100% + 2px);
  border-radius: 10px;
  background-color: #f54640;
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
  display: flex;
  align-items: center;
  flex-direction: column;

  .subIconWrap {
    display: flex;
    flex-direction: row;
  }
  .nationIcon {
    width: 24px;
    height: 16px;
    margin-top: 4px;
    background: url(${KoreaIcon}) no-repeat center center / cover;
  }
  .femaleIcon {
    width: 24px;
    height: 16px;
    margin-top: 4px;
    margin-left: 2px;
    background: url(${FemaleIcon}) no-repeat center center / cover;
  }
  .maleIcon {
    width: 24px;
    height: 16px;
    margin-top: 4px;
    margin-left: 2px;
    background: url(${MaleIcon}) no-repeat center center / cover;
  }
  .specialIcon {
    width: 64px;
    height: 16px;
    margin-top: 4px;
    border-radius: 10px;
    background-color: #ec455f;
    margin-left: 2px;
  }
  strong {
    color: #000;
    font-size: 20px;
    line-height: 20px;
    font-weight: 800;
    margin-top: 12px;
  }
  .specialIcon {
    display: inline-block;
    width: 62px;
    height: 16px;
    line-height: 16px;
    margin-left: 2px;
    border-radius: 10px;
    background-color: #ec455f;
    color: #fff;
    font-size: 12px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: normal;
  }
  span {
    color: #616161;
    font-size: 10px;
    padding: 12px 0 0 0;
    line-height: 12px;
    transform: skew(-0.03deg);
  }

  @media (max-width: ${WIDTH_TABLET_S}) {
    text-align: center;
    & > * {
    }
    span {
      transform: skew(-0.03deg);
    }
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
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: bold;
    letter-spacing: -0.35px;
    margin-right: 12px;
    color: #000000;
    transform: skew(-0.03deg);
    width: 72px;
    height: 28px;
    line-height: 28px;
    border-radius: 25px;
    border: solid 1px #e0e0e0;
    background-color: #ffffff;
    em {
      width: 20px;
      height: 20px;
      background: url(${PlusCircle}) no-repeat center center / contain;
    }
  }
  & .moreFan {
    width: 28px;
    height: 28px;
    border: 1px solid #e0e0e0;
    border-radius: 50%;
    vertical-align: top;
    margin-top: -5px;
    margin-left: 2px;
    span {
      display: inline-block;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
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
    margin-top: 0px;
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

  @media (max-width: ${WIDTH_TABLET_S}) {
    width: 28px;
    height: 28px;
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
