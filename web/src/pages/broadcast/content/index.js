/**
 * @file /broadcast/index.js
 * @brief 방송방
 */
import React, {useEffect, useContext, useState, useRef} from 'react'
import styled from 'styled-components'

//context
import {Context} from 'context'
import {BroadCastContext} from '../store'

//etc

//pages
// import Guide from ' pages/common/layout/guide.js'

export default props => {
  //---------------------------------------------------------------------
  //context
  const context = new useContext(Context) //global context
  //const store = new useContext(BroadCastContext) //store

  //const
  const {state} = props.location
  const hostRole = 3
  const listenerRole = 0
  //---------------------------------------------------------------------

  const {mediaHandler} = context
  const [publishStatus, setPublishStatus] = useState(false)
  const [playStatus, setPlayStatus] = useState(false)
  const {bjStreamId, roomRole} = state

  const audioReference = useRef()
  const {location} = props.history

  const startPlayer = () => {
    if (roomRole === hostRole) {
      setPublishStatus(true)
    } else if (roomRole === listenerRole) {
      setPlayStatus(true)
    }
  }
  const stopPlayer = () => {
    if (roomRole === hostRole) {
      setPublishStatus(false)
    } else if (roomRole === listenerRole) {
      setPlayStatus(false)
    }
  }

  useEffect(() => {
    if (location.state && mediaHandler) {
      mediaHandler.setLocalStartCallback(startPlayer)
      mediaHandler.setLocalStopCallback(stopPlayer)
      mediaHandler.setType('listener')
      mediaHandler.setAudioTag(audioReference.current)
      mediaHandler.setStreamId(location.state.bjStreamId)
    }

    return () => {
      if (mediaHandler) {
        mediaHandler.resetLocalCallback()
      }
    }
  }, [mediaHandler])

  //makeContents
  const makeContents = () => {
    return JSON.stringify(state, null, 4)
  }
  //---------------------------------------------------------------------

  return (
    <Content>
      {roomRole === hostRole ? (
        <>
          <h1>Host BJ</h1>
          <div>Stream ID : {bjStreamId}</div>
          <div>
            <button
              style={{
                width: '100px',
                height: '50px',
                color: 'white',
                cursor: 'pointer',
                backgroundColor: publishStatus ? 'red' : 'blue'
              }}
              onClick={() => {
                if (!bjStreamId) {
                  return alert('Need a stream id')
                }
                if (!mediaHandler.audioStream) {
                  return alert('Need a audio sream and stereo mix')
                }

                if (mediaHandler && !mediaHandler.rtcPeerConn) {
                  mediaHandler.publish()
                  startPlayer()
                } else if (mediaHandler && mediaHandler.rtcPeerConn) {
                  mediaHandler.stop()
                  stopPlayer()
                }
              }}>
              {publishStatus ? 'Stop' : 'Publish'}
            </button>
          </div>
        </>
      ) : (
        <>
          <h1>Listener</h1>
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
                    const status = mediaHandler.play()
                    if (status) {
                      startPlayer()
                    }
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
        </>
      )}
    </Content>
  )
}
//---------------------------------------------------------------------
const Content = styled.div`
  p {
    font-size: 12px;
  }
`
