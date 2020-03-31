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

const Layout = props => {
  const {children} = props
  //---------------------------------------------------------------------
  return (
    <React.Fragment>
      {/* GNB */}
      <Gnb />
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
