import React, {useEffect, useState} from 'react'
import styled from 'styled-components'

// component
import Header from '../component/header.js'

// static
import Home from '../static/ic_home.svg'
import Setting from '../static/ic_setting.svg'
import MicIcon from '../static/nav/ic_mike_l_w.svg'
import LiveIcon from '../static/nav/ic_live_l_p.svg'
import RankingIcon from '../static/nav/ic_rank_l_p.svg'
import StoreIcon from '../static/nav/ic_store_l_p.svg'
import EventIcon from '../static/nav/ic_event_l_p.svg'
import CSIcon from '../static/nav/ic_cs_l_p.svg'

export default props => {
  const navList = [
    {active: true, value: 'broadcast', txt: '방송하기', icon: MicIcon},
    {value: 'mlive', txt: '라이브', icon: LiveIcon},
    {value: 'ranking', txt: '랭킹', icon: RankingIcon},
    {value: 'store', txt: '스토어', icon: StoreIcon},
    {value: 'event', txt: '이벤트', icon: EventIcon},
    {value: 'customer', txt: '고객센터', icon: CSIcon}
  ]

  return (
    <div>
      <Header>
        <img src={Home} />
        <img src={Setting} />
      </Header>

      <NavWrap>
        <NavBtnWrapLine>
          {navList.slice(0, 3).map(list => {
            const {value, txt, active, icon} = list
            return (
              <NavBtnWrap key={value}>
                <NavBtn className={active ? 'active' : ''} icon={icon} />
                <div className="text">{txt}</div>
              </NavBtnWrap>
            )
          })}
        </NavBtnWrapLine>

        <NavBtnWrapLine>
          {navList.slice(3).map(list => {
            const {value, txt, icon} = list
            return (
              <NavBtnWrap key={value}>
                <NavBtn className="btn" icon={icon} />
                <div className="text">{txt}</div>
              </NavBtnWrap>
            )
          })}
        </NavBtnWrapLine>
      </NavWrap>
    </div>
  )
}

const NavWrap = styled.div`
  padding: 20px 0;
`

const NavBtnWrapLine = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 40px 0;
`

const NavBtnWrap = styled.div`
  .text {
    margin-top: 8px;
    color: #424242;
    font-size: 16px;
    letter-spacing: -0.4px;
    text-align: center;
  }
`

const NavBtn = styled.button`
  display: block;
  width: 68px;
  height: 68px;
  border-radius: 26px;
  background-color: #eee;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url(${props => props.icon});

  &.active {
    background-color: #8556f6;
  }
`
