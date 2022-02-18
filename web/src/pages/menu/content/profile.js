import React, {useEffect, useState, useContext} from 'react'
import {Switch, Route, useParams, Redirect, useHistory} from 'react-router-dom'
import {Context} from 'context'
import Api from 'context/api'
import qs from 'query-string'
import {Hybrid, isHybrid} from 'context/hybrid'
import {StoreLink} from 'context/link'
// components
import MyProfile from './myProfile'
import {BeforeLogout} from 'common/logout_func'
// static svg
import TimeIcon from '../static/profile/ic_time_m_p.svg'
import HeadphoneIcon from '../static/profile/ic_headphones_m_p.svg'
import HeartIcon from '../static/profile/ic_headphones_m_p.svg'
import ByeolIcon from '../static/profile/ic_star_m_p.svg'
import ProfileIcon from '../static/menu_profile.svg'
import MailboxIcon from '../static/postbox_icon.svg'
import AppSettingIcon from '../static/menu_appsetting.svg'
import BroadNoticeIcon from '../static/menu_broadnotice.svg'
import BroadFanboardIcon from '../static/menu_fanboard.svg'
import DalIcon from '../static/menu_dal.svg'
import ExchangeIcon from '../static/menu_exchange.svg'
import WalletIcon from '../static/menu_wallet.svg'
import ReportIcon from '../static/menu_report.svg'
import NoticeIcon from '../static/menu_notice.svg'
import CustomerIcon from '../static/customer_yellow.svg'
import FaqIcon from '../static/menu_faq.svg'
import InquireIcon from '../static/menu_1on1.svg'
import AppIcon from '../static/menu_appinfo.svg'
import ClipIcon from '../static/menu_cast.svg'

import '../../mypage/index.scss'

