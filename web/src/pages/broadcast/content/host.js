/**
 * @title 404페이지
 */
import React, {useEffect} from 'react'
import styled from 'styled-components'

//context
import {Context} from 'context'

//etc
import {getAudioStream} from 'components/lib/getStream'

//pages
// import Guide from ' pages/common/layout/guide.js'

export default () => {
  const context = new useContext(Context)
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
      mediaHandler.setStreamId(streamId)
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

  return <h1>호스트</h1>
}
