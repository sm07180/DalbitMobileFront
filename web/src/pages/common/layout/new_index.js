/**
 *
 */
import React from 'react'
//context
//layout
import Gnb from 'pages/common/newGnb'
import Player from 'pages/common/player'
import Popup from 'pages/common/popup'
import Message from 'pages/common/message'
import TopScrollBtn from 'pages/newMain/component/top_scroll_btn.js'
//
const Layout = props => {
  const {children} = props

  console.log(props.status)
  //---------------------------------------------------------------------
  return (
    <React.Fragment>
      {/* GNB */}
      {props.status !== 'no_gnb' && <Gnb />}
      {/* 탑버튼 */}
      <TopScrollBtn />
      <article>{children}</article>
      {/* (방송방)Player */}
      {/* <Player {...props} /> */}
      {/* 레이어팝업 */}
      <Popup {...props} />
      {/* 메시지팝업 */}
      <Message {...props} />
    </React.Fragment>
  )
}
export default Layout
//---------------------------------------------------------------------
