import React, {useEffect, useState, useContext} from 'react'
import styled from 'styled-components'
import {useHistory} from 'react-router-dom'
import {RoomMake} from 'context/room'
//context
import {Context} from 'context'
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
  //context
  const context = useContext(Context)
  let history = useHistory()

  const navList = [
    {active: true, value: 'broadcast', txt: '방송하기', icon: MicIcon},
    {value: 'live', txt: '라이브', icon: LiveIcon},
    {value: 'rank', txt: '랭킹', icon: RankingIcon},
    {value: 'store', txt: '스토어', icon: StoreIcon},
    //{value: 'event', txt: '이벤트', icon: EventIcon},
    {value: 'customer', txt: '고객센터', icon: CSIcon}
  ]

  return (
    <div>
      <Header>
        <a href="/">
          <img src={Home} />
        </a>
        <a href="/setting">
          <img src={Setting} />
        </a>
      </Header>

      <NavWrap>
        <NavBtnWrapLine>
          {navList.map(list => {
            const {value, txt, active, icon} = list
            return (
              <LayoutWrap key={value}>
                <NavBtnWrap
                  onClick={() => {
                    if (value == 'broadcast') {
                      RoomMake(context)
                    } else {
                      history.push(`/${value}`)
                    }
                  }}>
                  <NavBtn className={active ? 'active' : ''} icon={icon} />
                  <div className="text">{txt}</div>
                </NavBtnWrap>
              </LayoutWrap>
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
  flex-wrap: wrap;

  align-items: center;
  margin: 0 0 40px 0;
`
const LayoutWrap = styled.div`
  flex: 0 0 33.333%;
  margin-top: 40px;
  text-align: center;
`

const NavBtnWrap = styled.div`
  width: 68px;
  margin: 0 auto;
  .text {
    margin-top: 8px;
    color: #424242;
    font-size: 16px;
    font-weight: 600;
    letter-spacing: -0.4px;
    text-align: center;
    transform: skew(-0.3deg);
  }
`

const NavBtn = styled.button`
  display: block;
  width: 68px;
  height: 68px;
  margin: 0 auto;
  border-radius: 26px;
  background-color: #eee;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url(${props => props.icon});

  &.active {
    background-color: #8556f6;
  }
`
