/**
 *
 */
import React from 'react'
//context
//layout
import Gnb from 'pages/common/newGnb'
import NewPlayer from 'pages/common/newPlayer'
import Popup from 'pages/common/popup'
import Message from 'pages/common/message'
import TopScrollBtn from 'pages/main/component/top_scroll_btn.js'
//
const Layout = props => {
  const {children, webview} = props
  //---------------------------------------------------------------------
  return (
    <React.Fragment>
      {/* GNB */}
      {props.status !== 'no_gnb' && <Gnb webview={webview} />}
      {/* 탑버튼 */}
      <TopScrollBtn />
      <article>{children}</article>
      {/* (방송방)Player */}
      <NewPlayer {...props} />
      {/* 레이어팝업 */}
      <Popup {...props} />
      {/* 메시지팝업 */}
      <Message {...props} />
    </React.Fragment>
  )
}
export default Layout
//---------------------------------------------------------------------
