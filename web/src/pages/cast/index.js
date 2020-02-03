/**
 * @file /login/index.js
 * @brief 로그인
 */
import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
//layout
import Layout from 'pages/common/layout'
//context
import {Context, GlobalProvider} from 'context'
//components
import Api from 'context/api'
import {getMicStream, removeMicStream, wSocketHandler} from 'components/lib/webRTC'

export default props => {
  const [wsocket, setWsocket] = useState(null)

  useEffect(() => {
    let audioStream = null
    ;(async () => {
      audioStream = await getMicStream()
      setWsocket(await wSocketHandler('wss://v154.dalbitcast.com:5443/WebRTCAppEE/websocket'))
      // console.log(audioStream.getAudioTracks())
    })()

    return () => {
      if (audioStream) {
        removeMicStream(audioStream)
      }
    }
  }, [])

  return (
    <Layout {...props}>
      <Content>
        <button onClick={() => wsocket.publish('stream1', null)}>test</button>
      </Content>
    </Layout>
  )
}

//---------------------------------------------------------------------

const Content = styled.section`
  min-height: 300px;
  background: #e1e1e1;
`
