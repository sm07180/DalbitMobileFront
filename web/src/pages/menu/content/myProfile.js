/**
 * @file /mypage/content/my-profile.js
 * @brief 2.5v 마이페이지 상단에 보이는 내 프로필 component.
 */
import React, {useEffect, useContext, useState} from 'react'
import {Link} from 'react-router-dom'
import {OS_TYPE} from 'context/config.js'
import styled from 'styled-components'
import Swiper from 'react-id-swiper'
import qs from 'qs'
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
import Utility, {printNumber} from 'components/lib/utility'
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
import QuestionIcon from '../static/ic_question.svg'
import CrownIcon from '../static/ic_crown.svg'
import {Hybrid, isHybrid} from 'context/hybrid'
// render----------------------------------------------------------------
const myProfile = (props) => {
  let history = useHistory()
  //context & webview
  const {webview} = props
  const context = useContext(Context)
  const {mypageReport, close, closeFanCnt, closeStarCnt} = context
  // state
  const [popup, setPopup] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [Zoom, setZoom] = useState(false)
  const [reportShow, SetShowReport] = useState(false)
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
        <FanListWrap>
          <span onClick={() => profile.fanRank.length > 0 && context.action.updateClose(true)}>
            <span>팬랭킹</span>
            <em onClick={() => profile.fanRank.length > 0 && context.action.updateClose(true)} key="btn"></em>
          </span>
          {result}
        </FanListWrap>
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
      window.history.go(-1)
    }
    //window.location.href = '/'
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
            <div className="title">
              Lv{profile.level} {profile.level !== 0 && `${profile.grade}`}
            </div>
            <div className="InfoWrap">
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
              <div className="expBtnWrap">
                <button className="btn-info" onClick={() => setPopupExp(popup ? false : true)}>
                  경험치
                </button>
                <a href={`/level`} className="btn-level">
                  레벨
                </a>
              </div>

              <strong>{profile.nickNm}</strong>
              <div className="subIconWrap">
                {/* {<em className="nationIcon"></em>} */}
                {profile.gender === 'f' && <em className="femaleIcon"></em>}
                {profile.gender === 'm' && <em className="maleIcon"></em>}
                {profile.isSpecial === true && <em className="specialIcon">스페셜 DJ</em>}
              </div>
            </NameWrap>
            {/* <ProfileMsg dangerouslySetInnerHTML={{__html: profile.profMsg.split('\n').join('<br />')}}></ProfileMsg> */}
            <ProfileMsg>{profile.profMsg}</ProfileMsg>
            {profile.fanBadgeList && profile.fanBadgeList.length > 0 ? (
              <BadgeWrap margin={profile.fanBadgeList.length === 1 ? '10px' : '0px'}>
                <Swiper {...params}>{BadgeSlide}</Swiper>
              </BadgeWrap>
            ) : (
              <div className="topMedal">TOP 랭킹에 도전해보세요</div>
            )}
            {profile.fanRank.length !== 0 && <ButtonWrap>{createFanList()}</ButtonWrap>}

            <div className="categoryCntWrap">
              <div onClick={goFanEdite}>
                <span>
                  <span className="icoImg type1"></span>
                  <em className="icotitle">팬</em>
                </span>
                <em className="cntTitle">{Utility.printNumber(profile.fanCnt)}</em>
              </div>
              <div onClick={goStarEdite}>
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
        {popupExp && <LayerPopupExp setPopupExp={setPopupExp} />}
      </ProfileWrap>
    </>
  )
}
export default myProfile
//2.5v style
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
  /* background-color: #424242; */
  min-height: 391px;
  .title {
    position: relative;
    display: inline-block;
    width: 214px;
    height: 28px;
    line-height: 28px;
    color: #fff;
    padding: 0px 10px 0px 10px;
    margin: 0 auto;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: -0.35px;
    z-index: 4;
    border-radius: 14px;
    background-color: #f54640;
  }
