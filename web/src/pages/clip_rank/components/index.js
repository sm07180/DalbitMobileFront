import React from 'react'
import {useParams} from 'react-router-dom'
import Header from 'components/ui/new_header'
import Guidance from './benefit/guidance'
import Receive from './benefit/receive'
import Layout from 'pages/common/layout'

//constant
import {BENEFIT_TYPE} from '../constant'

const ClipRankSubPage = () => {
  const {type} = useParams()

  return (
    <Layout status="no_gnb">
      <Header title="클립 랭킹 혜택" />
      {type === BENEFIT_TYPE.GUIDANCE && <Guidance />}
      {type === BENEFIT_TYPE.RECEIVE && <Receive />}
    </Layout>
  )
}

export default ClipRankSubPage