import {OS_TYPE} from 'context/config'
//------------------------------------------------------------------------------
const storyIcon = 'https://image.dalbitlive.com/svg/ico_mail_pink.svg'
export default (props) => {
  let history = useHistory()
  // webview & ctx
  const {webview} = qs.parse(location.search)
  const context = useContext(Context)
  const globalCtx = useContext(Context)
  const {token, profile} = globalCtx
  const customHeader = JSON.parse(Api.customHeader)

  if (webview && webview === 'new') {
    sessionStorage.setItem('webview', 'new')
  }
  // nav Array
  // const subNavList = [
  //   {type: 'notice', txt: '방송공지', icon: BroadNoticeIcon},
  //   {type: 'fanboard', txt: '팬보드', icon: BroadFanboardIcon},
  //   {type: 'my_clip', txt: '클립', icon: ClipIcon},
  //   {type: 'bcsetting', txt: '방송설정', icon: BroadNoticeIcon}
  //   // {type: 'editeFan', txt: '팬관리', icon: BroadNoticeIcon}
  // ]
  let subNavList

  if (sessionStorage.getItem('webview') === 'new') {
    subNavList = [
      {type: 'notice', txt: '방송공지', icon: BroadNoticeIcon},
      {type: 'fanboard', txt: '팬보드', icon: BroadFanboardIcon}
    ]
  } else {
    subNavList = [
      {type: 'notice', txt: '방송공지', icon: BroadNoticeIcon},
      {type: 'story', txt: '사연 모아보기', icon: storyIcon},
      {type: 'fanboard', txt: '팬보드', icon: BroadFanboardIcon},
      {type: 'my_clip', txt: '클립', icon: ClipIcon},
      {type: 'bcsetting', txt: '서비스 설정(알림/방송/매니저/차단)', icon: BroadNoticeIcon}
    ]
  }

  const walletList = [
    {type: 'store', txt: '달 충전', icon: DalIcon},
    // {type: 'money_exchange', txt: '환전', icon: ExchangeIcon},
    {type: 'wallet', txt: '내 지갑', icon: WalletIcon},
    {type: 'report', txt: '리포트', icon: ReportIcon}
  ]
  const customerList = [
    {type: 'notice', txt: '공지사항', icon: NoticeIcon},
    // {type: 'event', txt: '이벤트', icon: NoticeIcon},
    {type: 'service', txt: '고객센터', icon: CustomerIcon},
    {type: 'faq', txt: 'FAQ', icon: FaqIcon},
    {type: 'personal', txt: '1:1문의', icon: InquireIcon},
    // {type: 'personal', txt: '서비스 가이드', icon: ServiceIcon},
    {type: 'appInfo', txt: '운영 정책 / 회원 탈퇴', icon: AppIcon}
  ]

  // state
  const [fetching, setFetching] = useState(false)
  const [myPageNew, setMyPageNew] = useState({})
  // timeFormat function
  const timeFormat = (sec_time) => {
    const hour = Math.floor(sec_time / 3600)
    const min = Math.floor((sec_time - hour * 3600) / 60)
    return `${hour}시간 ${min}분`
  }
  // logout function
  const clickLogoutBtn = async () => {
    if (fetching) {
      return
    }
    const fetchLogout = async () => {
      setFetching(true)
      const logoutInfo = await Api.member_logout()
      if (logoutInfo.result === 'success') {
        if (isHybrid()) {
          Hybrid('GetLogoutToken', logoutInfo.data)
        }
        globalCtx.action.updateToken(logoutInfo.data)
        globalCtx.action.updateProfile(null)
        // props.history.push('/')
        window.location.href = '/'
        return
      } else if (logoutInfo.result === 'fail') {
        globalCtx.action.alert({
          title: '로그아웃 실패',
          msg: `${logoutInfo.message}`
        })
        setFetching(false)
      }
    }
    BeforeLogout(globalCtx, fetchLogout)
  }
  const checkSelfAuth = async () => {
    //2020_10_12 환전눌렀을때 본인인증 나이 제한 없이 모두 가능
    let myBirth
    const baseYear = new Date().getFullYear() - 11
    const myInfoRes = await Api.mypage()
    if (myInfoRes.result === 'success') {
      myBirth = myInfoRes.data.birth.slice(0, 4)
    }

    async function fetchSelfAuth() {
      const res = await Api.self_auth_check({})
      if (res.result === 'success') {
        if (res.data.company === '기타') {
          return context.action.alert({
            msg: `휴대폰 본인인증을 받지 않은 경우\n환전이 제한되는 점 양해부탁드립니다`
          })
        }
        const {parentsAgreeYn, adultYn} = res.data
        if (parentsAgreeYn === 'n' && adultYn === 'n') return props.history.push('/selfauth_result')
        if (myBirth > baseYear) {
          return context.action.alert({
            msg: `만 14세 미만 미성년자 회원은\n서비스 이용을 제한합니다.`
          })
        } else {
          props.history.push('/money_exchange')
        }
      } else if (res.result === 'fail' && res.code === '0') {
        props.history.push('/selfauth')
      } else {
        context.action.alert({
          msg: res.message
        })
      }
    }
    fetchSelfAuth()
    // history.push('/money_exchange')
  }

  //WEBVIEW CHECK
  if (profile.memNo === token.memNo && webview && webview === 'new') {
    history.push(`/profile/${profile.memNo}?webview=new`)
  }

  useEffect(() => {
    const getMyPageNew = async () => {
      if (profile !== null) {
        const res = await Api.getMyPageNew(profile.memNo)
        setMyPageNew(res.data)
      } else {
        props.history.push('/')
      }
    }
    getMyPageNew()
    const {memNo} = token
    Api.profile({params: {memNo: memNo}}).then((profileInfo) => {
      if (profileInfo.result === 'success') {
        globalCtx.action.updateProfile(profileInfo.data)
      }
    })

    return () => {}
  }, [])
  const locationNav = (type) => {
    context.action.updateFanboardReplyNum(false)
    context.action.updateFanboardReply(false)
    context.action.updateToggleAction(false)
    if (webview && webview === 'new') {
      if (type === 'story') {
        history.push(`/${type}?webview=new`)
      } else {
        history.push(type == 'customer' ? `/customer` : `/profile/${profile.memNo}?webview=new`)
      }
    } else {
      if (type === 'story') {
        history.push(`/${type}`)
      } else {
        history.push(type == 'customer' ? `/customer` : `/profile/${profile.memNo}`)
      }
    }
  }

  const createMailboxMenu = () => {
    let settingClassName = 'arrow'
    if (context.isMailboxNew && context.token.isLogin) {
      settingClassName = 'arrow arrow--active'
    }

    if (context.useMailbox) {
      if (
        __NODE_ENV === 'dev' ||
        customHeader.os === OS_TYPE['Desktop'] ||
        (customHeader.os === OS_TYPE['Android'] && customHeader.appBuild >= 51) ||
        (customHeader.os === OS_TYPE['IOS'] && customHeader.appBuild >= 273)
      ) {
        return (
          <button
            className="list"
            onClick={async () => {
              if (!context.myInfo.level) {
                const myProfile = await Api.profile({ params: { memNo: token.memNo } })
                if(myProfile.data.level === 0) {
                  return globalCtx.action.alert({
                    msg: '메시지는 1레벨부터 이용 가능합니다. \n 레벨업 후 이용해주세요.'
                  })
                }
              }

              if (isHybrid()) {
                Hybrid('OpenMailBoxList')
              } else {
                context.action.updatePopup('APPDOWN', 'appDownAlrt', 5)
              }
            }}>
            <img className="icon" src={MailboxIcon} alt="메시지" />
            <span className="text">메시지</span>
            <span className={settingClassName}></span>
          </button>
        )
      }
    }
  }

  useEffect(() => {
    const isMailboxNewCheck = async () => {
      const {result, data, message} = await Api.checkIsMailboxNew()
      if (result === 'success') {
        globalCtx.action.updateIsMailboxNew(data.isNew)
      } else {
        globalCtx.action.alert({
          msg: message
        })
      }
    }
    if (context.token.isLogin) isMailboxNewCheck()
  }, [])

  return (
    <>
      <div id="mypage">
        {profile !== null && token && token.isLogin && (
          <>
            <MyProfile profile={profile} {...props} webview={webview} />

            <div className="profile-menu">
              <div className="menu-box">
                {walletList.map((value, idx) => {
                  const {type, txt, icon} = value
                  if (type === 'money_exchange' && context.customHeader['os'] === OS_TYPE['IOS']) {
                    return <></>
                  } else {
                    return (
                      <button
                        className="list"
                        key={`list-${idx}`}
                        onClick={(e) => {
                          if (type === 'wallet' || type === 'report') {
                            history.push(`/mypage/${profile.memNo}/${type}`)
                          } else if (type === 'store') {
                            e.preventDefault()
                            StoreLink(globalCtx, props.history)
                          } else if (type === 'money_exchange') {
                            e.preventDefault()
                            checkSelfAuth()
                          }
                        }}>
                        <img className="icon" src={icon} alt={txt} />
                        <span className="text">{txt}</span>
                        {type === 'store' ? (
                          <span className="price">{profile.dalCnt.toLocaleString()}</span>
                        ) : type === 'money_exchange' ? (
                          <span className="price">{profile.byeolCnt.toLocaleString()}</span>
                        ) : (
                          <></>
                        )}
                        <span
                          className={
                            type === 'wallet' ? (myPageNew.dal || myPageNew.byeol ? 'arrow arrow--active' : 'arrow') : 'arrow'
                          }></span>
                      </button>
                    )
                  }
                })}
              </div>

              <div className="menu-box">
                {subNavList.map((value, idx) => {
                  const {type, txt, icon} = value
                  return (
                    <button className="list" onClick={() => locationNav(type)} key={`list-${idx}`}>
                      <img className="icon" src={icon} alt={txt} />
                      <span className="text">{txt}</span>
                      <span
                        className={
                          type === 'notice'
                            ? myPageNew.broadNotice
                              ? 'arrow arrow--active'
                              : 'arrow'
                            : type === 'fanboard'
                            ? myPageNew.fanBoard
                              ? 'arrow arrow--active'
                              : 'arrow'
                            : 'arrow'
                        }></span>
                    </button>
                  )
                })}
              </div>
              {sessionStorage.getItem('webview') === 'new' || (webview && webview === 'new') ? (
                <></>
              ) : (
                <div className="menu-box">
                  <button className="list" onClick={() => history.push(`/private`)}>
                    <img className="icon" src={ProfileIcon} alt="프로필 수정" />
                    <span className="text">프로필 수정</span>
                    <span className="arrow"></span>
                  </button>
                  {createMailboxMenu()}
                  {/* <button className="list" onClick={() => history.push(`/mypage/${profile.memNo}/appAlarm2`)}>
                    <img className="icon" src={AppSettingIcon} alt="Push 알림 설정" />
                    <span className="text">Push 알림 설정</span>
                    <span className="arrow"></span>
                  </button> */}
                </div>
              )}

              {sessionStorage.getItem('webview') === 'new' ? (
                <></>
              ) : (
                <div className="menu-box">
                  {customerList.map((value, idx) => {
                    const {type, txt, icon} = value
                    return (
                      <button
                        className="list"
                        onClick={() => history.push(`${type === 'service' ? `/${type}` : `/customer/${type}`}`)}
                        key={`list-${idx}`}>
                        <img className="icon" src={icon} alt={txt} />
                        <span className="text">{txt}</span>
                        <span
                          className={
                            type === 'notice'
                              ? myPageNew.notice
                                ? 'arrow arrow--active'
                                : 'arrow'
                              : type === 'personal'
                              ? myPageNew.qna
                                ? 'arrow arrow--active'
                                : 'arrow'
                              : 'arrow'
                          }></span>
                      </button>
                    )
                  })}
                </div>
              )}

              <button className="btn__logout" onClick={clickLogoutBtn}>
                로그아웃
              </button>
              {/* <Controller /> */}
            </div>
          </>
        )}
      </div>
    </>
  )
}
