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

export default props => {
  const context = new useContext(Context)
  const {mediaHandler} = context
  const [playStatus, setPlayStatus] = useState(false)

  const audioReference = useRef()
  const {location} = props.history
  const {bjStreamId} = location.state

  const startPlayer = () => {
    setPlayStatus(true)
  }
  const stopPlayer = () => {
    setPlayStatus(false)
  }

  if (mediaHandler && !mediaHandler.type) {
    mediaHandler.setType('listener')
    mediaHandler.setAudioTag(audioReference.current)
    mediaHandler.setStreamId(bjStreamId)
    mediaHandler.setLocalStartCallback(startPlayer)
    mediaHandler.setLocalStopCallback(stopPlayer)
  }

  // temp init
  useEffect(() => {
    return () => {
      console.log('return', context.mediaHandler)
      // if (handler) {
      //   handler.resetLocalCallback()
      // }
    }
  }, [])

  return (
    <Layout {...props}>
      <Content>
        <div>
          <audio ref={audioReference} autoPlay controls></audio>
        </div>

        <div>streamId: {bjStreamId}</div>

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
                if (!bjStreamId) {
                  return alert('Need a stream id')
                }
                if (audioReference && mediaHandler && !mediaHandler.rtcPeerConn) {
                  mediaHandler.play()
                  startPlayer()
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
                if (audioReference && mediaHandler && mediaHandler.rtcPeerConn) {
                  mediaHandler.stop()
                  stopPlayer()
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
