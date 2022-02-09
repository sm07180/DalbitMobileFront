import React, {useState, useEffect, useRef} from 'react'

import Api from 'context/api'
import Swiper from 'react-id-swiper'
import moment from 'moment'
// global components
// components
import Tabmenu from '../Tabmenu'

import './blockReport.scss'

const blockReportTabmenu = ['차단하기','신고하기']

const BlockReport = (props) => {
  const {type} = props
  const [tabType, setTabType] = useState(blockReportTabmenu[0])
  
  // 팬 조회

  // 스와이퍼
  const swiperProps = {
    slidesPerView: 'auto',
  }

  return (
    <section className="blockReport">
      <Tabmenu data={blockReportTabmenu} tab={tabType} setTab={setTabType} />
      <div className="contents"></div>
    </section>
  )
}

export default BlockReport
