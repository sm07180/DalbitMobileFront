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
          <div key={`fan-${index}`} onClick={() => history.push(link)}>
            <FanRank style={{backgroundImage: `url(${profImg.thumb88x88})`}} className={`rank${rank}`}></FanRank>
          </div>
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
            <span className="rankTitle">팬랭킹</span>
            <em></em>
            {/* <em onClick={() => profile.fanRank.length > 0 && context.action.updateClose(true)} key="btn"></em> */}
          </span>
          {result}
        </FanListWrap>
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
  const params = {
    spaceBetween: 2,
    slidesPerView: 'auto',
    resistanceRatio: 0
  }
  //뱃지
  const createBadgeSlide = () => {
    if (!profile.hasOwnProperty('fanBadgeList')) return null
    return profile.fanBadgeList.map((item, index) => {
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
  }

  if (myProfileNo === profile.memNo) return null

  return (
    <>
      <ProfileWrap>
        <MyProfile webview={webview}>
          <button className="closeBtn" onClick={goBack}></button>
          {urlrStr !== context.token.memNo && (
            <>
              <div onClick={() => context.action.updateMypageReport(true)} className="reportIcon"></div>
            </>
          )}
          <ProfileImg url={profile.profImg ? profile.profImg['thumb190x190'] : ''}>
            {/* {profile.level > 100 && <div className="profileBg" style={{backgroundImage: `url(${profile.profileBg})`}}></div>} */}
            {profile.level > 50 && <div className="holderBg" style={{backgroundImage: `url(${profile.holderBg})`}}></div>}
            <div className="holder" style={{backgroundImage: `url(${profile.holder})`}} onClick={() => figureZoom()}></div>

            <figure onClick={() => figureZoom()}>
              <img src={profile.profImg ? profile.profImg['thumb190x190'] : ''} alt={profile.nickNm} />
            </figure>
            {Zoom === true && (
              <div className="zoom" onClick={() => setZoom(false)}>
                <img src={profile.profImg ? profile.profImg['url'] : ''} alt={profile.nickNm} className="zoomImg" />
              </div>
            )}

            <span className="title">
              Lv{profile.level} {profile.level !== 0 && `${profile.grade}`}
            </span>
            {/*<div className="expBtnWrap">
              <button className="btn-info" onClick={() => setPopupExp(popup ? false : true)}>
                경험치
              </button>
              <a href={`/level`} className="btn-level">
                레벨
              </a>
            </div>*/}
          </ProfileImg>

          <ContentWrap>
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
            <NameWrap>
              {/* <span>ID : {`@${profile.memId}`}</span> */}
              <strong>{profile.nickNm}</strong>
              <div className="subIconWrap">
                {/* {<em className="nationIcon"></em>} */}
                {profile.gender === 'f' && <em className="femaleIcon"></em>}
                {profile.gender === 'm' && <em className="maleIcon"></em>}
                {profile.isSpecial === true && <em className="specialIcon">스페셜 DJ</em>}
              </div>
            </NameWrap>
            <ProfileMsg>{profile.profMsg}</ProfileMsg>
            {profile.fanBadgeList && profile.fanBadgeList.length > 0 ? (
              <BadgeWrap margin={profile.fanBadgeList.length === 1 ? '10px' : '0px'}>
                <Swiper {...params}>{createBadgeSlide()}</Swiper>
              </BadgeWrap>
            ) : (
              <></>
            )}
            {profile.fanRank.length !== 0 && <ButtonWrap>{createFanList()}</ButtonWrap>}

            <div className="categoryCntWrap">
              <div onClick={() => fanContext()}>
                <span>
                  <span className="icoImg type1"></span>
                  <em className="icotitle">팬</em>
                </span>
                <em className="cntTitle">
                  {profile.fanCnt > 9999 ? Utility.printNumber(profile.fanCnt) : Utility.addComma(profile.fanCnt)}
                </em>
              </div>
              <div onClick={() => starContext()}>
                <span>
                  <span className="icoImg type2"></span>
                  <em className="icotitle">스타</em>
                </span>
                <em className="cntTitle">
                  {profile.starCnt > 9999 ? Utility.printNumber(profile.starCnt) : Utility.addComma(profile.starCnt)}
                </em>
              </div>
              <div>
                <span>
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
            <GiftButtonWrap>
              <InfoConfigBtn>
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
              </InfoConfigBtn>
            </GiftButtonWrap>
          </ContentWrap>
          {context.mypageReport === true && <ProfileReport {...props} reportShow={reportShow} />}
          {context.close === true && <ProfileFanList {...props} reportShow={reportShow} name="팬 랭킹" />}
          {context.closeFanCnt === true && <ProfileFanList {...props} reportShow={reportShow} name="팬" />}
          {context.closeStarCnt === true && <ProfileFanList {...props} reportShow={reportShow} name="스타" />}
          {context.closePresent === true && <ProfilePresent {...props} reportShow={reportShow} name="선물" />}
          {popupExp && <LayerPopupExp setPopupExp={setPopupExp} />}
        </MyProfile>
      </ProfileWrap>
    </>
  )
}
export default myProfile
//styled======================================
const ButtonWrap = styled.div`
  margin-top: 14px;
  display: flex;
  justify-content: space-between;
  flex-basis: auto;
  padding-top: 0;
  order: 1;
`
//flex item3
const GiftButtonWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 0;
  @media (max-width: ${WIDTH_TABLET_S}) {
  }
`
const ProfileWrap = styled.div`
  padding-top: 87px;
  position: relative;
  .plus {
    display: block;
    margin-left: 5px;
    width: 11px !important;
    height: 11px !important;
    position: relative;
    :before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 11px;
      height: 1px;
      background-color: #fff;
    }
    :after {
      content: '';
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 1px;
      height: 11px;
      background-color: #fff;
    }
  }
  .expBtnWrap {
    display: flex;
    justify-content: center;
    margin: 4px auto 0 auto;
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
  .liveIcon {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: absolute;
    right: 18px;
    top: 21px;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: -0.25px;
    text-align: center;
    color: #ec455f;
    img {
      padding: 0 0 3px 3px;
    }
  }
`
const PurpleWrap = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 151px;
  background-color: #632beb;
  z-index: 2;
`
const MyProfile = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  margin: 0 auto 0 auto;
  padding: 40px 16px 20px 16px;
  z-index: 3;
  .closeBtn {
    position: absolute;
    width: 32px;
    height: 32px;
    top: -59px;
    right: 10px;
    z-index: 3;
    background: url(${CloseBtnIcon});
  }
  & .reportIcon {
    position: absolute;
    top: -59px;
    width: 32px;
    height: 32px;
    left: 10px;
    z-index: 3;
    background: url(${ReportIcon});
    cursor: pointer;
  }
  .zoom {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    z-index: 22;
    background-color: rgba(0, 0, 0, 0.5);
  }
  .zoomImg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: block;
    width: 95%;
    height: auto;
  }
  & > div {
    flex: 0 0 auto;
  }
  .categoryCntWrap {
    margin: 8px 0;
    display: flex;
    justify-content: center;
    /* flex-direction: column;
    padding: 0; */
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
        margin: 0 auto;
        display: inline-block;
        width: 24px;
        height: 24px;
        background: url(${GrayHeart}) no-repeat center center / cover;
        &.type1 {
          background: url(${BlueHoleIcon}) no-repeat center center / cover;
        }
        &.type2 {
          background: url(${StarIcon}) no-repeat center center / cover;
        }
      }
      .icotitle {
        float: right;
        line-height: 24px;
        font-size: 16px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        letter-spacing: normal;
        text-align: center;
        color: #424242;
      }
      .cntTitle {
        font-size: 20px;
        font-weight: 800;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.13;
        letter-spacing: normal;
        text-align: center;
        color: #000000;
        margin-left: 2px;
      }
    }
    div:last-child {
      :after {
        height: 0;
        width: 0;
      }
    }
  }
