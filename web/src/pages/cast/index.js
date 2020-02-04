/**
 * @file /login/index.js
 * @brief 로그인
 */
import React, {useEffect, useState, useContext} from 'react'
import styled from 'styled-components'
//layout
import Layout from 'pages/common/layout'
//context
import {Context} from 'context'
//components
import Api from 'context/api'
import {getMicStream} from 'components/lib/makeMicStream'
import {wSocketHandler} from 'components/lib/hostWebRTC'

export default props => {
  const [micStream, setMicStream] = useState(null)
  const context = new useContext(Context)

  // temp init
  useEffect(() => {
    // initialize mic stream and audio socket.
    ;(async () => {
      const stream = await getMicStream()
      setMicStream(stream)
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
            if (context.audioSocket && micStream) {
              context.audioSocket.publish('stream1', micStream)
            }
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
