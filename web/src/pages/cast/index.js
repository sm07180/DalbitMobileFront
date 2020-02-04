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
import {Host} from 'components/lib/SignalingHandler'

export default props => {
  const context = new useContext(Context)
  const [handler, setHandler] = useState(null)

  // temp init
  useEffect(() => {
    // initialize mic stream and audio socket.
    ;(async () => {
      const stream = await getMicStream()
      const audioSocketUrl = 'wss://v154.dalbitcast.com:5443/WebRTCAppEE/websocket'
      const sHandler = new Host(audioSocketUrl, stream, true)
      sHandler.setStreamId('stream1')
      sHandler.setMicStream(stream)
      setHandler(sHandler)
      // console.log(audioStream.getAudioTracks())
    })()

    return () => {}
  }, [])

  return (
    <Layout {...props}>
      <Content>
        <div>
          <button
            onClick={() => {
              if (handler.ws) {
                handler.publish()
              }
            }}>
            publish
          </button>
        </div>
        <div>
          <button
            onClick={() => {
              if (handler.ws) {
                handler.stop()
              }
            }}>
            stop
          </button>
        </div>
      </Content>
    </Layout>
  )
}

//---------------------------------------------------------------------

const Content = styled.section`
  min-height: 300px;
  background: #e1e1e1;
`
