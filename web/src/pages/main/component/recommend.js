import React, {useEffect, useState, useRef} from 'react'
import styled from 'styled-components'

//context
import Room, {RoomJoin} from 'context/room'
// component
import CustomSwiper from 'components/ui/swiper.js'

// static
import LiveIcon from '../static/ic_live.png'
import EventIcon from '../static/ic_event.png'

let touchStartX = null
let touchEndX = null
let touchStartStatus = false
let direction = null

export default props => {
  const {list} = props
  const [selectedBIdx, setSelectedBIdx] = useState(null)
  const slideWrapRef = useRef()

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
    if (Array.isArray(list) && list.length > 1) {
      touchStartStatus = true
      touchStartX = e.touches[0].clientX
    }
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
    if (!touchEndX || !touchStartStatus) {
      return
    }

    const slideWrapNode = slideWrapRef.current
    const baseWidth = slideWrapNode.clientWidth / 3

    const halfBaseWidth = baseWidth / 2
    const diff = touchEndX - touchStartX
    direction = diff > 0 ? 'right' : 'left'
    const absDiff = Math.abs(diff)

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

    promiseSync
      .then(() => {
        slideWrapNode.style.transitionDuration = '0ms'
        touchStartStatus = false
      })
      .then(() => {
        if (absDiff >= halfBaseWidth) {
          if (direction === 'right') {
            const targetBIdx = Number(slideWrapNode.firstChild.getAttribute('b-idx'))
            setSelectedBIdx(targetBIdx)
          } else if (direction === 'left') {
            const targetBIdx = Number(slideWrapNode.lastChild.getAttribute('b-idx'))
            setSelectedBIdx(targetBIdx)
          }
        }
      })
  }

  if (slideWrapRef.current) {
    slideWrapRef.current.style.transform = 'translate3d(-33.3334%, 0, 0)'
  }

  useEffect(() => {
    const swiperNode = document.getElementsByClassName('dalbit-swiper')[0]
    if (swiperNode && direction !== null) {
      const wrapperNode = swiperNode.firstChild

      if (direction === 'right') {
        const l_child = wrapperNode.lastChild
        if (l_child) {
          const cloned = l_child.cloneNode(true)
          cloned.addEventListener('click', clickSwipEvent)
          const f_child = wrapperNode.firstChild
          wrapperNode.insertBefore(cloned, f_child)
          l_child.removeEventListener('click', clickSwipEvent)
          wrapperNode.removeChild(l_child)
        }
      } else if (direction === 'left') {
        const f_child = wrapperNode.firstChild
        if (f_child) {
          const cloned = f_child.cloneNode(true)
          cloned.addEventListener('click', clickSwipEvent)
          wrapperNode.appendChild(cloned)
          f_child.removeEventListener('click', clickSwipEvent)
          wrapperNode.removeChild(f_child)
        }
      }

      const childrenLength = wrapperNode.children.length
      if (childrenLength > 0) {
        const middleIdx = Math.floor(childrenLength / 2)
        wrapperNode.childNodes.forEach((child, idx) => {
          if (middleIdx === idx) {
            child.firstChild.style.opacity = 0
          } else {
            child.firstChild.style.opacity = 1
            child.firstChild.style.backgroundColor = 'rgba(117,65,241, 0.6)'
          }
        })
      }

      touchStartX = null
      touchEndX = null
      touchStartStatus = false
      direction = null
    }
  }, [selectedBIdx])

  if (selectedBIdx === null) {
    return null
  }

  const prevBIdx = selectedBIdx - 1 >= 0 ? selectedBIdx - 1 : list.length - 1
  const nextBIdx = selectedBIdx + 1 < list.length ? selectedBIdx + 1 : 0

  const clickSlideDisplay = data => {
    const {roomType} = data
    if (roomType === 'link') {
      const {roomNo} = data
      if (roomNo !== '') {
        window.location.href = roomNo
      }
    }
  }

  return (
    <RecommendWrap>
      <Room />
      <div onClick={() => {}} className="selected-wrap">
        {Array.isArray(list) && list.length > 0 && (
          <>
            <div
              ref={slideWrapRef}
              className="slide-wrap"
              onTouchStart={touchStartEvent}
              onTouchMove={touchMoveEvent}
              onTouchEnd={touchEndEvent}>
              <div
                className="broad-slide"
                b-idx={prevBIdx}
                style={{backgroundImage: `url(${list[prevBIdx]['bannerUrl']})`}}
                onClick={() => clickSlideDisplay(list[prevBIdx])}
              />
              <div
                className="broad-slide"
                b-idx={selectedBIdx}
                style={{backgroundImage: `url(${list[selectedBIdx]['bannerUrl']})`}}
                onClick={() => clickSlideDisplay(list[selectedBIdx])}
              />
              <div
                className="broad-slide"
                b-idx={nextBIdx}
                style={{backgroundImage: `url(${list[nextBIdx]['bannerUrl']})`}}
                onClick={() => clickSlideDisplay(list[nextBIdx])}
              />
            </div>
          </>
        )}
        {list[selectedBIdx]['nickNm'] !== 'banner' ? (
          <img className="live-icon" src={LiveIcon} />
        ) : (
          <img className="live-icon" src={EventIcon} />
        )}
        {Array.isArray(list) && list.length > 0 && (
          <div className="counting">
            <span className="bold">{selectedBIdx + 1}</span>
            <span>{list ? `/ ${list.length}` : ''}</span>
          </div>
        )}
      </div>
      {list && (
        <CustomSwiper onSwipe={selectBroadcast} selectedBIdx={selectedBIdx}>
          {list.map((broadcast, idx) => {
            const {profImg} = broadcast
            return (
              <div className="slide" data-idx={idx} key={`b-${idx}`} style={{backgroundImage: `url(${profImg['url']})`}}>
                <div className="slide-over" />
              </div>
            )
          })}
        </CustomSwiper>
      )}
      <div className="selected-title">{list[selectedBIdx]['title']}</div>
      {list[selectedBIdx]['nickNm'] !== 'banner' && (
        <div className="selected-nickname">
          {list[selectedBIdx]['nickNm'].split(emojiSplitRegex).map((str, idx) => {
            // 🎉😝pqpq😝🎉
            // https://stackoverflow.com/questions/43242440/javascript-unicode-emoji-regular-expressions
            return <span key={`splited-${idx}`}>{str}</span>
          })}
        </div>
      )}
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
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
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
    color: #febd56;
    font-size: 14px;
    letter-spacing: -0.35px;
    text-align: center;
    transform: skew(-0.03deg);

    span {
      vertical-align: middle;
    }
  }
`
