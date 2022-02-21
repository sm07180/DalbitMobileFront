/**
 *
 */
//context
import {Context} from 'context'
import Gnb from 'pages/common/gnb'
import Ip from 'pages/common/ip'
import Message from 'pages/common/message'
import NewPlayer from 'pages/common/newPlayer'
import ClipPlayer from 'pages/common/clipPlayer'
import Popup from 'pages/common/popup'
import Sticker from 'pages/common/sticker'

import React, {useContext, useMemo, useEffect, useState, useRef} from 'react'
import {useHistory, useLocation} from 'react-router-dom'
import styled from 'styled-components'
import Utility from 'components/lib/utility'
import LayerPopupAppDownLogin from '../../main/component/layer_popup_appDownLogin'

import Api from 'context/api'
import {OS_TYPE} from 'context/config'
import MultiImageViewer from '../multi_image_viewer'
//
const Layout = (props) => {
  const {children, webview} = props

  const context = useContext(Context)
  const location = useLocation()
  const history = useHistory();
  const playerCls = useMemo(() => {
    return context.player || context.clipState ? 'player_show' : ''
  })
  const isMainPage = location.pathname === '/' ? true : false
  //---------------------------------------------------------------------
  const [appPopupState, setAppPopupState] = useState(false)

  const customHeader = JSON.parse(Api.customHeader)
  const noAppCheck = customHeader['os'] === OS_TYPE['Desktop']

  const isLoginPage = location.pathname === '/login'
  const isRulePage = history.location.pathname.startsWith("/rule")

  useEffect(() => {
    if (noAppCheck) {
      if (Utility.getCookie('AppPopup')) {
        setAppPopupState(false)
      } else {
        setAppPopupState(true)
      }
    }
  }, [noAppCheck])

  useEffect(() => {
    context.action.updateMultiViewer({show: false})
  }, [location])

  return (
    <>
      {/* Sticker */}
      {context.sticker && <Sticker />}
      {/* GNB */}
      {props.status !== 'no_gnb' && <Gnb webview={webview} />}
      {/* 탑버튼 */}
      <Article
        className={`content-article ${
          webview ? `webview ${playerCls} ${isMainPage ? 'main-page' : ''}` : `${playerCls} ${isMainPage ? 'main-page' : ''}`
        }`}>
        {children}
      </Article>
      {/* (방송방)Player */}
      {
        !isLoginPage && !isRulePage &&
        <NewPlayer {...props} />
      }
      {/* (클립)Player */}
      {
        !isLoginPage && !isRulePage &&
        <ClipPlayer {...props} />
      }

      {/* 레이어팝업 */}
      <Popup {...props} />
      {/* 메시지팝업 */}
      {/* <Message {...props} /> */}
      {/* IP노출 */}
      <Ip {...props} />

      {/*{appPopupState === true && noAppCheck && (*/}
      {/*  <>*/}
      {/*    <LayerPopupAppDownLogin appPopupState={appPopupState} setAppPopupState={setAppPopupState} />*/}
      {/*  </>*/}
      {/*)}*/}

      {context.multiViewer.show && <MultiImageViewer />}
    </>
  )
}
export default Layout

// 메인,랭킹,알림
const Article = styled.article`
  height: 100%;
  &.webview {
    .header-wrap .close-btn {
      display: none;
    }
  }
`
