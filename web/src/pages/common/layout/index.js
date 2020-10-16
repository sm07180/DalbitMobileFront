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
import TopScrollBtn from 'pages/main/component/top_scroll_btn.js'
import React, {useContext, useMemo, useEffect, useState} from 'react'
import styled from 'styled-components'
import Utility from 'components/lib/utility'
import LayerPopupAppDownLogin from '../../main/component/layer_popup_appDownLogin'

//
const Layout = (props) => {
  const {children, webview} = props

  const context = useContext(Context)
  const playerCls = useMemo(() => {
    return context.player || context.clipState ? 'player_show' : ''
  })
  const isMainPage = location.pathname === '/' ? true : false
  //---------------------------------------------------------------------
  const [appPopupState, setAppPopupState] = useState(false)
  useEffect(() => {
    if (context.token.isLogin) {
      if (Utility.getCookie('AppPopup')) {
        setAppPopupState(false)
      } else {
        setAppPopupState(true)
      }
    }
  }, [context.token.isLogin])

  return (
    <>
      {/* Sticker */}
      {context.sticker && <Sticker />}
      {/* GNB */}
      {props.status !== 'no_gnb' && <Gnb webview={webview} />}
      {/* 탑버튼 */}
      <TopScrollBtn />
      <Article
        className={`content-article ${
          webview ? `webview ${playerCls} ${isMainPage ? 'main-page' : ''}` : `${playerCls} ${isMainPage ? 'main-page' : ''}`
        }`}>
        {children}
      </Article>
      {/* (방송방)Player */}
      <NewPlayer {...props} />
      {/* (클립)Player */}
      <ClipPlayer {...props} />
      {/* 레이어팝업 */}
      <Popup {...props} />
      {/* 메시지팝업 */}
      <Message {...props} />
      {/* IP노출 */}
      <Ip {...props} />

      {appPopupState === true && context.token.isLogin && (
        <>
          <LayerPopupAppDownLogin appPopupState={appPopupState} setAppPopupState={setAppPopupState} />
        </>
      )}
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
