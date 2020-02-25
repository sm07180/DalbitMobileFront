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

function TempBroad() {
  const context = useContext(Context)
  const {mediaHandler} = context
  const {streamId} = useParams()
  const [publishStatus, setPublishStatus] = useState(false)

  const startPlayer = () => {
    setPublishStatus(true)
  }
  const stopPlayer = () => {
    setPublishStatus(false)
  }

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
