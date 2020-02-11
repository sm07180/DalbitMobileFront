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
import {Listener} from 'components/lib/SignalingHandler'

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

      // listener
      const listenerHandler = new Listener(audioSocketUrl, true)
      listenerHandler.setAudioTag(audioReference.current)
      if (location.state) {
        const {bjStreamId} = location.state
        listenerHandler.setStreamId(bjStreamId)
        setStreamId(bjStreamId)
      }
      setHandler(listenerHandler)
      context.action.updateMediaHandler(listenerHandler)
    })()

    return () => {}
  }, [])

  return (
    <Layout {...props}>
      <Content>
        <div>
          <audio ref={audioReference} autoPlay controls></audio>
        </div>

        <div>streamId: {streamId}</div>

        {!playStatus && (
          <div>
            <button
              style={{
                width: '100px',
                height: '50px',
                color: 'white',
                cursor: 'pointer',
                backgroundColor: 'blue'
              }}
              onClick={() => {
                if (!streamId) {
                  return alert('Need a stream id')
                }
                if (handler.ws && handler.play && !handler.rtcPeerConn) {
                  handler.play()
                  setPlayStatus(true)
                }
              }}>
              play
            </button>
          </div>
        )}

        {playStatus && (
          <div>
            <button
              style={{width: '100px', height: '50px', backgroundColor: 'red', color: 'white', cursor: 'pointer'}}
              onClick={() => {
                if (handler.ws && handler.rtcPeerConn) {
                  handler.stop()
                  setPlayStatus(false)
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
