/**
 * @file /live/index.js
 * @brief 라이브방송
 */
import React, {useEffect, useContext, useState} from 'react'
import styled from 'styled-components'
//layout
import Layout from 'Pages/common/layout'
//context
import {Context} from 'Context'
import {LiveProvider} from './store'
//components
import Api from 'Context/api'
//pages
import Chat from 'Pages/live/content/chat'
import BroadCast from 'Pages/live/content/broadcast'
//
export default props => {
  //---------------------------------------------------------------------
  //context
  const context = useContext(Context)

  /**
   *
   * @returns
   */

  useEffect(() => {
    //
  }, [])

  //---------------------------------------------------------------------
  return (
    <LiveProvider>
      <Layout {...props}>
        {/* 채팅서비스 */}
        <Chat />
        {/* 방송서비스 */}
        <BroadCast />
      </Layout>
    </LiveProvider>
  )
}
//---------------------------------------------------------------------

const Content = styled.section`
  min-height: 300px;
  background: #e1e1e1;
`
