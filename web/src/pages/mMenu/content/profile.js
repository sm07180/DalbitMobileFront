import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import {Link} from 'react-router-dom'

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

export default props => {
  const subNavList = [
    {type: 'setting', txt: '내 정보 관리', icon: InfoIcon},
    {type: 'notice', txt: '공지사항', icon: NoticeIcon},
    {type: 'fanboard', txt: '팬보드', icon: FanboardIcon},
    {type: 'wallet', txt: '내 지갑', icon: WalletIcon},
    {type: 'report', txt: '리포트', icon: ReportIcon},
    {type: 'alarm', txt: '알림', icon: AlarmIcon},
    {type: 'bsetting', txt: '방송설정', icon: SettingIcon}
  ]

  return (
    <MenuMypage>
      <Header>
        <div className="category-text">마이 페이지</div>
      </Header>
      <div className="sub-nav">
        {subNavList.map((value, idx) => {
          const {type, txt, icon} = value
          return (
            <Link to={`/mypage/${type}`} key={`list-${idx}`}>
              <div className="list">
                <span className="text">{txt}</span>
                <img className="icon" src={icon} />
              </div>
            </Link>
          )
        })}
      </div>
    </MenuMypage>
  )
}

const MenuMypage = styled.div`
  .sub-nav {
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
