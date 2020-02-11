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

import {getMicStream} from 'components/lib/getStream'
import {Host} from 'components/lib/SignalingHandler'

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

  useEffect(() => {
    ;(async () => {
      const audioSocketUrl = 'wss://v154.dalbitcast.com:5443/WebRTCAppEE/websocket'
      const hostHandler = new Host(audioSocketUrl, true)
      const micStream = await getMicStream()
      hostHandler.setMicStream(micStream)
      hostHandler.setStreamId(streamId)
      hostHandler.setLocalStartCallback(startPlayer)
      hostHandler.setLocalStopCallback(stopPlayer)
      setHandler(hostHandler)
      context.action.updateMediaHandler(hostHandler)
    })()

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
            if (!handler.micStream) {
              return alert('Need a mic and stereo mix')
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
