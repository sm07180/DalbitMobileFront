import React, {useEffect} from 'react'
import styled from 'styled-components'

// static
import LiveIcon from '../static/ic_live.svg'

import Swiper from 'react-id-swiper'

export default props => {
  return (
    <RecommendWrap>
      <div className="selected-wrap">
        <img src={LiveIcon} />
      </div>
    </RecommendWrap>
  )
}

const RecommendWrap = styled.div`
  .selected-wrap {
    position: relative;
    height: 120px;
    border-radius: 10px;
    margin: 0 16px;
    background-color: #eee;
  }
`
