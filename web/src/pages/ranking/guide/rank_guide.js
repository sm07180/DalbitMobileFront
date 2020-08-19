import React, {useState} from 'react'

//components
import Layout from 'pages/common/layout'
import Benefit from './rank_guide_benefit'
import HowUse from './rank_guide_howUse'
import './rank_guide.scss'

//static
import closeBtn from '../static/ic_back.svg'

import {useHistory, useParams} from 'react-router-dom'

export default (props) => {
  //const [guideType, setGuideType] = useState('benefit')
  // const [guideType, setGuideType] = useState('howUse')
  const history = useHistory()
  const params = useParams()

  const guideType = params.type

  const goBack = () => {
    window.history.back()
  }

  return (
    <Layout {...props} status="no_gnb">
      <div id="ranking-guide-page">
        <div className="header">
          <button className="header__btnBack" onClick={goBack}>
            <img src={closeBtn} alt="뒤로가기" />
          </button>
          <h1 className="header__title">랭킹 혜택</h1>
        </div>
        <div className="guide-content-wrap">
          {guideType === 'benefit' && <Benefit></Benefit>}
          {guideType === 'howUse' && <HowUse></HowUse>}
        </div>
      </div>
    </Layout>
  )
}