`
//styled======================================
const MyProfile = styled.div`
  display: flex;
  flex-direction: row;
    background-color:#fff;
  /* width: calc(100% - 16px); */
  border-top-left-radius:20px;
  border-top-right-radius:20px;
  min-height: 308px;
  margin: 0 auto 0 auto;
  padding: 40px 16px 57px 16px;
position: relative;
z-index:3;
.closeBtn {
  
    position: absolute;
    right: 12px;
    width: 32px;
    height: 32px;
    top: -40px;

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
      margin: 4px 0 20px 0;
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
            
  font-size: 18px;
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
    padding: 0;
    
    /* padding-top: ${(props) => (props.webview && props.webview === 'new' ? '48px' : '')}; */
  }
  .topMedal {
    display: flex;
    justify-content: center;
    align-items: center;
    max-width: 190px;
    height: 28px;
    margin: 12px auto 0 auto;
    padding: 0 10px;
    border-radius: 14px;
    border: solid 1px #e0e0e0;
    background-color: #f5f5f5;
    font-size: 12px;
    font-weight: 600;
    line-height: 28px;
    text-align: center;
    color: #bdbdbd;
    letter-spacing: -0.6px;
    :before {
      display: block;
      content: '';
      width: 26px;
      height: 16px;
      margin-right: 8px;
      background: url(${CrownIcon}) no-repeat center center / cover;
    }
  }
`
//flex item3
const ButtonWrap = styled.div`
  flex-basis: 204px;
  padding-top: 35px;
  text-align: right;
  order: 3;
  @media (max-width: ${WIDTH_TABLET_S}) {
    margin-top: 16px;
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
    margin: 0px auto 19px auto;
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

  .InfoWrap {
    display: flex;
    flex-direction: column;
    margin: -5px auto 0 auto;
    position: relative;
    border-radius: 30px;
    /* background: #eeeeee; */
    width: 280px;
    /* min-height: 60px; */
    font-size: 12px;
    text-align: center;
    z-index: 2;
    transform: skew(-0.03deg);

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
    font-size: 12px;
    margin-right: 4px;
    margin-left: 2px;
    font-weight: 800;
    color: #000;
    line-height: 1.1;
    &.mr7 {
      margin-right: 7px;
    }
    &.ml6 {
      margin-left: 6px;
      font-weight: normal;
    }
    &.red {
      color: #000;
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
    font-size: 12px;
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
const LevelStatusBarWrap = styled.div`
  position: relative;
  width: 188px;
  border-radius: 10px;
  background-color: #eee;
  @media (max-width: ${WIDTH_TABLET_S}) {
    height: 14px;
  }
`
const LevelStatus = styled.div`
  position: absolute;
  top: -1px;
  left: -1px;
  height: 14px;
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
  @media (max-width: ${WIDTH_TABLET_S}) {
    line-height: 14px;
  }
`
//닉네임
const NameWrap = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;

  .expBtnWrap {
    display: flex;
    > a {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 72px;
      height: 20px;
      border-radius: 14px;
      border: solid 1px #eeeeee;
      background-color: #ffffff;
      font-size: 12px;
      font-weight: 600;
      color: #757575;
      :after {
        content: '';
        width: 20px;
        height: 12px;
        background: url(${QuestionIcon}) no-repeat center center / cover;
        margin-left: 7px;
      }
    }
    > button {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 2px;
      width: 72px;
      height: 20px;
      border-radius: 14px;
      border: solid 1px #eeeeee;
      background-color: #ffffff;
      font-size: 12px;
      font-weight: 600;
      color: #757575;
      :after {
        content: '';
        height: 12px;
        width: 20px;
        background: url(${QuestionIcon}) no-repeat center center / cover;
        margin-left: 7px;
      }
    }
  }
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
    max-width: 260px;
    font-size: 22px;
    line-height: 24px;
    min-height: 24px;
    font-weight: 800;
    margin-top: 14px;
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
//프로필메세지
const ProfileMsg = styled.pre`
  width: 70%;
  margin: 0 auto;
  margin-top: 8px;
  transform: skew(-0.03deg);
  font-size: 14px;
  font-family: inherit;
  line-height: 1.43;
  letter-spacing: normal;
  text-align: center;
  color: #424242;
`
