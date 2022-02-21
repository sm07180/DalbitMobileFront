import React, {useState, useEffect} from 'react'
import {IMG_SERVER} from 'context/config'
import Utility from "components/lib/utility";
import moment from 'moment'
// global components
import BadgeItems from 'components/ui/badgeItems/BadgeItems'
// components
import RankList from 'components/ui/rankList/RankList'

import '../style.scss'

const Round_1 = (props) => {
  // 

  return (
    <>
      <section className="date">
        {`${moment().format('YY.MM.DD')} - ${moment().format('MM.DD')}`}
      </section>
      <section className="listWrap">
        <div className="listRow">

        </div>
        <div className="noList">
          <img src={`${IMG_SERVER}/event/rebranding/listNone.png`} />
          <span>참가자들이 dalla를 만들고 있어요!</span>
        </div>
      </section>
      <section>
        <img src={`${IMG_SERVER}/event/rebranding/gift-1.png`} alt="이벤트 상품 이미지" />
      </section>
      <section>
        <img src={`${IMG_SERVER}/event/rebranding/detail.png`} alt="이벤트 유의사항 이미지" />
      </section>
    </>
  )
}

export default Round_1
