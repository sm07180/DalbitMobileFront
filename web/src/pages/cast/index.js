/**
 * @file /login/index.js
 * @brief 로그인
 */
import React, {useEffect, useState, useContext, useRef} from 'react'
import styled from 'styled-components'
//layout
import Layout from 'pages/common/layout'
//context
import {Context} from 'context'
//components
import Api from 'context/api'
import {getMicStream} from 'components/lib/getStream'
import {Host, Listener} from 'components/lib/SignalingHandler'

export default props => {
  const context = new useContext(Context)
  const [handler, setHandler] = useState(null)
  const [streamId, setStreamId] = useState(null)
  const [playStatus, setPlayStatus] = useState(false)

  const audioReference = useRef()
  const {location} = props.history

  // temp init
  useEffect(() => {
    // initialize mic stream and audio socket.
    ;(async () => {
      const audioSocketUrl = 'wss://v154.dalbitcast.com:5443/WebRTCAppEE/websocket'

      // host
      // const hostHandler = new Host(audioSocketUrl, true)
      // const micStream = await getMicStream()
      // hostHandler.setMicStream(micStream)
      // hostHandler.setStreamId(location.state.bjStreamId)
      // setHandler(hostHandler)
      // context.action.updateMediaHandler(hostHandler)

      // listener
      const listenerHandler = new Listener(audioSocketUrl, true)
      listenerHandler.setAudioTag(audioReference.current)
      listenerHandler.setStreamId(location.state.bjStreamId)
      setHandler(listenerHandler)
      setStreamId(location.state.bjStreamId)
      context.action.updateMediaHandler(listenerHandler)
    })()

    return () => {}
  }, [])

  return (
    <Layout {...props}>
      <Content>
        {/* <div>
          <button
            onClick={() => {
              if (handler.ws && handler.publish) {
                handler.publish()
              }
            }}>
            publish
          </button>
        </div> */}

        <div>
          <audio ref={audioReference} autoPlay controls></audio>
        </div>

        <div>streamId: {streamId}</div>

        {!playStatus && (
          <div>
            <button
              onClick={() => {
                if (handler.ws && handler.play && !handler.rtcPeerConn) {
                  handler.play()
                }
              }}>
              play
            </button>
          </div>
        )}

        {playStatus && (
          <div>
            <button
              onClick={() => {
                if (handler.ws && handler.rtcPeerConn) {
                  handler.stop()
                }
              }}>
              stop
            </button>
          </div>
        )}
      </Content>
    </Layout>
  )
}

//---------------------------------------------------------------------

const Content = styled.section`
  min-height: 300px;
  background: #e1e1e1;
`
