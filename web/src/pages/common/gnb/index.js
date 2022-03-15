import React, {useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'
import {Hybrid, isHybrid} from 'context/hybrid'
import Logo from './static/logo_w_no_symbol.svg'
import Alarm from './static/alarm_w.svg'
import {OS_TYPE} from 'context/config.js'
import Api from 'context/api'
import 'styles/main.scss'
import {useDispatch, useSelector} from "react-redux";
import {
  setGlobalCtxIsMailboxNew,
  setGlobalCtxLogoChange,
  setGlobalCtxMessage,
  setGlobalCtxUpdatePopup
} from "redux/actions/globalCtx";

let alarmCheckIntervalId = null

export default (props) => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const {logoChange, token} = globalState
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
      if (!globalState.myInfo.level) {
        const myProfile = await Api.profile({ params: { memNo: token.memNo } })
        if(myProfile.data.level === 0) {
          return dispatch(setGlobalCtxMessage({type: "alert",
            msg: '메시지는 1레벨부터 이용 가능합니다. \n 레벨업 후 이용해주세요.'
          }))
        }
      }

      if (isHybrid()) {
        Hybrid('OpenMailBoxList')
      } else {
        dispatch(setGlobalCtxUpdatePopup({popup:['APPDOWN', 'appDownAlrt', 5]}))
      }
      return false
    }
    if (category === 'store') {
      if (customHeader.os === OS_TYPE['IOS']) {
        if (customHeader.appBuild && parseInt(customHeader.appBuild) > 196) {
          return webkit.messageHandlers.openInApp.postMessage('')
        } else {
          dispatch(setGlobalCtxMessage({type: "alert",
            msg: '현재 앱 내 결제에 문제가 있어 작업중입니다.\n도움이 필요하시면 1:1문의를 이용해 주세요.'
          }))
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
      dispatch(setGlobalCtxLogoChange(true));
    } else if (logoChange && window.scrollY < gnbHeight) {
      dispatch(setGlobalCtxLogoChange(false));
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
        dispatch(setGlobalCtxIsMailboxNew(data.isNew));
      } else {
        dispatch(setGlobalCtxMessage({type: "alert",
          msg: message
        }))
      }
    }
    if (globalState.token.isLogin) isMailboxNewCheck()
  }, [])

  const createMailboxIcon = () => {
    if (!globalState.isMailboxOn && globalState.token.isLogin) {
      return (
        <button
          className="alarmSize"
          onClick={() => {
            if (isHybrid()) {
              moveToLogin('mailbox')
            } else {
              dispatch(setGlobalCtxUpdatePopup({popup:['APPDOWN', 'appDownAlrt', 5]}))
            }
          }}>
          <img src="https://image.dalbitlive.com/svg/postbox_m_w_off.svg" alt="메시지" />
        </button>
      )
    }

    if (globalState.isMailboxNew && globalState.token.isLogin) {
      return (
        <button
          className="alarmSize"
          onClick={() => {
            if (isHybrid()) {
              moveToLogin('mailbox')
            } else {
              dispatch(setGlobalCtxUpdatePopup({popup:['APPDOWN', 'appDownAlrt', 5]}))
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
              dispatch(setGlobalCtxUpdatePopup({popup:['APPDOWN', 'appDownAlrt', 5]}))
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
          <img src={Logo} alt="달라" />
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
