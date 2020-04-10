import React, {useEffect, useState, useRef} from 'react'
import styled from 'styled-components'
import {useHistory} from 'react-router-dom'
//context
import Room, {RoomJoin} from 'context/room'
// component
import CustomSwiper from 'components/ui/swiper.js'

// static
import LiveIcon from '../static/ic_live.png'

let touchStartX = null
let touchEndX = null
let swiping = false
let touchStartStatus = false

export default props => {
  //context
  const {list} = props
  const [selectedBIdx, setSelectedBIdx] = useState(null)
  const selectedWrapRef = useRef()
  const slideWrapRef = useRef()

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

  const emojiSplitRegex = /([\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2694-\u2697]|\uD83E[\uDD10-\uDD5D])/g

  const touchStartEvent = e => {
    console.log(list.length)
    // if (Array.isArray(list) && list.length > 0) {
    touchStartStatus = true
    touchStartX = e.touches[0].clientX
    // }
  }

  const touchMoveEvent = e => {
    const slideWrapNode = slideWrapRef.current
    touchEndX = e.touches[0].clientX

    const baseWidth = slideWrapNode.clientWidth / 3
    const diff = touchEndX - touchStartX
    const calcX = `${-baseWidth + diff}px`

    slideWrapNode.style.transform = `translate3d(${calcX}, 0, 0)`
    slideWrapNode.style.transitionDuration = '0ms'
  }

  const touchEndEvent = e => {
    if (!touchEndX || !touchStartStatus || swiping) {
      return
    }

    const slideWrapNode = slideWrapRef.current
    const baseWidth = slideWrapNode.clientWidth / 3

    const halfBaseWidth = baseWidth / 2
    const diff = touchEndX - touchStartX
    const direction = diff > 0 ? 'right' : 'left'
    const absDiff = Math.abs(diff)
    console.log(halfBaseWidth, absDiff)

    const slidingTime = 300 // unit is ms

    const promiseSync = new Promise((resolve, reject) => {
      slideWrapNode.style.transitionTimingFunction = 'ease-in'
      slideWrapNode.style.transitionDuration = `${slidingTime}ms`

      if (absDiff >= halfBaseWidth) {
        if (direction === 'left') {
          slideWrapNode.style.transform = `translate3d(${-baseWidth * 2}px, 0, 0)`
        } else if (direction === 'right') {
          slideWrapNode.style.transform = `translate3d(0, 0, 0)`
        }
      } else {
        slideWrapNode.style.transform = `translate3d(${-baseWidth}px, 0, 0)`
      }
      setTimeout(() => resolve(), slidingTime)
    })

    promiseSync.then(() => {
      slideWrapNode.style.transitionDuration = '0ms'
    })
  }

  useEffect(() => {
    console.log('selected b idx', selectedBIdx)
  }, [selectedBIdx])

  return (
    <RecommendWrap>
      <Room />
      <div
        onClick={() => {
          // const data = list[selectedBIdx]
          // const {roomNo, memNo} = data
          // //상대방 페이지이동
          // if (roomNo === '') {
          //   window.location.href = `/mypage/${memNo}`
          // } else {
          //   RoomJoin(roomNo + '')
          // }
        }}
        ref={selectedWrapRef}
        className="selected-wrap"
        style={selectedBIdx !== null ? {backgroundImage: `url(${list[selectedBIdx]['bannerUrl']})`} : {}}>
        {/* {Array.isArray(list) && list.length > 0 && ( */}
        {/* <> */}
        <div
          ref={slideWrapRef}
          className="slide-wrap"
          onTouchStart={touchStartEvent}
          onTouchMove={touchMoveEvent}
          onTouchEnd={touchEndEvent}>
          <div
            className="broad-slide"
            style={
              selectedBIdx !== null
                ? {
                    backgroundImage: `url(${list[selectedBIdx - 1 >= 0 ? selectedBIdx - 1 : list.length - 1]['bannerUrl']})`
                  }
                : {backgroundColor: 'yellow'}
            }></div>
          <div
            className="broad-slide"
            style={
              selectedBIdx !== null ? {backgroundImage: `url(${list[selectedBIdx]['bannerUrl']})`} : {backgroundColor: 'green'}
            }></div>
          <div
            className="broad-slide"
            style={
              selectedBIdx !== null
                ? {
                    backgroundImage: `url(${list[selectedBIdx + 1 < list.length ? selectedBIdx + 1 : 0]['bannerUrl']})`
                  }
                : {backgroundColor: 'red'}
            }></div>
        </div>
        {/* </> */}
        {/* )} */}
        <img className="live-icon" src={LiveIcon} />
        {Array.isArray(list) && list.length > 0 && (
          <div className="counting">
            <span className="bold">{selectedBIdx + 1}</span>
            <span>{list ? `/ ${list.length}` : ''}</span>
          </div>
        )}
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
      <div className="selected-nickname">
        {selectedBIdx !== null
          ? list[selectedBIdx]['nickNm'].split(emojiSplitRegex).map((str, idx) => {
              // 🎉😝pqpq😝🎉
              // https://stackoverflow.com/questions/43242440/javascript-unicode-emoji-regular-expressions
              return <span key={`splited-${idx}`}>{str}</span>
            })
          : ''}
      </div>
    </RecommendWrap>
  )
}

const RecommendWrap = styled.div`
  .dalbit-swiper {
    .slide {
      border-radius: 50%;
      width: 48px;
      height: 48px;
      margin: 0 5px;
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
      background-color: #eee;
    }
    .slide-over {
      position: absolute;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      box-sizing: border-box;

      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
      background-color: #eee;
    }
  }

  .selected-wrap {
    position: relative;
    height: 120px;
    border-radius: 10px;
    margin: 0 16px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    overflow: hidden;

    .slide-wrap {
      position: absolute;
      width: 300%;
      height: 100%;
      transform: translate3d(-33.3334%, 0, 0);
      display: flex;
      flex-direction: row;

      .broad-slide {
        width: 33.3334%;
        height: 100%;
        border-radius: 10px;
      }
    }

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

    span {
      vertical-align: middle;
    }
  }
`
