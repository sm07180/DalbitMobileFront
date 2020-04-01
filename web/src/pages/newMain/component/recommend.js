import React, {useEffect, useState} from 'react'
import styled from 'styled-components'

// component
import Swiper from 'components/ui/swiper.js'

// static
import LiveIcon from '../static/ic_live.svg'

export default props => {
  let {list} = props

  if (Array.isArray(list) && list.length % 2 === 0) {
    list.pop()
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
        <Swiper>
          {list.map((broadcast, idx) => {
            const {profImg, nickNm, title} = broadcast
            return (
              <div
                className="slide"
                key={`b-${idx}`}
                onClick={() => console.log('idx ' + idx)}
                style={{backgroundImage: `url(${profImg['thumb88x88']})`}}
              />
            )
          })}
        </Swiper>
      )}
    </RecommendWrap>
  )
}

const RecommendWrap = styled.div`
  .dalbit-swiper {
    .slide {
      margin: 0 5px;
    }
  }

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
`