`
//flex item3
const ProfileImg = styled.div`
  display: block;
  position: relative;
  height: auto;
  flex-basis: 151px;
  background-size: cover;
  background-position: center;
  text-align: center;
  order: 1;
  margin-top: -100px;
  .holder {
    display: block;
    position: absolute;
    top: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 140px;
    height: 140px;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    z-index: 2;
  }
  .holderBg {
    display: block;
    position: absolute;
    top: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 224px;
    height: 140px;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
  }
  .profileBg {
    display: block;
    position: absolute;
    top: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 180px;
    height: 140px;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
  }
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
  }
  .title {
    position: relative;
    display: inline-block;
    min-width: 100px;
    height: 32px;
    margin-top: 20px;
    padding: 0px 20px;
    line-height: 32px;
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    letter-spacing: -0.35px;
    border-radius: 16px;
    color: #fff;
    background-color: #f54640;
    transform: skew(-0.03deg);
    z-index: 4;
  }
`
const ContentWrap = styled.div`
  width: 100%;
  margin: 13px auto 0 auto;
  order: 3;
  & > div {
    display: flex;
    justify-content: center;
  }
  .dailyTop {
    width: 108px;
    height: 28px;
    line-height: 28px;
    border-radius: 14px;
    margin: 9px auto 0 auto;
    background-image: linear-gradient(91deg, #13a84f 0%, #37b3b9 100%);
    font-size: 12px;
    font-weight: 800;
    letter-spacing: -0.6px;
    text-align: center;
    color: #ffffff;
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
    margin: 4px 0;
    > em {
      display: inline-block;
      height: 16px;
      margin-left: 2px;
      &:first-child {
        margin-left: 0;
      }
    }
  }
  .nationIcon {
    width: 24px;
    background: url(${KoreaIcons}) no-repeat center center / cover;
  }
  .femaleIcon {
    width: 24px;
    background: url(${FemaleIcons}) no-repeat center center / cover;
  }
  .maleIcon {
    width: 24px;
    background: url(${MaleIcons}) no-repeat center center / cover;
  }
  .specialIcon {
    width: 64px;
    border-radius: 10px;
    background-color: #ec455f;
  }
  .specialIcon {
    width: 62px;
    text-align: center;
    line-height: 16px;
    font-size: 12px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: normal;
    color: #fff;
    background-color: #ec455f;
    border-radius: 10px;
  }
  strong {
    color: #000;
    min-height: 24px;
    font-size: 22px;
    font-weight: 800;
    line-height: 24px;
  }
  span {
    padding: 0;
    font-size: 10px;
    line-height: 12px;
    color: #616161;
    transform: skew(-0.03deg);
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
    margin-top: 14px;
    margin-bottom: 14px;
    & button {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 154px;
      height: 36px;
      color: #fff;
      font-size: 14px;
      font-weight: 600;
      transform: skew(-0.03deg);
      letter-spacing: -0.35px;
      margin-right: 4px;
      border-radius: 12px;
      border: solid 1px #632beb;
      background-color: #632beb;

      &.fanRegist {
        border: solid 1px ${COLOR_MAIN};
        background-color: #fff;
        color: ${COLOR_MAIN};
      }
      & span {
        display: block;
        width: 18px;
        height: 18px;
        background: url(${MoonIcon}) no-repeat center center / cover;
      }
      & em {
        display: block;
        font-weight: 600;
        color: #fff;
        font-style: normal;
        line-height: 1.41;
        letter-spacing: -0.35px;
        height: 18px;
      }
    }
    & button:last-child {
      margin-right: 0;
    }
    .giftbutton {
      background-color: #fff;
      color: #632beb;
      em {
        color: #632beb;
      }
    }
  }
`
//팬랭킹
const FanListWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  .rankTitle {
    text-indent: 6px;
  }
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
const ProfileMsg = styled.p`
  width: 70%;
  margin: 0 auto;
  word-break: break-all;
  margin-top: 8px;
  transform: skew(-0.03deg);
  font-size: 14px;
  line-height: 1.43;
  letter-spacing: normal;
  text-align: center;
  color: #757575;
`
