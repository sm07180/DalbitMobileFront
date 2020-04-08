import React, {useEffect, useState, useContext} from 'react'
import styled from 'styled-components'
import {Link} from 'react-router-dom'

import {Context} from 'context'

// component
import Header from '../component/header.js'

// static
import InfoIcon from '../static/profile/ic_info_m.svg'
import NoticeIcon from '../static/profile/ic_notice_m.svg'
import FanboardIcon from '../static/profile/ic_fanboard_m.svg'
import WalletIcon from '../static/profile/ic_wallet_m.svg'
import ReportIcon from '../static/profile/ic_report_m.svg'
import AlarmIcon from '../static/profile/ic_alarm_m.svg'
import SettingIcon from '../static/profile/ic_broadcastingsetting_m.svg'

import TimeIcon from '../static/profile/ic_time_m_p.svg'
import HeadphoneIcon from '../static/profile/ic_headphones_m_p.svg'
import HeartIcon from '../static/profile/ic_headphones_m_p.svg'
import ByeolIcon from '../static/profile/ic_star_m_p.svg'
import DalIcon from '../static/profile/ic_moon_m_p.svg'

import NeedLoginImg from '../static/profile/need_login.png'

import Api from 'context/api'
import {Hybrid} from 'context/hybrid'
import Utility from 'components/lib/utility'

export default props => {
  const subNavList = [
    {type: 'notice', txt: '공지사항', icon: NoticeIcon},
    {type: 'fanboard', txt: '팬보드', icon: FanboardIcon},
    {type: 'wallet', txt: '내 지갑', icon: WalletIcon},
    {type: 'report', txt: '리포트', icon: ReportIcon},
    {type: 'alert', txt: '알림', icon: AlarmIcon},
    {type: 'bcsetting', txt: '방송설정', icon: SettingIcon}
  ]

  const timeFormat = sec_time => {
    const hour = Math.floor(sec_time / 3600)
    const min = Math.floor((sec_time - hour * 3600) / 60)
    return `${hour}시간 ${min}분`
  }

  const globalCtx = useContext(Context)
  const {profile} = globalCtx
  const {token} = globalCtx

  const [fetching, setFetching] = useState(false)

  const clickLogoutBtn = async () => {
    if (fetching) {
      return
    }

    const fetchLogout = async () => {
      setFetching(true)
      const logoutInfo = await Api.member_logout()
      if (logoutInfo.result === 'success') {
        const {data} = logoutInfo
        Hybrid('GetLogoutToken', data)
        globalCtx.action.updateToken(null)
        globalCtx.action.updateProfile(null)
        props.history.push('/')
        return (window.location.href = '/')
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

  return (
    <MenuMypage>
      <Header>
        <div className="category-text">마이 페이지</div>
      </Header>

      {token && token.isLogin && profile ? (
        <>
          <div className="log-in">
            <div className="main-info">
              <div
                className="photo"
                style={profile['profImg'] ? {backgroundImage: `url(${profile['profImg']['thumb190x190']})`} : {}}></div>
              <div className="nickname">{profile.nickNm}</div>
              <div className="mem-id">{profile.memId}</div>
            </div>
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
                <span className="text">내 정보 관리</span>
                <img className="icon" src={InfoIcon} />
              </div>
            </a>
            {subNavList.map((value, idx) => {
              const {type, txt, icon} = value
              return (
                <a href={`/mypage/${profile.memNo}/${type}`} key={`list-${idx}`}>
                  <div className="list">
                    <span className="text">{txt}</span>
                    <img className="icon" src={icon} />
                  </div>
                </a>
              )
            })}

            <LogoutBtn onClick={clickLogoutBtn}>로그아웃</LogoutBtn>
          </div>
        </>
      ) : (
        <div className="log-out">
          <a href="/login">
            <img src={NeedLoginImg} />
            <div className="text">
              <span className="bold">로그인</span> 해주세요
            </div>

            <button className="loginBtn">로그인</button>
          </a>
          {__NODE_ENV === 'dev' && (
            <div>
              <div>custom-header</div>
              <div style={{wordBreak: 'break-word'}}>{Utility.getCookie('custom-header')}</div>

              <div style={{height: '1px', backgroundColor: 'blue', margin: '10px 0'}}></div>

              <div>authToken</div>
              <div style={{wordBreak: 'break-word'}}>{Utility.getCookie('authToken')}</div>

              <div style={{height: '1px', backgroundColor: 'blue', margin: '10px 0'}}></div>

              <div>from server</div>
              <div style={{wordBreak: 'break-word'}}>{JSON.stringify(token)}</div>
            </div>
          )}
        </div>
      )}
    </MenuMypage>
  )
}

const LogoutBtn = styled.button`
  display: block;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  padding: 13px 0;
  width: 100%;
  color: #bdbdbd;
  font-size: 12px;
  margin-top: 20px;
`

const MenuMypage = styled.div`
  min-height: 100vh;

  .log-in {
    margin-top: 30px;
    margin-bottom: 20px;

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
      border: 1px solid #8556f6;
      border-radius: 20px;

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
              color: #8556f6;
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
            font-weight: bold;
          }
        }
      }
      .real-info {
        display: flex;
        flex-direction: row;
        border-top: 1px solid #eee;

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
            color: #8556f6;
            font-size: 14px;
            letter-spacing: -0.35px;
          }
          img {
            display: block;
          }
          .value {
            color: #424242;
            font-size: 14px;
            letter-spacing: -0.35px;
            font-weight: bold;
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

      .bold {
        color: #8556f6;
        font-weight: 800;
      }
    }

    .loginBtn {
      display: block;
      width: 120px;
      height: 40px;
      margin: 30px auto;
      border: 2px solid #8556f6;
      color: #424242;
      border-radius: 10px;
      transform: skew(-0.03deg);
    }
  }

  .sub-nav {
    padding-bottom: 20px;

    a {
      display: block;

      .list {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        height: 40px;
        border-radius: 20px;
        border: 1px solid #eee;
        box-sizing: border-box;
        padding: 0 18px;
        margin: 4px 0;

        .text {
          color: #424242;
          font-size: 14px;
          letter-spacing: -0.35px;
        }
        .icon {
          display: block;
          width: 24px;
        }
      }
    }
  }
`
