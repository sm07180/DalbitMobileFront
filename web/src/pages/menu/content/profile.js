import React, {useEffect, useState, useContext} from 'react'
import {Switch, Route, useParams, Redirect, useHistory} from 'react-router-dom'
import {Context} from 'context'
import Api from 'context/api'
import qs from 'query-string'
import {Hybrid, isHybrid} from 'context/hybrid'
import {StoreLink} from 'context/link'
// components
import MyProfile from './myProfile'
// static svg
import TimeIcon from '../static/profile/ic_time_m_p.svg'
import HeadphoneIcon from '../static/profile/ic_headphones_m_p.svg'
import HeartIcon from '../static/profile/ic_headphones_m_p.svg'
import ByeolIcon from '../static/profile/ic_star_m_p.svg'
import ProfileIcon from '../static/menu_profile.svg'
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
export default (props) => {
  let history = useHistory()
  // webview & ctx
  const {webview} = qs.parse(location.search)
  const context = useContext(Context)
  const globalCtx = useContext(Context)
  const {token, profile} = globalCtx

  // nav Array
  // const subNavList = [
  //   {type: 'notice', txt: '방송공지', icon: BroadNoticeIcon},
  //   {type: 'fanboard', txt: '팬보드', icon: BroadFanboardIcon},
  //   {type: 'my_clip', txt: '클립', icon: ClipIcon},
  //   {type: 'bcsetting', txt: '방송설정', icon: BroadNoticeIcon}
  //   // {type: 'editeFan', txt: '팬관리', icon: BroadNoticeIcon}
  // ]
  let subNavList
  if (globalCtx.isDevIp) {
    subNavList = [
      {type: 'notice', txt: '방송공지', icon: BroadNoticeIcon},
      {type: 'fanboard', txt: '팬보드', icon: BroadFanboardIcon},
      {type: 'my_clip', txt: '클립', icon: ClipIcon},
      {type: 'bcsetting', txt: '방송설정', icon: BroadNoticeIcon}
      // {type: 'editeFan', txt: '팬관리', icon: BroadNoticeIcon}
    ]
  } else {
    subNavList = [
      {type: 'notice', txt: '방송공지', icon: BroadNoticeIcon},
      {type: 'fanboard', txt: '팬보드', icon: BroadFanboardIcon},
      {type: 'bcsetting', txt: '방송설정', icon: BroadNoticeIcon}
      // {type: 'editeFan', txt: '팬관리', icon: BroadNoticeIcon}
    ]
  }
  const walletList = [
    {type: 'store', txt: '달 충전', icon: DalIcon},
    {type: 'money_exchange', txt: '환전', icon: ExchangeIcon},
    {type: 'wallet', txt: '내 지갑', icon: WalletIcon},
    {type: 'report', txt: '리포트', icon: ReportIcon}
  ]
  const customerList = [
    {type: 'notice', txt: '공지사항', icon: NoticeIcon},
    // {type: 'faq', txt: '이벤트', icon: EventIcon},
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
        props.history.push('/')
      } else if (logoutInfo.result === 'fail') {
        globalCtx.action.alert({
          title: '로그아웃 실패',
          msg: `${logoutInfo.message}`
        })
      }
      setFetching(false)
    }
    globalCtx.action.confirm({
      callback: () => {
        fetchLogout()
      },
      msg: '로그아웃 하시겠습니까?'
    })
  }
  const checkSelfAuth = async () => {
    let myBirth
    const baseYear = new Date().getFullYear() - 11
    const myInfoRes = await Api.mypage()
    if (myInfoRes.result === 'success') {
      myBirth = myInfoRes.data.birth.slice(0, 4)
    }

    if (myBirth > baseYear) {
      return context.action.alert({
        msg: `12세 미만 미성년자 회원은\n서비스 이용을 제한합니다.`
      })
    }

    async function fetchSelfAuth() {
      const res = await Api.self_auth_check({})
      if (res.result === 'success') {
        const {parentsAgreeYn, adultYn} = res.data
        if (parentsAgreeYn === 'n' && adultYn === 'n') return props.history.push('/selfauth_result')
        props.history.push('/money_exchange')
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
  }, [])
  const locationNav = (type) => {
    context.action.updateFanboardReplyNum(false)
    context.action.updateFanboardReply(false)
    context.action.updateToggleAction(false)
    history.push(type == 'customer' ? `/customer` : `/mypage/${profile.memNo}/${type}`)
  }

  return (
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

            <div className="menu-box">
              <button className="list" onClick={() => history.push(`/private`)}>
                <img className="icon" src={ProfileIcon} alt="프로필 설정" />
                <span className="text">프로필 설정</span>
                <span className="arrow"></span>
              </button>
              <button className="list" onClick={() => history.push(`/mypage/${profile.memNo}/appAlarm2`)}>
                <img className="icon" src={AppSettingIcon} alt="Push 알림 설정" />
                <span className="text">Push 알림 설정</span>
                <span className="arrow"></span>
              </button>
            </div>

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
            <button className="btn__logout" onClick={clickLogoutBtn}>
              로그아웃
            </button>
            {/* <Controller /> */}
          </div>
        </>
      )}
    </div>
  )
}
