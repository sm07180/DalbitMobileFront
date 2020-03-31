import React, {useEffect} from 'react'
import styled from 'styled-components'

// static
import LiveIcon from '../static/ic_live.svg'

import Swiper from 'react-id-swiper'

export default props => {
  const {list} = props

  console.log('r list', list)
  return (
    <RecommendWrap>
      <div className="selected-wrap">
        <img className="live-icon" src={LiveIcon} />
        <div className="counting">{list ? `1 / ${list.length}` : ''}</div>
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

    .live-icon {
      position: absolute;
      top: 6px;
      left: 6px;
      width: 51px;
    }
    .counting {
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      width: 46px;
      height: 16px;
      right: 6px;
      bottom: 6px;
      border-radius: 10px;
      background-color: rgba(0, 0, 0, 0.5);
      font-size: 10px;
    }
  }
`
