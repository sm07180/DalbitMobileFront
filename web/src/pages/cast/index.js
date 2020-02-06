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
import {getMicStream, getAudioStream} from 'components/lib/getStream'
import {Host, Listener} from 'components/lib/SignalingHandler'

export default props => {
  const context = new useContext(Context)
  const [handler, setHandler] = useState(null)
  const audioReference = useRef()

  // temp init
  useEffect(() => {
    // initialize mic stream and audio socket.
    ;(async () => {
      const audioSocketUrl = 'wss://v154.dalbitcast.com:5443/WebRTCAppEE/websocket'

      // const hostHandler = new Host(audioSocketUrl, true)
      // const micStream = await getMicStream()
      // hostHandler.setMicStream(micStream)
      // const audioStream = await getAudioStream(audioReference.current)
      // console.log(audioStream)
      // hostHandler.setAudioStream(audioStream)
      // hostHandler.setStreamId('stream1')
      // setHandler(hostHandler)
      // context.action.updateMediaHandler(hostHandler)

      const listenerHandler = new Listener(audioSocketUrl, true)
      listenerHandler.setAudioTag(audioReference.current)
      listenerHandler.setStreamId('stream1')
      setHandler(listenerHandler)
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
          <button
            onClick={() => {
              if (handler.ws) {
                handler.stop()
              }
            }}>
            stop
          </button>
        </div>

        <div>
          <audio ref={audioReference} autoPlay controls></audio>
        </div>
        <div>
          <button
            onClick={() => {
              if (handler.ws && handler.play) {
                handler.play()
              }
            }}>
            play
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
