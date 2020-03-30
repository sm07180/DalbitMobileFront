import React, {useState, useEffect} from 'react'
import styled from 'styled-components'

// static image
import Logo from './static/logo@2x.png'
import Search from './static/ic_search.svg'
import Alarm from './static/ic_alarm.svg'
import My from './static/ic_my.svg'
import Menu from './static/ic_menu.svg'

export default props => {
  return (
    <GnbWrap>
      <div className="icon-wrap">
        <img className="icon" src={Search} />
        <img className="icon" src={Alarm} />
      </div>
      <img className="logo" src={Logo} />
      <div className="icon-wrap">
        <img className="icon" src={My} />
        <img className="icon" src={Menu} />
      </div>
    </GnbWrap>
  )
}

const GnbWrap = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 48px;
  background-color: #fff;

  .icon-wrap {
    display: flex;
    flex-direction: row;

    .icon {
      display: block;
    }
  }

  .logo {
    display: block;
    width: 110px;
  }
`
