import React, {useEffect, useState, useContext} from 'react'
import styled from 'styled-components'

import {Context} from 'context'
import {RoomMake} from 'context/room'

// static image
//import Logo from './static/logo@2x.png'
import Logo from './static/logo_real.png'
import Search from './static/ic_search.svg'
import Alarm from './static/ic_alarm.svg'
import My from './static/ic_my.svg'
import Menu from './static/ic_menu.svg'
import Mic from './static/ic_broadcastng.svg'
import {OS_TYPE} from 'context/config.js'
import Api from 'context/api'

export default props => {
  //context
  const context = useContext(Context)
  const {webview} = props
  const customHeader = JSON.parse(Api.customHeader)

  if (webview && webview === 'new') {
    return null
  }

  const globalCtx = useContext(Context)
  const {logoChange, token} = globalCtx

  // static
  const [broadcastBtnActive, setBroadcastBtnActive] = useState(false)

  const reLoad = () => {
    window.location.href = '/'
  }
  const moveToMenu = category => {
    return (window.location.href = `/menu/${category}`)
  }
  const moveToLogin = category => {
    if (!token.isLogin) {
      return (window.location.href = '/login')
    }
    if (category === 'alarm') {
      context.action.updateNews(false)
    }
    return (window.location.href = `/menu/${category}`)
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
    <>
      <HiddenBg />
      <GnbWrap>
        <div className="icon-wrap">
          <img className="icon" src={Search} onClick={() => moveToMenu('search')} />
          <img className="icon" src={Alarm} onClick={() => moveToLogin('alarm')} />

          {context.news && <span className="news">&nbsp;</span>}
          {/* <span className="icon" style={{display: 'inline-block', width: '36px', height: '36px'}} /> */}
        </div>
        {logoChange ? (
          <MicWrap>
            <div
              className="mic-btn"
              onClick={() => {
                if (customHeader['os'] === OS_TYPE['Desktop']) {
                  window.location.href = 'https://inforexseoul.page.link/Ws4t'
                } else {
                  if (!broadcastBtnActive) {
                    RoomMake(globalCtx)
                    setBroadcastBtnActive(true)
                    setTimeout(() => setBroadcastBtnActive(false), 3000)
                  }
                }
              }}>
              <img src={Mic} />
            </div>
          </MicWrap>
        ) : (
          <img className="logo" src={Logo} onClick={reLoad} />
        )}
        <div className="icon-wrap">
          <img className="icon" src={My} onClick={() => moveToLogin('profile')} style={{marginLeft: '36px'}} />
          {/* <img className="icon" src={Menu} onClick={() => moveToMenu('nav')} /> */}
        </div>
      </GnbWrap>
    </>
  )
}

const HiddenBg = styled.div`
  position: fixed;
  top: -10px;
  left: 0;
  width: 100%;
  height: 20px;
  background-color: #fff;
`

const GnbWrap = styled.div`
  position: relative;
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
  padding: 0 6px;

  .icon-wrap {
    position: relative;
    display: flex;
    flex-direction: row;

    .icon {
      position: relative;
      display: block;
      width: 36px;
    }
    .news {
      position: absolute;
      top: 5px;
      right: 5px;
      width: 5px;
      height: 5px;
      background: #ff0000;
      z-index: 11;
      border-radius: 50%;
      content: '1';
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
    width: 80px;
    height: 50px;

    border-radius: 27px;
    background: linear-gradient(#632beb, #4c13d5);
  }
`
const MicWrap = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 54px;
  width: 86px;
  top: 4px;
  left: 50%;
  border-radius: 27px;
  z-index: 50;
  transform: translateX(-50%);
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.16);
  background-color: #ffffff;
`
