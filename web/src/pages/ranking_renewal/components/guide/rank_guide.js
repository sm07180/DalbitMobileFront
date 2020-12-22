import React, {useState, useMemo} from 'react'
import {useHistory, useParams} from 'react-router-dom'
//components
import Layout from 'pages/common/layout'
import Benefit from './rank_guide_benefit'
import HowUse from './rank_guide_howUse'
import MarketingPick from './marketing_pick'
import MarketingAdv from './marketing_adv'
import Header from 'components/ui/new_header'
//static
import './rank_guide.scss'

export default (props) => {
  const params = useParams()
  const guideType = params.type

  const subTitle = useMemo(() => {
    if (guideType === 'pick') {
      return '위클리픽'
    } else if (guideType === 'marketing') {
      return '15초 광고'
    } else {
      return '랭킹 혜택'
    }
  })

  return (
    <Layout {...props} status="no_gnb">
      <div id="ranking-guide-page">
        <Header title={subTitle} />
        <div className="guide-content-wrap">
          {guideType === 'benefit' && <Benefit />}
          {guideType === 'pick' && <MarketingPick />}
          {guideType === 'marketing' && <MarketingAdv />}
          {/* {guideType === 'howUse' && <HowUse></HowUse>} */}
        </div>
      </div>
    </Layout>
  )
}
