import React, {useEffect, useState, useContext} from 'react'
import styled from 'styled-components'
import {Switch, Route, useParams, Redirect, useLocation} from 'react-router-dom'
import {Context} from 'context'
import Api from 'context/api'
import qs from 'query-string'
import {Hybrid, isHybrid} from 'context/hybrid'
// component
import Header from '../component/header2.js.js'
import Controller from 'components/ui/remoteController'
import MyProfile2 from './myProfile2'
// static
import InfoIcon from '../static/profile/ic_info_m.svg'

import FanboardIcon from '../static/profile/ic_fanboard_m.svg'

import AlarmIcon from '../static/profile/ic_alarm_m.svg'
import TimeIcon from '../static/profile/ic_time_m_p.svg'
import HeadphoneIcon from '../static/profile/ic_headphones_m_p.svg'
import HeartIcon from '../static/profile/ic_headphones_m_p.svg'
import ByeolIcon from '../static/profile/ic_star_m_p.svg'

import FaqIcon2 from '../static/ic_faq_b.svg'
import QuireIcon from '../static/ic_inquiry_b.svg'

//
import ProfileIcon from '../static/menu_profile.svg'
import AppSettingIcon from '../static/menu_appsetting.svg'
import BroadNoticeIcon from '../static/menu_broadnotice.svg'
import BroadFanboardIcon from '../static/menu_fanboard.svg'
import BroadSettingIcon from '../static/menu_broadsetting.svg'
import DalIcon from '../static/menu_dal.svg'
import ExchangeIcon from '../static/menu_exchange.svg'
import WalletIcon from '../static/menu_wallet.svg'
import ReportIcon from '../static/menu_report.svg'
import NoticeIcon from '../static/menu_notice.svg'
import EventIcon from '../static/menu_event.svg'
import FaqIcon from '../static/menu_faq.svg'
import InquireIcon from '../static/menu_1on1.svg'
import ServiceIcon from '../static/menu_guide.svg'
import AppIcon from '../static/menu_appinfo.svg'
import Arrow from '../static/arrow.svg'

