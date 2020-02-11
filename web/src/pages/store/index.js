/**
 * @file /store/index.js
 * @brief 스토어
 */
import React, {useEffect, useState, useContext} from 'react'
import styled from 'styled-components'
//layout
import Layout from 'pages/common/layout'
//context
import {Context} from 'context'
//components
import Api from 'context/api'
//
export default props => {
  const context = new useContext(Context)
  const {mediaHandler} = context

  //---------------------------------------------------------------------
  //useEffect
  useEffect(() => {}, [])
  //---------------------------------------------------------------------
  return (
    <Layout {...props}>
      {mediaHandler && mediaHandler.rtcPeerConn && <MediaPlayer />}
      <Content></Content>
    </Layout>
  )
}

//---------------------------------------------------------------------

const Content = styled.section`
  min-height: 300px;
  background: #e1e1e1;
`

const MediaPlayer = styled.div`
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 100;
  width: 300px;
  height: 100px;
  box-shadow: 4px 4px 10px #aaa;
  background-color: #fff;
`
