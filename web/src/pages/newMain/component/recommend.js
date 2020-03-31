import React, {useEffect} from 'react'
import styled from 'styled-components'

// static
import LiveIcon from '../static/ic_live.svg'

import Swiper from 'react-id-swiper'

export default props => {
  const {list} = props
  const params = {
    slidesPerView: 7
    // spaceBetween: 30
  }

  return (
    <RecommendWrap>
      <div className="selected-wrap">
        <img className="live-icon" src={LiveIcon} />
        <div className="counting">
          <span className="bold">{list ? `1` : ''}</span>
          <span>{list ? `/ ${list.length}` : ''}</span>
        </div>
      </div>
      {list && (
        <Swiper className="swiper-wrap" {...params}>
          {list.slice(0, 3).map((broadcast, idx) => {
            const {profImg, nickNm, title} = broadcast
            // console.log(profImg)
            return (
              <div className="b-list" key={`b-${idx}`}>
                <img width={50} src={profImg['thumb62x62']} />
              </div>
            )
          })}
        </Swiper>
      )}
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
      color: rgba(255, 255, 255, 0.5);

      .bold {
        color: #fff;
        margin-right: 4px;
      }
    }
  }

  .swiper-wrapper {
    display: flex;
    justify-content: space-around;
  }
`
