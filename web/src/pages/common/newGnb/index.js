import React, {useState, useEffect, useContext} from 'react'
import styled from 'styled-components'

import {Context} from 'context'
import {Hybrid} from 'context/hybrid'
// static image
//import Logo from './static/logo@2x.png'
import Logo from './static/logo_beta.png'
import Search from './static/ic_search.svg'
import Alarm from './static/ic_alarm.svg'
import My from './static/ic_my.svg'
import Menu from './static/ic_menu.svg'
import Mic from './static/ic_mike_w.svg'

export default props => {
  const globalCtx = useContext(Context)
  const {token} = globalCtx
  const {logoChange} = globalCtx

  const reLoad = () => {
    window.location.href = '/new'
  }
  const moveToMenu = category => {
    window.location.href = `/menu/${category}`
  }
  const scrollEvent = () => {
    const gnbHeight = 48

    if (!logoChange && window.scrollY >= gnbHeight) {
      globalCtx.action.updateLogoChange(true)
    } else if (logoChange && window.scrollY < gnbHeight) {
      globalCtx.action.updateLogoChange(false)
    }
  }

  useEffect(() => {
    window.removeEventListener('scroll', scrollEvent)
    window.addEventListener('scroll', scrollEvent)
    return () => {
      window.removeEventListener('scroll', scrollEvent)
    }
  }, [logoChange])

  return (
    <GnbWrap>
      <div className="icon-wrap">
        {/* <img className="icon" src={Search} onClick={() => moveToMenu('search')} /> */}
        <img className="icon" src={Alarm} onClick={() => moveToMenu('alarm')} />
      </div>
      {logoChange ? (
        <div
          className="mic-btn"
          onClick={() => {
            if (token.isLogin) {
              return Hybrid('RoomMake', '')
            }
            return (window.location.href = '/mlogin')
          }}>
          <img src={Mic} />
        </div>
      ) : (
        <img className="logo" src={Logo} onClick={reLoad} />
      )}
      <div className="icon-wrap">
        <img className="icon" src={My} onClick={() => moveToMenu('profile')} />
        <img className="icon" src={Menu} onClick={() => moveToMenu('nav')} />
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
  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.1);
  z-index: 20;

  .icon-wrap {
    display: flex;
    flex-direction: row;

    .icon {
      display: block;
      width: 36px;
    }
  }

  .logo {
    display: block;
    width: 110px;
  }

  .mic-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 82px;
    height: 40px;
    border-radius: 21px;
    background-color: #8556f6;
  }
`
