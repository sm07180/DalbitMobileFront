import React, {useState} from 'react'
import {useHistory, useParams} from 'react-router-dom'
//components
import Layout from 'pages/common/layout'
import Benefit from './rank_guide_benefit'
import HowUse from './rank_guide_howUse'
import Header from 'components/ui/new_header'
//static
import './rank_guide.scss'

export default (props) => {
  //const [guideType, setGuideType] = useState('benefit')
  // const [guideType, setGuideType] = useState('howUse')
  const params = useParams()

  const guideType = params.type

  return (
    <Layout {...props} status="no_gnb">
      <div id="ranking-guide-page">
        <Header title="랭킹 혜택" />
        <div className="guide-content-wrap">
          {guideType === 'benefit' && <Benefit></Benefit>}
          {/* {guideType === 'howUse' && <HowUse></HowUse>} */}
        </div>
      </div>
    </Layout>
  )
}
