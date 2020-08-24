/**
 *
 */
//context
import {Context} from 'context'
import Gnb from 'pages/common/gnb'
import Ip from 'pages/common/ip'
import Message from 'pages/common/message'
import NewPlayer from 'pages/common/newPlayer'
import Popup from 'pages/common/popup'
import Sticker from 'pages/common/sticker'
import TopScrollBtn from 'pages/main/component/top_scroll_btn.js'
import React, {useContext, useMemo} from 'react'
import styled from 'styled-components'

//
const Layout = (props) => {
  const {children, webview} = props
  const context = useContext(Context)
  const playerCls = useMemo(() => {
    return context.player ? 'player_show' : ''
  })
  const isMainPage = location.pathname === '/' ? true : false
  //---------------------------------------------------------------------

  return (
    <>
      {/* Sticker */}
      {context.sticker && <Sticker />}
      {/* GNB */}
      {props.status !== 'no_gnb' && <Gnb webview={webview} />}
      {/* 탑버튼 */}
      <TopScrollBtn />
      <Article
        className={
          webview ? `webview ${playerCls} ${isMainPage ? 'main-page' : ''}` : `${playerCls} ${isMainPage ? 'main-page' : ''}`
        }>
        {children}
      </Article>
      {/* (방송방)Player */}
      <NewPlayer {...props} />
      {/* 레이어팝업 */}
      <Popup {...props} />
      {/* 메시지팝업 */}
      <Message {...props} />
      {/* IP노출 */}
      <Ip {...props} />
    </>
  )
}
export default Layout
//---------------------------------------------------------------------

const Article = styled.article`
  height: 100%;
  &.webview {
    .header-wrap .close-btn {
      display: none;
    }
  }
  /* player가 노출시 padding-bottom추가 */
  &.player_show > div {
    padding-bottom: 60px;
  }
  &.player_show > section {
    padding-bottom: 60px;
  }

  &.main-page > div,
  section {
    padding-bottom: 0px;
  }
`
