/**
 * @title 404페이지
 */
import React, {useEffect, useContext, useState} from 'react'
import styled from 'styled-components'

//context
import {Context} from 'context'

//etc

//pages
// import Guide from ' pages/common/layout/guide.js'

export default props => {
  //context
  const context = new useContext(Context)
  //const
  const {state} = props.location

  //makeContents
  const makeContents = () => {
    console.log(props)
    return JSON.stringify(state, null, 4)
  }
  /** about webrtc code */
  /*
  const {mediaHandler} = context
  const [publishStatus, setPublishStatus] = useState(false)

  const startPlayer = () => {
    setPublishStatus(true)
  }
  const stopPlayer = () => {
    setPublishStatus(false)
  }

  useEffect(() => {
    if (mediaHandler) {
      mediaHandler.setLocalStartCallback(startPlayer)
      mediaHandler.setLocalStopCallback(stopPlayer)
      mediaHandler.setType('host')
      // mediaHandler.setStreamId(streamId)
      ;(async () => {
        const audioStream = await getAudioStream()
        mediaHandler.setAudioStream(audioStream)
      })()
    }

    return () => {
      if (mediaHandler) {
        mediaHandler.resetLocalCallback()
      }
    }
  }, [mediaHandler])
  */
  /** about webrtc code */

  return (
    <Content>
      <pre>
        <p>{makeContents()}</p>
      </pre>
    </Content>
  )
}

const Content = styled.div`
  p {
    font-size: 14px;
  }
`