//render-------------------------------------------------------------------
export default props => {
  // nav Array
  const subNavList = [
    {type: 'notice', txt: '방송공지', icon: BroadNoticeIcon},
    {type: 'fanboard', txt: '팬보드', icon: BroadFanboardIcon},
    {type: 'bcsetting', txt: '방송설정', icon: BroadNoticeIcon}
  ]
  const walletList = [
    {type: 'wallet', txt: '달 충전', icon: DalIcon},
    {type: 'wallet', txt: '환전', icon: ExchangeIcon},
    {type: 'wallet', txt: '내 지갑', icon: WalletIcon},
    {type: 'report', txt: '리포트', icon: ReportIcon}
  ]
  const customerList = [
    {type: 'noice', txt: '공지사항', icon: NoticeIcon},
    // {type: 'faq', txt: '이벤트', icon: EventIcon},
    {type: 'faq', txt: 'FAQ', icon: FaqIcon},
    {type: 'personal', txt: '1:1문의', icon: InquireIcon}
    // {type: 'personal', txt: '서비스 가이드', icon: ServiceIcon},
    // {type: 'personal', txt: '앱정보', icon: AppIcon}
  ]
  const {webview} = qs.parse(location.search)
  const context = useContext(Context)
  const globalCtx = useContext(Context)
  const {token, profile} = globalCtx
  // state
  const [fetching, setFetching] = useState(false)
  // timeFormat function
  const timeFormat = sec_time => {
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
        globalCtx.action.updateProfile(null)
        props.history.push('/')
        return globalCtx.action.updateToken(logoutInfo.data)
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
  // close layer function
  const clickCloseBtn = () => {
    if (isHybrid()) {
      Hybrid('CloseLayerPopup')
    }
  }
  return (
    <MenuMypage>
      {/* <Header>
        <div className="category-text">마이 페이지</div>
        {token && token.isLogin && (
          <a href="/setting">
            <img src={Setting} />
          </a>
        )}
      </Header> */}
      {token && token.isLogin && (
        <>
          <div className="log-in">
            <MyProfile2 profile={profile} {...props} webview={webview} />
            <div className="profile-info">
              <div className="time-info">
                <div className="total-time">
                  <div className="type-wrap">
                    <span className="text">총 방송 시간</span>
                    <img src={TimeIcon} />
                  </div>
                  <div className="time">{timeFormat(profile.broadTotTime)}</div>
                </div>
                <div className="total-time">
                  <div className="type-wrap">
                    <span className="text">총 청취 시간</span>
                    <img src={HeadphoneIcon} />
                  </div>
                  <div className="time">{timeFormat(profile.listenTotTime)}</div>
                </div>
              </div>
              <div className="real-info">
                {[
                  {type: 'heart', icon: HeartIcon, txt: '좋아요', value: profile.likeTotCnt.toLocaleString()},
                  {type: 'byeol', icon: ByeolIcon, txt: '보유별', value: profile.byeolCnt.toLocaleString()},
                  {type: 'dal', icon: DalIcon, txt: '보유달', value: profile.dalCnt.toLocaleString()}
                ].map(real => {
                  const {type, icon, txt, value} = real
                  return (
                    <div key={type} className="each">
                      <span className="type">{txt}</span>
                      <img src={icon} />
                      <span className="value">{value}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
          <div className="sub-nav">
            <a href={`/private`}>
              <div className="list">
                <img className="icon" src={ProfileIcon} />
                <span className="text">프로필 설정</span>
                <span className="arrow"></span>
              </div>
            </a>
            <a href={`/mypage/${profile.memNo}/appAlarm2`}>
              <div className="list mb12">
                <img className="icon" src={AppSettingIcon} />
                <span className="text">앱 설정</span>
                <span className="arrow"></span>
              </div>
            </a>
            {subNavList.map((value, idx) => {
              const {type, txt, icon} = value
              return (
                <a href={type == 'customer' ? `/customer` : `/mypage/${profile.memNo}/${type}`} key={`list-${idx}`}>
                  <div className="list">
                    <img className="icon" src={icon} />
                    <span className="text">{txt}</span>
                    <span className="arrow"></span>
                  </div>
                </a>
              )
            })}
            <div className="addCustomer">
              {walletList.map((value, idx) => {
                const {type, txt, icon} = value
                return (
                  <a href={`/mypage/${profile.memNo}/${type}`} key={`list-${idx}`}>
                    <div className="list">
                      <img className="icon" src={icon} />
                      <span className="text">{txt}</span>
                      <span className="arrow"></span>
                    </div>
                  </a>
                )
              })}
            </div>
            <div className="addCustomer">
              {customerList.map((value, idx) => {
                const {type, txt, icon} = value
                return (
                  <a href={`/customer/${type}`} key={`list-${idx}`}>
                    <div className="list">
                      <img className="icon" src={icon} />
                      <span className="text">{txt}</span>
                      <span className="arrow"></span>
                    </div>
                  </a>
                )
              })}
            </div>
            <LogoutBtn onClick={clickLogoutBtn}>로그아웃</LogoutBtn>
            {/* <Controller /> */}
          </div>
        </>
      )}
    </MenuMypage>
  )
}
//style------------------------------------------------------------------
const LogoutBtn = styled.button`
  display: block;
  background-color: #fff;
  padding: 16px 0;
  width: 100%;
  color: #9e9e9e;
  font-size: 14px;
  margin-top: 24px;
`
const MenuMypage = styled.div`
  min-height: 100vh;
  .log-in {
    position: relative;
    .main-info {
      text-align: center;
      .photo {
        width: 100px;
        height: 100px;
        margin: 0 auto;
        border-radius: 50%;
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
      }
      .nickname {
        margin-top: 10px;
        font-size: 20px;
        color: #000;
        letter-spacing: -0.5px;
        font-weight: 600;
      }
      .mem-id {
        margin-top: 8px;
        margin-bottom: 24px;
        color: #757575;
        font-size: 12px;
      }
    }
    .profile-info {
      display: none;
      border: 1px solid #632beb;
      border-radius: 20px;
      transform: skew(-0.03deg);
      .time-info {
        padding: 12px 22px;
        .total-time {
          display: flex;
          align-items: center;
          justify-content: space-between;
          .type-wrap {
            display: flex;
            flex-direction: row;
            align-items: center;
            .text {
              color: #632beb;
              font-size: 14px;
              letter-spacing: -0.35px;
              font-weight: bold;
            }
            img {
              display: block;
              width: 24px;
              margin-left: 10px;
            }
          }
          .time {
            color: #424242;
            font-size: 14px;
            letter-spacing: -0.35px;
            font-weight: 800;
          }
        }
      }
      .real-info {
        display: flex;
        flex-direction: row;
        border-top: 1px solid #eee;
        transform: skew(-0.03deg);
        .each {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 33.3334%;
          height: 95px;
          box-sizing: border-box;
          &:first-child {
            border-right: 1px solid #eee;
          }
          &:last-child {
            border-left: 1px solid #eee;
          }
          .type {
            color: #632beb;
            font-size: 14px;
            letter-spacing: -0.35px;
            font-weight: 600;
          }
          img {
            display: block;
            margin: 4px 0;
          }
          .value {
            color: #424242;
            font-size: 14px;
            letter-spacing: -0.35px;
            font-weight: 600;
          }
        }
      }
    }
  }

  .log-out {
    padding-top: 30px;
    box-sizing: border-box;

    img {
      display: block;
      margin: 0 auto;
      width: 100px;
    }
    .text {
      margin-top: 10px;
      color: #424242;
      font-size: 20px;
      text-align: center;
      letter-spacing: -0.8px;
      .bold {
        color: #632beb;
        font-weight: 800;
      }
    }
    .loginBtn {
      display: block;
      width: 288px;
      height: 50px;
      margin: 16px auto;
      background: #632beb;
      font-size: 18px;
      font-weight: 600;
      color: #fff;
      border-radius: 10px;
      transform: skew(-0.03deg);
    }
  }
  .addCustomer {
    margin-top: 16px;
  }
  .sub-nav {
    padding-bottom: 20px;
    transform: skew(-0.03deg);
    a {
      display: block;

      .list {
        position: relative;
        display: flex;
        flex-direction: row;
        align-items: center;
        height: 48px;
        background-color: #fff;
        box-sizing: border-box;
        padding: 0 16px 0 16px;
        margin: 1px 0 1px 0;
        .arrow {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          width: 24px;
          height: 24px;
          background: url(${Arrow}) no-repeat center center / cover;
        }
        .text {
          color: #000000;
          font-size: 14px;
          letter-spacing: -0.35px;
          font-weight: 600;
        }
        .icon {
          display: block;
          width: 32px;
          margin-right: 12px;
        }
      }
      .mb12 {
        margin-bottom: 12px !important;
      }
      :first-child {
        margin: 0px 0 1px 0;
      }
    }
  }
`
