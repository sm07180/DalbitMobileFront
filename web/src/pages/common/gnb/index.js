import React, {useEffect, useState, useContext} from 'react'
import {useHistory} from 'react-router-dom'
import styled from 'styled-components'
import Lottie from 'react-lottie'

import {Context} from 'context'
import {RoomMake} from 'context/room'

// static image
//import Logo from './static/logo@2x.png'
import Logo from './static/logo_w_no_symbol.svg'
import Search from './static/search_w.svg'
import Alarm from './static/alarm_w.svg'
import My from './static/ic_my.svg'
import Menu from './static/ic_menu.svg'
import Mic from './static/ic_broadcastng_p.svg'
import {OS_TYPE} from 'context/config.js'
import Api from 'context/api'
// style
import 'styles/main.scss'

let alarmCheckIntervalId = null

export default (props) => {
  //context
  const context = useContext(Context)
  const {webview} = props
  const customHeader = JSON.parse(Api.customHeader)
  const history = useHistory()

  if (webview && webview === 'new') {
    return null
  }

  const globalCtx = useContext(Context)
  const {logoChange, token} = globalCtx

  // static
  const [broadcastBtnActive, setBroadcastBtnActive] = useState(false)
  const [newAlarm, setNewAlarm] = useState(false)

  const reLoad = () => {
    window.location.href = '/'
  }
  const moveToMenu = (category) => {
    return history.push(`/menu/${category}`)
  }
  const moveToLogin = (category) => {
    if (!token.isLogin) {
      return history.push('/login')
    }
    if (category === 'alarm') {
      context.action.updateNews(false)
    }
    return history.push(`/menu/${category}`)
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

  useEffect(() => {
    async function alarmCheck() {
      if (!newAlarm) {
        const {result, data} = await Api.mypage_alarm_check()
        if (result === 'success') {
          const {newCnt} = data
          if (newCnt > 0) {
            setNewAlarm(true)
          }
        }
      }
    }

    alarmCheck()
    alarmCheckIntervalId = setInterval(alarmCheck, 5000)

    return () => {
      if (alarmCheckIntervalId) {
        clearInterval(alarmCheckIntervalId)
      }
    }
  }, [])

  return (
    <>
      <div className="hiddenBg"></div>
      <div className="gnbWrap">
        <div className="icon-wrap">
          <button onClick={() => moveToMenu('search')}>
            <img className="icon" src={Search} alt="검색버튼" />
          </button>
        </div>
        {logoChange ? (
          <div className="micWrap">
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
          </div>
        ) : (
          <h1 className="gnb-logo" onClick={reLoad}>
            <img src={Logo} alt="달빛라이브" />
          </h1>
        )}
        <div className="icon-wrap">
          {newAlarm === true ? (
            <div className="alarmSize" onClick={() => moveToLogin('alarm')}>
              <Lottie
                options={{
                  loop: true,
                  autoPlay: true,
                  path: `https://image.dalbitlive.com/event/200805/alarmdot_w.json`
                }}
              />
            </div>
          ) : (
            <button onClick={() => moveToLogin('alarm')}>
              <img className="icon" src={Alarm} alt="알람버튼" />
            </button>
          )}

          {context.news && <span className="news">&nbsp;</span>}
          {/* <span className="icon" style={{display: 'inline-block', width: '36px', height: '36px'}} /> */}
          {/* <img className="icon" src={My} onClick={() => moveToLogin('profile')} style={{marginLeft: '36px'}} /> */}
          {/* <img className="icon" src={Menu} onClick={() => moveToMenu('nav')} /> */}
        </div>
      </div>
    </>
  )
}
