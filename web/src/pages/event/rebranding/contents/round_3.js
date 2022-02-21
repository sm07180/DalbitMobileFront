import React, {useState, useEffect} from 'react'
import {IMG_SERVER} from 'context/config'
import Utility from "components/lib/utility";
// global components
import BadgeItems from 'components/ui/badgeItems/BadgeItems'

import '../style.scss'

const Round_3 = (props) => {
  // 

  return (
    <>
      <section>
        <img src={`${IMG_SERVER}/event/rebranding/gift-1.png`} alt="이벤트 상품 이미지" />
      </section>
      <section>
        <img src={`${IMG_SERVER}/event/rebranding/detail.png`} alt="이벤트 유의사항 이미지" />
      </section>
    </>
  )
}

export default Round_3
