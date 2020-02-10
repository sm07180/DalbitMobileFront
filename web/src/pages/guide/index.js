/**
 * @url /guide/
 * @brief 가이드페이지
 * @author 손완휘
 */

import React, {useState, useEffect} from 'react'
import {Switch, Route, useParams} from 'react-router-dom'

//layout
import Layout from './layout'
import Contents from './layout-contents'
import Guide from './layout'
//

import {getMicStream} from 'components/lib/getStream'
import {Host} from 'components/lib/SignalingHandler'

function TempBroad(props) {
  const {streamId} = useParams()

  const [handler, setHandler] = useState(null)
  const [publishStatus, setPublishStatus] = useState(false)

  useEffect(() => {
    ;(async () => {
      const audioSocketUrl = 'wss://v154.dalbitcast.com:5443/WebRTCAppEE/websocket'
      const hostHandler = new Host(audioSocketUrl, true)
      const micStream = await getMicStream()
      console.log(micStream)
      hostHandler.setMicStream(micStream)
      hostHandler.setStreamId(streamId)
      setHandler(hostHandler)
    })()
    return () => {
      // unmount
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
              setPublishStatus(true)
            } else if (handler.ws && handler.rtcPeerConn) {
              handler.stop()
              setPublishStatus(false)
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
