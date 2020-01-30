/**
 * @file /login/index.js
 * @brief 로그인
 */
import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
//layout
import Layout from 'pages/common/layout'
//context
//components
import Api from 'context/api'
import {checkMic} from 'components/lib/webRTC'

export default props => {
  //---------------------------------------------------------------------
  //useEffect
  useEffect(() => {
    let mediaStream = null
    ;(async () => {
      mediaStream = await checkMic()
    })()

    return () => {
      mediaStream.getTracks().forEach(track => {
        track.stop()
      })
    }
  }, [])
  //---------------------------------------------------------------------
  return (
    <Layout {...props}>
      <Content>CAST</Content>
    </Layout>
  )
}

//---------------------------------------------------------------------

const Content = styled.section`
  min-height: 300px;
  background: #e1e1e1;
`
