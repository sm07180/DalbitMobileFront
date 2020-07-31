import React, {useState} from 'react'

import './rank_guide.scss'
import Layout from 'pages/common/layout'
import Benefit from './rank_guide_benefit'
import HowUse from './rank_guide_howUse'

import closeBtn from '../static/ic_back.svg'

export default (props) => {
  const [guideType, setGuideType] = useState('benefit')

  const goBack = () => {
    window.history.back()
  }

  return (
    <Layout {...props} status="no_gnb">
      <div id="ranking-page">
        <div className="header">
          <h1 className="header__title">랭킹 가이드</h1>
          <button className="header__btnBack" onClick={goBack}>
            <img src={closeBtn} alt="뒤로가기" />
          </button>
        </div>

        <div className="rankTab guideTab">
          <button
            className={`rankTab__btn ${guideType === 'benefit' ? 'rankTab__btn--active' : ''} `}
            onClick={() => setGuideType('benefit')}>
            혜택
          </button>
          <button
            className={`rankTab__btn ${guideType === 'howUse' ? 'rankTab__btn--active' : ''} `}
            onClick={() => setGuideType('howUse')}>
            랭킹 산정 방식
          </button>
        </div>

        <div className="guide-content-wrap">
          {guideType === 'benefit' && <Benefit></Benefit>}
          {guideType === 'howUse' && <HowUse></HowUse>}
        </div>
      </div>
    </Layout>
  )
}
