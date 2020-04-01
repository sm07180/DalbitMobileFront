import React, {useEffect, useState, useLayoutEffect} from 'react'
import styled from 'styled-components'

// component
import Swiper from 'components/ui/swiper.js'

// static
import LiveIcon from '../static/ic_live.svg'

export default props => {
  const {list} = props
  const [selectedBIdx, setSelectedBIdx] = useState(null)

  if (Array.isArray(list) && list.length % 2 === 0) {
    list.pop()
  }

  const selectBroadcast = idx => {
    setSelectedBIdx(idx)
  }

  useEffect(() => {
    if (Array.isArray(list) && list.length) {
      setSelectedBIdx(Math.floor(list.length / 2))
    }
  }, [list])

  return (
    <RecommendWrap>
      <div
        className="selected-wrap"
        style={selectedBIdx !== null ? {backgroundImage: `url(${list[selectedBIdx]['profImg']['thumb700x700']})`} : {}}>
        <img className="live-icon" src={LiveIcon} />
        <div className="counting">
          <span className="bold">{list ? `1` : ''}</span>
          <span>{list ? `/ ${list.length}` : ''}</span>
        </div>
      </div>
      {list && (
        <Swiper onSwipe={selectBroadcast} selectedBIdx={selectedBIdx}>
          {list.map((broadcast, idx) => {
            const {profImg} = broadcast
            return (
              <div className="slide" data-idx={idx} key={`b-${idx}`} style={{backgroundImage: `url(${profImg['thumb88x88']})`}} />
            )
          })}
        </Swiper>
      )}
      <div className="selected-title">{selectedBIdx !== null ? list[selectedBIdx]['title'] : ''}</div>
      <div className="selected-nickname">{selectedBIdx !== null ? list[selectedBIdx]['nickNm'] : ''}</div>
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
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;

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

  .selected-title {
    color: #fff;
    font-size: 16px;
    letter-spacing: -0.4px;
    text-align: center;
    margin-bottom: 5px;
  }
  .selected-nickname {
    color: #fff;
    font-size: 14px;
    letter-spacing: -0.35px;
    text-align: center;
  }
`
