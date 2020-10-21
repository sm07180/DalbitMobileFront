import React from 'react'
import {useParams} from 'react-router-dom'

//component
import Layout from 'pages/common/layout'
import ThxGiving from './thanksgiving'
import ClipEventNative from './clip_event'
import ClipGiftEvent from './clip_gift_event'
import AttendEvent from './event_attend_new'
import PlusEvent from './plus_event'

export default () => {
  const params = useParams()

  const createContent = () => {
    let {title} = params
    switch (title) {
      case 'thanksgiving':
        return <ThxGiving />
      case 'clip_event':
        return <ClipEventNative />
      case 'clip_gift_event':
        return <ClipGiftEvent />
      case 'attend_event':
        return <AttendEvent />
      case 'plus_event':
        return <PlusEvent />

      default:
        return <></>
        break
    }
  }
  return <Layout status="no_gnb">{createContent()}</Layout>
}
