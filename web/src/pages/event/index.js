import React from 'react'
import {useParams} from 'react-router-dom'

//component
import Layout from 'pages/common/layout'
import ThxGiving from './thanksgiving'
import ClipEvent from './clip_event'

export default () => {
  const params = useParams()

  const createContent = () => {
    let {title} = params
    switch (title) {
      case 'thanksgiving':
        return <ThxGiving />
      case 'clip_event':
        return <ClipEvent />
      default:
        return <></>
        break
    }
  }
  return <Layout status="no_gnb">{createContent()}</Layout>
}
