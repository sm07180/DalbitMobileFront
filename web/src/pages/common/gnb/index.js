import React, {useEffect, useState, useContext, useCallback} from 'react'
import {useHistory} from 'react-router-dom'
import styled from 'styled-components'
import Lottie from 'react-lottie'

import {Context} from 'context'
import {RoomMake} from 'context/room'
import {Hybrid, isHybrid} from 'context/hybrid'

// static image
//import Logo from './static/logo@2x.png'
import Logo from './static/logo_w_no_symbol.svg'
import Search from './static/search_w.svg'
import Alarm from './static/alarm_w.svg'
import Store from './static/store_w.svg'
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
  const globalCtx = useContext(Context)
  const {logoChange, token} = globalCtx
  const {webview} = props
  const customHeader = JSON.parse(Api.customHeader)
  const history = useHistory()

  if (webview && webview === 'new') {
    return null
  }

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
      //context.action.updateNews(false)
      setNewAlarm(false)
    }
    if (category === 'mailbox') {
      console.log('우체통리스트 진입')
      Hybrid('OpenMailBoxList')
      return false
    }
    if (category === 'store') {
      if (customHeader.os === OS_TYPE['IOS']) {
        if (customHeader.appBuild && parseInt(customHeader.appBuild) > 196) {
          return webkit.messageHandlers.openInApp.postMessage('')
        } else {
          globalCtx.action.alert({
            msg: '현재 앱 내 결제에 문제가 있어 작업중입니다.\n도움이 필요하시면 1:1문의를 이용해 주세요.'
          })
          return
        }
      } else {
        return history.push(`/pay/${category}`)
      }
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
      let memNoParams = token.memNo ? token.memNo : ''
      const {result, data, message} = await Api.getMyPageNew(memNoParams)
      if (result === 'success') {
        if (data) {
          if (data.newCnt > 0) {
            setNewAlarm(true)
          } else {
            setNewAlarm(false)
          }
        }
      }
    }
    if (token.isLogin && !newAlarm) {
      alarmCheck()
      alarmCheckIntervalId = setInterval(alarmCheck, 60000)
    } else {
      if (alarmCheckIntervalId) {
        clearInterval(alarmCheckIntervalId)
      }
    }
  }, [newAlarm])

  useEffect(() => {
    const mailboxNewCheck = async () => {
      const {result, data, message} = await Api.checkIsMailboxNew()
      if (result === 'success') {
        globalCtx.action.updateMailboxNew(data.isNew)
      } else {
        globalCtx.action.alert({
          msg: message
        })
      }
    }
    if (context.token.isLogin) mailboxNewCheck()
  }, [])

  const createMailboxIcon = () => {
    if (context.mailboxExist) {
      if (
        __NODE_ENV === 'dev' ||
        customHeader.os === OS_TYPE['Desktop'] ||
        (customHeader.os === OS_TYPE['Android'] && customHeader.appBuild >= 51) ||
        (customHeader.os === OS_TYPE['IOS'] && customHeader.appBuild >= 273)
      ) {
        if (globalCtx.mailboxNew && globalCtx.token.isLogin) {
          return (
            <button
              className="alarmSize"
              onClick={() => {
                if (isHybrid()) {
                  moveToLogin('mailbox')
                } else {
                  globalCtx.action.updatePopup('APPDOWN', 'appDownAlrt', 5)
                }
              }}>
              <img src="https://image.dalbitlive.com/svg/postbox_w_on.svg" alt="우체통" />
            </button>
          )
        } else {
          return (
            <button
              className="alarmSize"
              onClick={() => {
                if (isHybrid()) {
                  moveToLogin('mailbox')
                } else {
                  globalCtx.action.updatePopup('APPDOWN', 'appDownAlrt', 5)
                }
              }}>
              <img className="icon mailbox" src="https://image.dalbitlive.com/svg/postbox_w.svg" alt="우체통" />
            </button>
          )
        }
      }
    }
  }

  return (
    <>
      <div className="hiddenBg"></div>

      <div className="headerWrap">
        <div className="icon-wrap">
          <button onClick={() => moveToMenu('search')}>
            <img className="iconSearch" src="https://image.dalbitlive.com/svg/ico_search_w.svg" alt="검색버튼" />
          </button>
          <button onClick={() => moveToLogin('store')}>
            <img className="iconStore" src="https://image.dalbitlive.com/svg/ico_store_w.svg" alt="스토어버튼" />
          </button>
        </div>
        <h1 className="gnb-logo" onClick={reLoad}>
          <img src={Logo} alt="달빛라이브" />
        </h1>
        <div className="icon-wrap">
          {createMailboxIcon()}
          {newAlarm === true ? (
            <button onClick={() => moveToLogin('alarm')} className="alarIconSize">
              <Lottie
                options={{
                  loop: true,
                  autoplay: true,
                  path: `https://image.dalbitlive.com/event/200805/alarmdot_w.json`
                }}
              />
            </button>
          ) : (
            <button onClick={() => moveToLogin('alarm')}>
              <img src={Alarm} alt="알람버튼" />
            </button>
          )}
        </div>
      </div>
    </>
  )
}
