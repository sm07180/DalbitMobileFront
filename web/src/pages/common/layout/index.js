/**
 *
 */
import React from 'react'
import styled from 'styled-components'
//context
//layout
import Gnb from 'pages/common/gnb'
import NewPlayer from 'pages/common/newPlayer'
import Popup from 'pages/common/popup'
import Message from 'pages/common/message'
import TopScrollBtn from 'pages/main/component/top_scroll_btn.js'
import Ip from 'pages/common/ip'
//
const Layout = (props) => {
  const {children, webview} = props
  //---------------------------------------------------------------------
  return (
    <React.Fragment>
      {/* GNB */}
      {props.status !== 'no_gnb' && <Gnb webview={webview} />}
      {/* 탑버튼 */}
      <TopScrollBtn />
      <Article className={webview ? 'webview' : ''}>{children}</Article>
      {/* (방송방)Player */}
      <NewPlayer {...props} />
      {/* 레이어팝업 */}
      <Popup {...props} />
      {/* 메시지팝업 */}
      <Message {...props} />
      {/* IP노출 */}
      <Ip {...props} />
    </React.Fragment>
  )
}
export default Layout
//---------------------------------------------------------------------

const Article = styled.article`
  &.webview {
    .header-wrap .close-btn {
      display: none;
    }
  }
`
