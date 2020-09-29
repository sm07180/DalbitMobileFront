import React from 'react'
import {useParams} from 'react-router-dom'

//component
import Layout from 'pages/common/layout'
import ThxGiving from './thanksgiving'

export default () => {
  const params = useParams()

  const createContent = () => {
    let {title} = params
    switch (title) {
      case 'thanksgiving':
        return <ThxGiving />
      default:
        return <></>
        break
    }
  }
  return <Layout status="no_gnb">{createContent()}</Layout>
}
