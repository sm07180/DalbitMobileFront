/**
 * @file /login/index.js
 * @brief 로그인
 */
import React, {useEffect, useState, useContext} from 'react'
import styled from 'styled-components'
//layout
import Layout from 'pages/common/layout'
//context
import {Context, GlobalProvider} from 'context'
//components
import Api from 'context/api'
import {getMicStream, wSocketHandler} from 'components/lib/webRTC'

export default props => {
  const context = new useContext(Context)

  useEffect(() => {
    let audioStream = null
    ;(async () => {
      audioStream = await getMicStream()
      const ws = await wSocketHandler('wss://v154.dalbitcast.com:5443/WebRTCAppEE/websocket')
      context.action.updateAudioSocket(ws)
      // console.log(audioStream.getAudioTracks())
    })()

    return () => {}
  }, [])

  return (
    <Layout {...props}>
      <Content>
        <button
          onClick={() => {
            ws.publish('stream1')
          }}>
          test
        </button>
      </Content>
    </Layout>
  )
}

//---------------------------------------------------------------------

const Content = styled.section`
  min-height: 300px;
  background: #e1e1e1;
`
