/**
 * @title 404페이지
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
  const store = new useContext(BroadCastContext) //store

  //const
  const {state} = props.location
  //---------------------------------------------------------------------

  const {mediaHandler} = context
  const [playStatus, setPlayStatus] = useState(false)

  const audioReference = useRef()
  const {location} = props.history

  const startPlayer = () => {
    setPlayStatus(true)
  }
  const stopPlayer = () => {
    setPlayStatus(false)
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
      <h1>Listener</h1>
      <div>
        <audio ref={audioReference} autoPlay controls></audio>
      </div>

      <div>streamId: {location.state && location.state.bjStreamId}</div>

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
              if (!location.state || !location.state.bjStreamId) {
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
    </Content>
  )
}
//---------------------------------------------------------------------
const Content = styled.div`
  p {
    font-size: 12px;
  }
`
