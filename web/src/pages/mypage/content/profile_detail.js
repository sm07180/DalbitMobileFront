import React, {useState, useEffect, useContext, useCallback} from 'react'
import {useHistory} from 'react-router-dom'
// context
import Api from 'context/api'
//route
import {OS_TYPE} from 'context/config.js'
import qs from 'query-string'
import Room, {RoomJoin} from 'context/room'
// utility
import Utility, {printNumber, addComma} from 'components/lib/utility'
import {Hybrid, isHybrid} from 'context/hybrid'
import Swiper from 'react-id-swiper'

import BadgeList from 'common/badge_list'
//component
import ProfileReport from './profile_report'
import UserReport from './user_report'
import ProfileFanList from './profile_fanList'
import ProfilePresent from './profile_present'
import ProfileRank from './profile_rank'
import ProfileFanRank from './profile_fanRank'
import LayerPopupExp from './layer_popup_exp.js'
import AdminIcon from '../../menu/static/ic_home_admin.svg'
import EditIcon from '../static/edit_g_l.svg'
import AlarmOffIcon from '../static/alarm_off_p.svg'
import AlarmOnIcon from '../static/alarm_on_w.svg'
import {useDispatch, useSelector} from "react-redux";
import {
  setGlobalCtxClose,
  setGlobalCtxCloseFanCnt,
  setGlobalCtxCloseFanRank, setGlobalCtxCloseGoodCnt, setGlobalCtxClosePresent,
  setGlobalCtxCloseRank, setGlobalCtxCloseSpecial, setGlobalCtxCloseStarCnt,
  setGlobalCtxMessage, setGlobalCtxMultiViewer,
  setGlobalCtxMyPageFanCnt, setGlobalCtxMyPageReport, setGlobalCtxUpdatePopup
} from "redux/actions/globalCtx";

const LiveIcon = 'https://image.dallalive.com/svg/ic_live.svg'
const ListenIcon = 'https://image.dallalive.com/svg/ico_listen.svg'
const PostBoxIcon = 'https://image.dallalive.com/svg/ico_postbox_p.svg'
const PostBoxOffIcon = 'https://image.dallalive.com/svg/postbox_g_off.svg'

