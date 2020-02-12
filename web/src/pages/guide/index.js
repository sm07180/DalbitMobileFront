/**
 * @url /guide/
 * @brief 가이드페이지
 * @author 손완휘
 */

import React, {useState, useEffect, useContext} from 'react'
import {Switch, Route, useParams} from 'react-router-dom'

//layout
import Layout from 'pages/common/layout'
import Contents from './layout-contents'
import Guide from './layout'
//context
import {Context} from 'context'

import {getAudioStream} from 'components/lib/getStream'

function TempBroad(props) {
  const context = new useContext(Context)
  const {streamId} = useParams()
  const [handler, setHandler] = useState(null)
  const [publishStatus, setPublishStatus] = useState(false)

  const startPlayer = () => {
    setPublishStatus(true)
  }
  const stopPlayer = () => {
    setPublishStatus(false)
  }

  if (!handler && context.mediaHandler) {
    ;(async () => {
      const {mediaHandler} = context
      const audioStream = await getAudioStream()
      mediaHandler.setAudioStream(audioStream)
      mediaHandler.setType('host')
      mediaHandler.setStreamId(streamId)
      mediaHandler.setLocalStartCallback(startPlayer)
      mediaHandler.setLocalStopCallback(stopPlayer)
      setHandler(mediaHandler)
    })()
  }

  useEffect(() => {
    return () => {
      if (handler) {
        handler.resetLocalCallback()
      }
    }
  }, [])

  return (
    <div>
      <div>Stream ID : {streamId}</div>
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
            if (!streamId) {
              return alert('Need a stream id')
            }
            if (!handler.audioStream) {
              return alert('Need a audio sream and stereo mix')
            }

            if (handler.ws && handler.publish && !handler.rtcPeerConn) {
              handler.publish()
              startPlayer()
            } else if (handler.ws && handler.rtcPeerConn) {
              handler.stop()
              stopPlayer()
            }
          }}>
          {publishStatus ? 'Stop' : 'Publish'}
        </button>
      </div>
    </div>
  )
}

export default props => {
  return (
    <Layout {...props}>
      <div>temp broadcast</div>

      <Switch>
        <Route exact path={`${props.match.path}/:streamId`} component={TempBroad} />
      </Switch>

      {/* <Contents /> */}
    </Layout>
  )
}
