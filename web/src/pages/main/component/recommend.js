import React, {useEffect, useState, useRef} from 'react'
import styled from 'styled-components'
import {useHistory} from 'react-router-dom'
//context
import Room, {RoomJoin} from 'context/room'
// component
import CustomSwiper from 'components/ui/swiper.js'

// static
import LiveIcon from '../static/ic_live.png'

export default props => {
  //---------------------------------------------------------------------
  //context
  let history = useHistory()
  const {list} = props
  const [selectedBIdx, setSelectedBIdx] = useState(null)
  const selectedWrapRef = useRef()

  if (Array.isArray(list) && list.length % 2 === 0) {
    list.pop()
  }

  const selectBroadcast = idx => {
    setSelectedBIdx(idx)
  }

  const clickSwipEvent = e => {
    const target = e.currentTarget
    const bIdx = Number(target.getAttribute('data-idx'))
    selectBroadcast(bIdx)
  }

  useEffect(() => {
    if (Array.isArray(list) && list.length) {
      setSelectedBIdx(Math.floor(list.length / 2))
    }
  }, [list])

  return (
    <RecommendWrap>
      <Room />
      <div
        onClick={() => {
          const data = list[selectedBIdx]
          const {roomNo, memNo} = data

          //상대방 페이지이동
          if (roomNo === '') {
            window.location.href = `/mypage/${memNo}`
          } else {
            RoomJoin(roomNo + '')
          }
        }}
        ref={selectedWrapRef}
        className="selected-wrap"
        style={selectedBIdx !== null ? {backgroundImage: `url(${list[selectedBIdx]['bannerUrl']})`} : {}}>
        <img className="live-icon" src={LiveIcon} />
        <div className="counting">
          <span className="bold">{list ? selectedBIdx + 1 : ''}</span>
          <span>{list ? `/ ${list.length}` : ''}</span>
        </div>
      </div>
      {list && (
        <CustomSwiper
          onSwipe={selectBroadcast}
          selectedBIdx={selectedBIdx}
          clickSwipEvent={clickSwipEvent}
          selectedWrapRef={selectedWrapRef}>
          {list.map((broadcast, idx) => {
            const {profImg} = broadcast
            return (
              <div className="slide" data-idx={idx} key={`b-${idx}`} style={{backgroundImage: `url(${profImg['thumb88x88']})`}}>
                <div className="slide-over" />
              </div>
            )
          })}
        </CustomSwiper>
      )}
      <div className="selected-title">{selectedBIdx !== null ? list[selectedBIdx]['title'] : ''}</div>
      <div className="selected-nickname">{selectedBIdx !== null ? list[selectedBIdx]['nickNm'] : ''}</div>
    </RecommendWrap>
  )
}

const RecommendWrap = styled.div`
  .dalbit-swiper {
    .slide,
    .slide-over {
      border-radius: 50%;
      width: 48px;
      height: 48px;
    }
    .slide {
      margin: 0 5px;
    }
    .slide-over {
      position: absolute;
      opacity: 0.3;
      background-color: #8556f6;
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
    transform: skew(-0.03deg);
  }
  .selected-nickname {
    color: #fff;
    font-size: 14px;
    letter-spacing: -0.35px;
    text-align: center;
    transform: skew(-0.03deg);
  }
`