export default (props) => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  //context & webview
  let history = useHistory()
  const {mypageReport, close, closeFanCnt, closeStarCnt, token} = globalState
  const {profile, location, webview, locHash, setProfileInfo} = props
  const customHeader = JSON.parse(Api.customHeader)

  const urlrStr = location.pathname.split('/')[2]
  // state
  const [popup, setPopup] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [Zoom, setZoom] = useState(false)
  const [reportShow, setReportShow] = useState(false)
  const [showAdmin, setShowAdmin] = useState(false)
  const [showPresent, setShowPresent] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [rankTabType, setRankTabType] = useState('tabRank') //tabRank, tabgood

  //pop
  const [popupExp, setPopupExp] = useState(false)
  const figureZoom = () => {
    setZoom(true)
  }
  // 로그인한 user memNo
  const myProfileNo = globalState.profile.memNo
  const createFanList = () => {
    if (profile.fanRank == false) return null
    let result = []
    for (let index = 0; index < 3; index++) {
      if (profile.fanRank[index] == undefined) {
      } else {
        const {memNo, profImg, rank} = profile.fanRank[index]
        let link = `/profile/${memNo}?webview=${webview}`
        result = result.concat(
          <div
            style={{backgroundImage: `url(${profImg.thumb292x292})`}}
            className={`fanItem rank${rank}`}
            onClick={() => history.push(link)}
            key={index}></div>
        )
      }
    }
    result = result.concat(
      <button
        className="btn__fanMore"
        onClick={() => profile.fanRank.length > 0 && dispatch(setGlobalCtxClose(true))}
        key="btn"
        style={{display: 'none'}}>
        <span></span>
      </button>
    )
    return (
      <>
        <div className="fanRankList">
          {myProfileNo === profile.memNo ? (
            <button
              className="btn__fanRank"
              onClick={() => {
                dispatch(setGlobalCtxCloseRank(true))
                setRankTabType('tabRank')
              }}>
              팬랭킹
            </button>
          ) : (
            <button
              className="btn__fanRank"
              onClick={() => {
                profile.fanRank.length > 0 && dispatch(setGlobalCtxCloseRank(true))
                setRankTabType('tabRank')
              }}>
              팬랭킹
            </button>
          )}

          {result}
        </div>
      </>
    )
  }
  const viewLayer = (type) => {
    if (type === 'fan') {
      if (showEdit === true) {
        editFan()
      } else {
        viewFanList()
      }
    } else if (type === 'star') {
      if (showEdit === true) {
        editStar()
      } else {
        viewStarList()
      }
    } else if (type === 'like') {
      viewGoodList()
    }
  }
  const createCountList = (type, count) => {
    let text, ico
    if (type === 'fan') {
      text = '팬'
      ico = 'type1'
    } else if (type === 'star') {
      text = '스타'
      ico = 'type2'
    } else if (type === 'like') {
      text = '좋아요'
    }
    return (
      <>
        {type !== 'like' && count > 0 ? (
          <div className="count-box" onClick={() => viewLayer(type)}>
            <span className="icoWrap isArrow">
              <span className={`icoImg ${ico}`}></span>
              <em className={`icotitle ${showEdit ? 'icotitle--active' : ''}`}>{text}</em>
            </span>
            <em className="cntTitle">{count > 9999 ? Utility.printNumber(count) : Utility.addComma(count)}</em>
          </div>
        ) : (
          <div className="count-box" onClick={() => viewLayer(type)}>
            <span className="icoWrap">
              <span className={`icoImg ${ico}`}></span>
              <em className="icotitle">{text}</em>
            </span>
            <em className="cntTitle">{count > 9999 ? Utility.printNumber(count) : Utility.addComma(count)}</em>
          </div>
        )}
      </>
    )
  }
  const editFan = () => {
    history.push(`/mypage/${profile.memNo}/edit_fan`)
  }
  const editStar = () => {
    history.push(`/mypage/${profile.memNo}/edit_star`)
  }

  //팬등록
  async function fetchDataFanRegist(myProfileNo, nickNm) {
    const res = await Api.fan_change({
      data: {
        memNo: urlrStr
      }
    })
    if (res.result === 'success') {
      dispatch(setGlobalCtxMessage({type: "toast",
        msg: `${nickNm}님의 팬이 되었습니다`
      }))
      dispatch(setGlobalCtxMyPageFanCnt(myProfileNo));
    } else if (res.result === 'fail') {
      dispatch(setGlobalCtxMessage({type: "alert",
        callback: () => {},
        msg: res.message
      }))
    }
  }
  //function:팬해제
  const Cancel = (myProfileNo, nickNm) => {
    dispatch(setGlobalCtxMessage({type: "confirm",
      msg: `${nickNm} 님의 팬을 취소 하시겠습니까?`,
      callback: () => {
        async function fetchDataFanCancel(myProfileNo) {
          const res = await Api.mypage_fan_cancel({
            data: {
              memNo: urlrStr
            }
          })
          if (res.result === 'success') {
            dispatch(setGlobalCtxMessage({type: "toast",
              msg: res.message
            }))
            dispatch(setGlobalCtxMyPageFanCnt(myProfileNo + 1));
          } else if (res.result === 'fail') {
            dispatch(setGlobalCtxMessage({type: "alert",
              callback: () => {},
              msg: res.message
            }))
          }
        }
        fetchDataFanCancel(myProfileNo)
      }
    }))
  }
  //function:팬등록
  const fanRegist = (myProfileNo, nickNm) => {
    fetchDataFanRegist(myProfileNo, nickNm)
  }
  //func star count
  const viewStarList = () => {
    if (profile.starCnt > 0) {
      dispatch(setGlobalCtxCloseStarCnt(true))
    }
  }
  //func fuan count
  const viewFanList = () => {
    if (profile.fanCnt > 0) {
      dispatch(setGlobalCtxCloseFanCnt(true))
    }
  }
  //func Good count
  const viewGoodList = () => {
    if (myProfileNo !== profile.memNo) {
      dispatch(setGlobalCtxCloseFanRank(true))
      setRankTabType('tabGood')
    } else {
      if (profile.likeTotCnt > 0) {
        dispatch(setGlobalCtxCloseRank(true))
        setRankTabType('tabGood')
      }
    }
  }

  //스와이퍼
  // const swiperParams = {
  //   slidesPerView: 'auto'
  // }
  //스와이퍼
  const swiperParams = {
    spaceBetween: 2,
    slidesPerView: 'auto',
    resistanceRatio: 0
  }
  //배지
  const BadgeSlide = profile.liveBadgeList.concat(profile.fanBadgeList).map((item, index) => {
    if (!profile.hasOwnProperty('liveBadgeList') && !profile.hasOwnProperty('fanBadgeList')) return null
    const {text, icon, startColor, endColor} = item

    //-----------------------------------------------------------------------
    return (
      <div className="badgeSlide" key={index}>
        {/* <span
          className="fan-badge"
          style={{
            background: `linear-gradient(to right, ${startColor}, ${endColor}`
          }}>
          {icon !== '' && <img src={icon} alt="배지아이콘" className="icon-badge" />}
          <span>{text}</span>
        </span> */}
        {text === '콘텐츠 DJ' && <em className={`icon_wrap icon_contentsdj_profile`}></em>}
        {text !== '콘텐츠 DJ' && (
          <em
            className={`icon_wrap icon_badge ${icon !== '' ? 'img' : 'text'}`}
            key={`badge-${index}`}
            style={{
              background: `linear-gradient(to right, ${startColor}, ${endColor}`
            }}>
            {icon !== '' && <img src={icon} alt="배지아이콘" className="img" />}
            <span>{text}</span>
          </em>
        )}
      </div>
    )
  })

  //팝업실행
  const popStateEvent = (e) => {
    if (e.state === null) {
      setPopup(false)
      dispatch(setGlobalCtxMyPageReport(false))
      dispatch(setGlobalCtxClose(false))
      dispatch(setGlobalCtxCloseFanCnt(false))
      dispatch(setGlobalCtxCloseStarCnt(false))
      dispatch(setGlobalCtxCloseGoodCnt(false))
    } else if (e.state === 'layer') {
      setPopup(true)
    }
  }
  // expCalculate function
  let expCalc = Math.floor(((profile.exp - profile.expBegin) / (profile.expNext - profile.expBegin)) * 100)
  if (expCalc == 'Infinity') expCalc = 0
  let expPercent = ((profile.exp - profile.expBegin) / (profile.expNext - profile.expBegin)) * 100
  if (expPercent == 'Infinity') expCalc = 0
  // loading
  if (profile === null) {
    return <div style={{minHeight: '230px'}}></div>
  }

  const goBack = () => {
    const {webview} = qs.parse(location.search)
    if (webview && webview === 'new' && isHybrid()) {
      sessionStorage.removeItem('webview')
      Hybrid('CloseLayerPopup')
    } else {
      if (locHash instanceof Object && locHash.state) {
        locHash.state.hash === '#layer' ? history.go(-2) : history.goBack()
      } else {
        history.goBack()
      }
    }
  }
  // check special Dj
  const checkSpecialDj = () => {
    if (profile.wasSpecial === true && profile.badgeSpecial === 0) {
      return (
        <div className="checkBadge" onClick={() => dispatch(setGlobalCtxCloseSpecial(true))}>
          <div className="specialIcon prev"/>
        </div>
      )
    } else if (profile.badgeSpecial > 0) {
      return (
        <div className="checkBadge" onClick={() => dispatch(setGlobalCtxCloseSpecial(true))}>
          <div className="specialIcon">
            {profile.specialDjCnt && profile.specialDjCnt > 0 ? (
              <em className="specialIcon__count">{profile.specialDjCnt}</em>
            ) : (
              ''
            )}
          </div>
        </div>
      )
    } else if (profile.isNew === true) {
      return <span className="newIcon">신입 DJ</span>
    } else if (profile.isNewListener === true) {
      return <span className="newIcon">신입청취자</span>
    } else {
      return <span className="blind">no badge</span>
    }
  }

  const editAlarm = useCallback(
    async (bool) => {
      const res = await Api.editPushMembers({
        memNo: profile.memNo,
        isReceive: bool
      })
      return res
    },
    [profile]
  )

  const callAlarmReceiveConfirm = useCallback(() => {
    dispatch(setGlobalCtxMessage({type: "confirm",
      title: '알림받기 설정',
      msg: `팬으로 등록하지 않아도
      🔔알림받기를 설정하면
     방송시작에 대한 알림 메시지를 
     받을 수 있습니다.`,
      buttonText: {
        right: '설정하기'
      },
      callback: async () => {
        const {result, data, message} = await editAlarm(true)
        if (result === 'success') {
          setProfileInfo({
            ...profile,
            isReceive: data.isReceive
          })

          dispatch(setGlobalCtxMessage({type: "alert",
            title: '방송 알림 설정을 완료하였습니다',
            msg: `마이페이지 > 서비스 설정 ><br/> [알림설정 관리]에서
              설정한 회원을<br/> 확인하고 삭제 할 수 있습니다.
            `
          }))
        } else {
          dispatch(setGlobalCtxMessage({type: "alert",
            msg: message
          }))
        }
      }
    }))
  }, [profile])

  const callAlarmCancelConfirm = useCallback(() => {
    dispatch(setGlobalCtxMessage({type: "confirm",
      msg: `선택한 회원의 방송 알림 설정을<br/>해제 하시겠습니까?`,
      callback: async () => {
        const {result, data, message} = await editAlarm(false)

        if (result === 'success') {
          setProfileInfo({
            ...profile,
            isReceive: data.isReceive
          })
          dispatch(setGlobalCtxMessage({type: "alert",
            msg: '설정해제가 완료되었습니다.'
          }))
        } else {
          dispatch(setGlobalCtxMessage({type: "alert",
            msg: message
          }))
        }
      }
    }))
  }, [profile])

  //경험치바 퍼센트 정리
  const exBar = profile.expRate - 100

  //function모바일 레어어 실행
  useEffect(() => {
    if (popup) {
      if (window.location.hash === '') {
        window.history.pushState('layer', '', '/#layer')
        setScrollY(window.scrollY)
      }
    } else if (!popup) {
      if (window.location.hash === '#layer') {
        // window.history.back()
        history.goBack()
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
  useEffect(() => {
    if (myProfileNo === profile.memNo) {
      if (globalState.adminChecker === true) {
        setShowAdmin(true)
      }
      setShowPresent(false)
      setShowEdit(true)
    } else {
      setShowPresent(true)
      setShowEdit(false)
      setShowAdmin(false)
    }
  }, [profile.memNo])

  const createMailboxIcon = () => {
    if (myProfileNo !== profile.memNo) {
      return (
        <button
          className="liveIcon"
          onClick={async () => {
            if (!globalState.myInfo.level) {
              const myProfile = await Api.profile({ params: { memNo: token.memNo } })
              if(myProfile.data.level === 0) {
                return dispatch(setGlobalCtxMessage({type: "alert",
                  msg: '메시지는 1레벨부터 이용 가능합니다. \n 레벨업 후 이용해주세요.'
                }))
              }
            }
            if (!profile.level) {
              return dispatch(setGlobalCtxMessage({type: "alert",
                msg: '0레벨 회원에게는 메시지를 \n 보낼 수 없습니다.'
              }))
            }

            if (isHybrid()) {
              Hybrid('JoinMailBox', profile.memNo)
            } else {
              dispatch(setGlobalCtxUpdatePopup({popup:['APPDOWN', 'appDownAlrt', 5]}));
            }
          }}>
          {profile.isMailboxOn ? (
            <img src={PostBoxIcon} className="ico-live" />
          ) : (
            <img src={PostBoxOffIcon} className="ico-live" />
          )}
        </button>
      )
    }
  }

  return (
    <div className="profile-detail">
      <div className="adminEditButton">
        {profile.memNo == myProfileNo && (
          <button
            onClick={() => {
              history.push(`/private`)
            }}>
            <img src={EditIcon} alt="마이프로필 수정하기" />
          </button>
        )}

        {token && token.isLogin && showAdmin && (
          <a href="/admin/question">
            <img src={AdminIcon} alt="관리자아이콘" />
          </a>
        )}
      </div>

      <button className="closeBtn" onClick={goBack}>
        <span className="blind">프로필 닫기</span>
      </button>
      <div className="profile-content">
        {myProfileNo !== profile.memNo && (
          <>
            <div onClick={() => dispatch(setGlobalCtxMyPageReport(true))} className="reportIcon">
              <span className="blind">신고하기</span>
            </div>
          </>
        )}
        <div className="rightButton">
          {myProfileNo !== profile.memNo && profile.roomNo !== '' && (
            <button
              className="liveIcon"
              onClick={() => {
                if (customHeader['os'] === OS_TYPE['Desktop']) {
                  if (globalState.token.isLogin === false) {
                    dispatch(setGlobalCtxMessage({type: "alert",
                      msg: '해당 서비스를 위해<br/>로그인을 해주세요.',
                      callback: () => {
                        history.push('/login')
                      }
                    }))
                  } else {
                    dispatch(setGlobalCtxUpdatePopup({popup: ['APPDOWN', 'appDownAlrt', 2]}));
                  }
                } else {
                  if (webview === 'new') {
                    if (
                      globalState.customHeader['os'] === OS_TYPE['Android'] ||
                      (globalState.customHeader['os'] === OS_TYPE['IOS'] && globalState.customHeader['appBuild'] >= 178)
                    ) {
                      //IOS 웹뷰에서 같은 방 진입시
                      if (
                        globalState.customHeader['os'] === OS_TYPE['IOS'] &&
                        Utility.getCookie('listen_room_no') == profile.roomNo
                      ) {
                        return Hybrid('CloseLayerPopup')
                      }
                      //
                      return RoomJoin({roomNo: profile.roomNo})
                    }
                  }

                  if (webview === 'new' && Utility.getCookie('listen_room_no')) {
                    return false
                  }

                  if (
                    webview === 'new' &&
                    Utility.getCookie('clip-player-info') &&
                    globalState.customHeader['os'] === OS_TYPE['IOS']
                  ) {
                    return dispatch(setGlobalCtxMessage({type: "alert",msg: `클립 종료 후 청취 가능합니다.\n다시 시도해주세요.`}))
                  } else {
                    if (
                      webview === 'new' &&
                      Utility.getCookie('listen_room_no') &&
                      globalState.customHeader['os'] === OS_TYPE['IOS']
                    ) {
                      return false
                    } else {
                      RoomJoin({roomNo: profile.roomNo, nickNm: profile.nickNm})
                    }
                  }
                }
              }}>
              <em className="icon_wrap icon_live icon_live_28">라이브중</em>
            </button>
          )}

          {myProfileNo !== profile.memNo && profile.roomNo === '' && profile.listenRoomNo !== '' && (
            <button
              className="liveIcon"
              onClick={() => {
                if (customHeader['os'] === OS_TYPE['Desktop']) {
                  if (globalState.token.isLogin === false) {
                    dispatch(setGlobalCtxMessage({type: "alert",
                      msg: '해당 서비스를 위해<br/>로그인을 해주세요.',
                      callback: () => {
                        history.push('/login')
                      }
                    }))
                  } else {
                    dispatch(setGlobalCtxUpdatePopup({popup: ['APPDOWN', 'appDownAlrt', 2]}));
                  }
                } else {
                  if (webview === 'new') {
                    if (globalState.customHeader['os'] === OS_TYPE['Android'] || globalState.customHeader['os'] === OS_TYPE['IOS']) {
                      //IOS 웹뷰에서 같은 방 진입시
                      if (
                        globalState.customHeader['os'] === OS_TYPE['IOS'] &&
                        Utility.getCookie('listen_room_no') == profile.listenRoomNo
                      ) {
                        return Hybrid('CloseLayerPopup')
                      }
                      let alertMsg
                      if (isNaN(profile.listenRoomNo)) {
                        alertMsg = `${profile.nickNm} 님이 어딘가에서 청취중입니다. 위치 공개를 원치 않아 해당방에 입장할 수 없습니다`
                        dispatch(setGlobalCtxMessage({
                          type: 'alert',
                          msg: alertMsg
                        }))
                      } else {
                        alertMsg = `해당 청취자가 있는 방송으로 입장하시겠습니까?`
                        dispatch(setGlobalCtxMessage({
                          type: 'confirm',
                          msg: alertMsg,
                          callback: () => {
                            return RoomJoin({roomNo: profile.listenRoomNo, listener: 'listener'})
                          }
                        }))
                      }
                    }
                  }

                  if (webview === 'new' && Utility.getCookie('listen_room_no')) {
                    return false
                  }

                  if (
                    webview === 'new' &&
                    Utility.getCookie('clip-player-info') &&
                    globalState.customHeader['os'] === OS_TYPE['IOS']
                  ) {
                    return dispatch(setGlobalCtxMessage({type: "alert",msg: `클립 종료 후 청취 가능합니다.\n다시 시도해주세요.`}))
                  } else {
                    if (
                      webview === 'new' &&
                      Utility.getCookie('listen_room_no') &&
                      globalState.customHeader['os'] === OS_TYPE['IOS']
                    ) {
                      return false
                    } else {
                      let alertMsg
                      if (isNaN(profile.listenRoomNo)) {
                        alertMsg = `${profile.nickNm} 님이 어딘가에서 청취중입니다. 위치 공개를 원치 않아 해당방에 입장할 수 없습니다`
                        dispatch(setGlobalCtxMessage({
                          type: 'alert',
                          msg: alertMsg
                        }))
                      } else {
                        alertMsg = `해당 청취자가 있는 방송으로 입장하시겠습니까?`
                        dispatch(setGlobalCtxMessage({
                          type: 'confirm',
                          msg: alertMsg,
                          callback: () => {
                            return RoomJoin({roomNo: profile.listenRoomNo, listener: 'listener'})
                          }
                        }))
                      }
                    }
                  }
                }
              }}>
              <em className="icon_wrap icon_listen">청취중</em>
            </button>
          )}

          {createMailboxIcon()}
        </div>
        <div className="profile-image">
          <figure
            onClick={() => {
              dispatch(setGlobalCtxMultiViewer({
                show: true,
                list: profile.profImgList.length ? profile.profImgList : [{profImg: profile.profImg}]
              }));
            }}
            style={{backgroundImage: `url(${profile.profImg.thumb292x292})`}}>
            <img src={profile.profImg ? profile.profImg['thumb190x190'] : ''} alt={profile.nickNm} />
            {/* {profile.level > 100 && <div className="profileBg" style={{backgroundImage: `url(${profile.profileBg})`}}></div>} */}
            {profile.level > 50 && <div className="holderBg" style={{backgroundImage: `url(${profile.holderBg})`}}></div>}
            <div className="holder" style={{backgroundImage: `url(${profile.holder})`}}></div>
          </figure>
        </div>
        <div className="title">
          Lv{profile.level} {profile.level !== 0 && `${profile.grade}`}
        </div>
        {urlrStr == 'profile' && (
          <div className="levelInfoWrap">
            <div className="levelBox">
              <div className="levelBar">
                <span
                  className="expBarStatus"
                  style={{
                    right: `${profile && profile.expRate >= 101 ? 0 : Math.abs(exBar)}%`
                  }}></span>
                <span className="expTitle expTitle--start">{profile.expBegin}</span>
                <span className="expTitle expTitle--end">{profile.expNext}</span>
              </div>

              <div className="levelInfo">
                <button className="btn-info" onClick={() => setPopupExp(popup ? false : true)}>
                  <span className="blind">경험치</span>
                </button>
                EXP
                <span className="expTitle">{profile.exp}</span>
                <span className="expTitle expTitle--rate">{profile.expRate}%</span>
              </div>
            </div>
          </div>
        )}
        <div className="nameWrap">
          <strong>
            {profile.nickNm}
            <span className="subIconWrap">
              {profile.gender !== '' && (
                <em className={`icon_wrap ${profile.gender === 'm' ? 'icon_male' : 'icon_female'}`}>
                  <span className="blind">성별</span>
                </em>
              )}
            </span>
          </strong>
        </div>
        {/* 스디 check*/}
        {checkSpecialDj()}
        {/* <ProfileMsg dangerouslySetInnerHTML={{__html: profile.profMsg.split('\n').join('<br />')}}></ProfileMsg> */}
        {profile.memId && <span className="profileMemId">{profile.memId}</span>}
        {profile.profMsg && <div className="profileMsgWrap">{profile.profMsg}</div>}
        {((profile.fanBadgeList && profile.fanBadgeList.length > 0) ||
          (profile.liveBadgeList && profile.liveBadgeList.length > 0)) && (
          <div className="badgeWrap">
            <Swiper {...swiperParams}>{BadgeSlide}</Swiper>
          </div>
        )}
        {profile.fanRank.length > 0 ? (
          <div className="fanListWrap">{createFanList()}</div>
        ) : (
          <div className="fanListWrap">
            <div className="fanRankList">
              <button className="btn__fanRank">팬랭킹</button>
              <div className={`fanItem rank1 defalut`}></div>
              <div className={`fanItem rank2 defalut`}></div>
              <div className={`fanItem rank3 defalut`}></div>
            </div>
          </div>
        )}
        <div className="fanListWrap cupidWrap">
          {myProfileNo === profile.memNo ? (
            <button
              className="btn__fanRank cupid"
              onClick={() => {
                {
                  profile.likeTotCnt > 0 && dispatch(setGlobalCtxCloseRank(true))
                  setRankTabType('tabGood')
                }
              }}>
              CUPID
            </button>
          ) : (
            <button
              className="btn__fanRank cupid"
              onClick={() => {
                profile.likeTotCnt > 0 && dispatch(setGlobalCtxCloseFanRank(true))
                setRankTabType('tabGood')
              }}>
              CUPID
            </button>
          )}
          {profile.likeTotCnt > 0 && profile.cupidMemNo !== '' && profile.cupidNickNm !== '' ? (
            <>
              <img
                src={profile.cupidProfImg.thumb62x62}
                className="fanListWrap__cupidImg"
                onClick={() => {
                  history.push(`/mypage/${profile.cupidMemNo}`)
                }}
              />
              <p
                className="fanListWrap__cupidNick"
                onClick={() => {
                  history.push(`/mypage/${profile.cupidMemNo}`)
                }}>
                {profile.cupidNickNm}
              </p>
            </>
          ) : (
            <div className="fanRankList">
              <div className={`fanItem defalut`}></div>
              <span className="defalutTxt">(좋아요 보낸 회원없음)</span>
            </div>
          )}
        </div>

        <div className="categoryCntWrap">
          {createCountList('fan', profile.fanCnt)}
          {createCountList('star', profile.starCnt)}
          {createCountList('like', profile.likeTotCnt)}
        </div>

        {/* 선물하기 */}
        {showPresent && profile.memNo !== '10000000000000' && (
          <div className="buttonWrap">
            {globalState.customHeader['os'] !== OS_TYPE['IOS'] && (
              <button
                onClick={() => {
                  dispatch(setGlobalCtxClosePresent(true))
                }}
                className="btnGift">
                {/* <span></span> */}
                <em>선물하기</em>
              </button>
            )}
            {profile.isFan === true && (
              <button className="btnFan" onClick={() => Cancel(myProfileNo, profile.nickNm)}>
                팬
              </button>
            )}
            {profile.isFan === false && (
              <button className="btnFan btnFan--isOff" onClick={() => fanRegist(myProfileNo, profile.nickNm)}>
                팬등록
              </button>
            )}
            {profile.isFan === false && (
              <>
                {profile.isReceive === false && (
                  <button className="btnAlarm btnAlarm--isOff">
                    <img src={AlarmOffIcon} alt="알람 off" onClick={callAlarmReceiveConfirm} />
                  </button>
                )}
                {profile.isReceive === true && (
                  <button className="btnAlarm">
                    <img src={AlarmOnIcon} alt="알람 on" onClick={callAlarmCancelConfirm} />
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>
      {globalState.mypageReport === true && <ProfileReport {...props} reportShow={reportShow} />}
      {globalState.userReport.state === true && <UserReport {...props} urlrStr={globalState.userReport.targetMemNo} />}
      {globalState.close === true && <ProfileFanList {...props} reportShow={reportShow} name="팬 랭킹" />}
      {globalState.closeFanCnt === true && <ProfileFanList {...props} reportShow={reportShow} name="팬" />}
      {globalState.closeStarCnt === true && <ProfileFanList {...props} reportShow={reportShow} name="스타" />}
      {globalState.closeGoodCnt === true && <ProfileFanList {...props} reportShow={reportShow} name="좋아요" />}
      {globalState.closeSpeical === true && <ProfileFanList {...props} reportShow={reportShow} name="스디" />}
      {globalState.closePresent === true && <ProfilePresent {...props} reportShow={reportShow} name="선물" />}
      {globalState.closeRank === true && <ProfileRank {...props} type={rankTabType} name="랭킹" />}
      {globalState.closeFanRank === true && <ProfileFanRank {...props} type={rankTabType} name="뉴팬랭킹" />}
      {popupExp && <LayerPopupExp setPopupExp={setPopupExp} />}
    </div>
  )
}
