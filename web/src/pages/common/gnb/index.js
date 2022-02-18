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
  const [alarmMoveUrl, setAlarmMoveUrl] = useState(false)

  const reLoad = () => {
    window.location.href = '/'
  }
  const moveToMenu = (category) => {
    return history.push(`/menu/${category}`)
  }
  const moveToLogin = async (category) => {
    if (!token.isLogin) {
      return history.push('/login')
    }
    if (category === 'alarm') {
      //context.action.updateNews(false)
      setNewAlarm(false)
      if (alarmMoveUrl === '') {
        return history.push(`/menu/${category}`)
      } else {
        return history.push(`${alarmMoveUrl}`)
      }
    }
    if (category === 'mailbox') {
      if (!context.myInfo.level) {
        const myProfile = await Api.profile({ params: { memNo: token.memNo } })
        if(myProfile.data.level === 0) {
          return globalCtx.action.alert({
            msg: '메시지는 1레벨부터 이용 가능합니다. \n 레벨업 후 이용해주세요.'
          })
        }
      }

      if (isHybrid()) {
        Hybrid('OpenMailBoxList')
      } else {
        context.action.updatePopup('APPDOWN', 'appDownAlrt', 5)
      }
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
            setAlarmMoveUrl(data.moveUrl)
          } else {
            setNewAlarm(false)
            setAlarmMoveUrl('')
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
    const isMailboxNewCheck = async () => {
      const {result, data, message} = await Api.checkIsMailboxNew()
      if (result === 'success') {
        globalCtx.action.updateIsMailboxNew(data.isNew)
      } else {
        globalCtx.action.alert({
          msg: message
        })
      }
    }
    if (context.token.isLogin) isMailboxNewCheck()
  }, [])

  const createMailboxIcon = () => {
    if (!globalCtx.isMailboxOn && globalCtx.token.isLogin) {
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
          <img src="https://image.dalbitlive.com/svg/postbox_m_w_off.svg" alt="메시지" />
        </button>
      )
    }

    if (globalCtx.isMailboxNew && globalCtx.token.isLogin) {
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
          <img src="https://image.dalbitlive.com/svg/postbox_w_on.svg" alt="메시지" />
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
          <img className="icon mailbox" src="https://image.dalbitlive.com/svg/postbox_w.svg" alt="메시지" />
        </button>
      )
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
              <img src="https://image.dalbitlive.com/ani/webp/main/gnb_alarm_w.webp" alt="alarm active" width={40} height={40} />
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
