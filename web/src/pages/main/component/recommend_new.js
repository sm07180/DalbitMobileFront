import React, {useEffect, useState, useRef, useContext} from 'react'
import styled from 'styled-components'
import Lottie from 'react-lottie'
import {Context} from 'context'
//context
import {useHistory} from 'react-router-dom'
import Room, {RoomJoin} from 'context/room'
// component
import {IMG_SERVER} from 'context/config'
import {Hybrid, isHybrid} from 'context/hybrid'

// static
import animationData from '../static/ic_live.json'
import EventIcon from '../static/ic_event.png'
import LiveIcon from '../static/live_l@3x.png'

let touchStartX = null
let touchEndX = null
let touchStartStatus = false
let direction = null

let intervalId = null
const intervalSec = 5000

export default (props) => {
  const context = useContext(Context)
  const {list} = props
  const history = useHistory()
  const [selectedBIdx, setSelectedBIdx] = useState(null)
  const [blobList, setBlobList] = useState([])
  const slideWrapRef = useRef()

  const emojiSplitRegex = /([\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2694-\u2697]|\uD83E[\uDD10-\uDD5D])/g

  const touchStartEvent = (e) => {
    if (touchStartStatus) {
      return
    }

    if (Array.isArray(list) && list.length > 1) {
      touchStartStatus = true
      touchStartX = e.touches[0].clientX

      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }

  const touchMoveEvent = (e) => {
    const slideWrapNode = slideWrapRef.current
    touchEndX = e.touches[0].clientX

    const baseWidth = slideWrapNode.clientWidth / 3
    const diff = touchEndX - touchStartX
    const calcX = `${-baseWidth + diff}px`

    slideWrapNode.style.transform = `translate3d(${calcX}, 0, 0)`
    slideWrapNode.style.transitionDuration = '0ms'
  }

  const touchEndEvent = (e) => {
    if (!touchEndX || !touchStartStatus) {
      return
    }

    const slideWrapNode = slideWrapRef.current
    const baseWidth = slideWrapNode.clientWidth / 3

    const halfBaseWidth = baseWidth / 16
    const diff = touchEndX - touchStartX
    direction = diff > 0 ? 'right' : 'left'
    const absDiff = Math.abs(diff)

    const slidingTime = 150 // unit is ms

    const promiseSync = new Promise((resolve, reject) => {
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
      if (absDiff >= halfBaseWidth) {
        if (direction === 'right') {
          const targetBIdx = Number(slideWrapNode.firstChild.getAttribute('b-idx'))
          setSelectedBIdx(targetBIdx)
        } else if (direction === 'left') {
          const targetBIdx = Number(slideWrapNode.lastChild.getAttribute('b-idx'))
          setSelectedBIdx(targetBIdx)
        }

        slideWrapNode.style.transitionDuration = '0ms'
        slideWrapNode.style.transform = 'translate3d(-33.3334%, 0, 0)'
        touchStartStatus = false
        initInterval()
      }
    })
  }

  const initInterval = () => {
    const slidingTime = 150 // unit is ms

    intervalId = setInterval(() => {
      const slideWrapNode = slideWrapRef.current
      const baseWidth = slideWrapNode.clientWidth / 3

      if (!touchStartStatus) {
        const promiseSync = new Promise((resolve, reject) => {
          touchStartStatus = true
          slideWrapNode.style.transitionDuration = `${slidingTime}ms`
          slideWrapNode.style.transform = `translate3d(${-baseWidth * 2}px, 0, 0)`
          setTimeout(() => resolve(), slidingTime)
        })

        promiseSync.then(() => {
          setSelectedBIdx((selectedBIdx) => {
            const nextIdx = selectedBIdx + 1
            if (nextIdx < list.length) {
              return nextIdx
            } else {
              return 0
            }
          })

          slideWrapNode.style.transitionDuration = '0ms'
          slideWrapNode.style.transform = 'translate3d(-33.3334%, 0, 0)'
          touchStartStatus = false
        })
      }
    }, intervalSec)
  }

  useEffect(() => {
    if (window.localStorage.getItem('bannerList') && window.localStorage.getItem('bannerList') !== 'undefined') {
      const list = JSON.parse(window.localStorage.getItem('bannerList'))
      list.forEach((url) => {
        if (url) {
          URL.revokeObjectURL(url)
        }
      })
      localStorage.removeItem('bannerList')
    }
  }, [])

  useEffect(() => {
    const tempBlobList = []
    if (Array.isArray(list) && list.length) {
      //setSelectedBIdx(Math.floor(list.length / 2))
      setSelectedBIdx(0)

      let count = 0
      list.forEach((line, idx) => {
        const {bannerUrl} = line
        fetch(bannerUrl)
          .then((res) => res.blob())
          .then((blob) => {
            count++
            const cacheUrl = URL.createObjectURL(blob)
            tempBlobList[idx] = cacheUrl
            if (count === list.length) {
              setBlobList(tempBlobList)
              localStorage.setItem('bannerList', JSON.stringify(tempBlobList))
            }
          })
          .catch(() => {
            count++
            if (count === list.length) {
              setBlobList(tempBlobList)
              localStorage.setItem('bannerList', JSON.stringify(tempBlobList))
            }
          })
      })

      initInterval()

      return () => {
        clearInterval(intervalId)
      }
    }
  }, [list])

  useEffect(() => {
    const swiperNode = document.getElementsByClassName('dalbit-swiper')[0]
    if (swiperNode && direction !== null) {
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
  //클릭 배너 이동
  const {customHeader, token} = context || Room.context
  const clickSlideDisplay = (data) => {
    console.debug(data);
    if (data.roomNo && data.roomNo !== undefined) {
      if (data.nickNm === "banner") {
        if (data.roomType === "link") {
          if (data.roomNo.startsWith("http://") || data.roomNo.startsWith("https://")) {
            window.location.href = `${data.roomNo}`;
          } else {
            history.push(`${data.roomNo}`);
          }
        } else {
          if(isHybrid()){
            Hybrid('openUrl',`${a.roomNo}`)
          }else{
            window.open(`${a.roomNo}`);
          }
        }
      } else {
        RoomJoin(data.roomNo)
      }
    }

    const {roomType, roomNo} = data

    if (roomType === 'link') {

      const {roomNo} = data
      context.action.updatenoticeIndexNum(roomNo)
      if (roomNo !== '' && !roomNo.startsWith('http')) {
        history.push(`${roomNo}`)
      } else if (roomNo !== '' && roomNo.startsWith('http')) {
        window.location.href = `${roomNo}`
      }
    } else {
      if (isHybrid() && roomNo) {
        RoomJoin(roomNo)
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
              onTouchEnd={touchEndEvent}
              onClick={() => clickSlideDisplay(list[selectedBIdx]) }>
              <div
                className="broad-slide"
                b-idx={prevBIdx}
                style={{backgroundImage: `url(${blobList[prevBIdx] ? blobList[prevBIdx] : list[prevBIdx]['bannerUrl']})`}}
                >
                {list[prevBIdx]['nickNm'] !== 'banner' && (
                  <div className="image-text-bundle">
                    <img className="image-wrap" src={list[prevBIdx]['profImg']['thumb120x120']} />
                    <div className="text-wrap">
                      <div className="selected-title">{list[prevBIdx]['title']}</div>
                      <div className="selected-nickname">
                        {list[prevBIdx]['nickNm'].split(emojiSplitRegex).map((str, idx) => {
                          // 🎉😝pqpq😝🎉
                          // https://stackoverflow.com/questions/43242440/javascript-unicode-emoji-regular-expressions
                          return <span key={`splited-${idx}`}>{str}</span>
                        })}
                      </div>
                    </div>
                    <div className="opacitybox"></div>
                  </div>
                )}
              </div>
              <div
                className="broad-slide"
                b-idx={selectedBIdx}
                style={{
                  backgroundImage: `url(${blobList[selectedBIdx] ? blobList[selectedBIdx] : list[selectedBIdx]['bannerUrl']})`
                }}
                >
                {list[selectedBIdx]['nickNm'] !== 'banner' && (
                  <div className="image-text-bundle">
                    <img className="image-wrap" src={list[selectedBIdx]['profImg']['thumb120x120']} />
                    <div className="text-wrap">
                      <div className="selected-title">{list[selectedBIdx]['title']}</div>
                      <div className="selected-nickname">
                        {list[selectedBIdx]['nickNm'].split(emojiSplitRegex).map((str, idx) => {
                          return <span key={`splited-${idx}`}>{str}</span>
                        })}
                      </div>
                    </div>
                    <div className="opacityBox"></div>
                  </div>
                )}
              </div>
              <div
                className="broad-slide"
                b-idx={nextBIdx}
                style={{backgroundImage: `url(${blobList[nextBIdx] ? blobList[nextBIdx] : list[nextBIdx]['bannerUrl']})`}}
                >
                {list[nextBIdx]['nickNm'] !== 'banner' && (
                  <div className="image-text-bundle">
                    <img className="image-wrap" src={list[nextBIdx]['profImg']['thumb120x120']} />
                    <div className="text-wrap">
                      <div className="selected-title">{list[nextBIdx]['title']}</div>
                      <div className="selected-nickname">
                        {list[nextBIdx]['nickNm'].split(emojiSplitRegex).map((str, idx) => {
                          return <span key={`splited-${idx}`}>{str}</span>
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* {list[selectedBIdx]['nickNm'] !== 'banner' ? (
          <span className="live-icon">
            <Lottie
              options={{
                width: 51,
                height: 16,
                loop: true,
                autoPlay: true,
                animationData: animationData
              }}
            />
          </span>
        ) : (
          <img className="live-icon" src={EventIcon} />
        )} */}

        {list[selectedBIdx]['isAdmin'] === false && list[selectedBIdx]['isSpecial'] && <em className="specialIcon">스페셜DJ</em>}
        {list[selectedBIdx]['isAdmin'] === true && <em className="adminIcon">운영자</em>}
        {list[selectedBIdx]['nickNm'] !== 'banner' && <img className="live-right-icon" src={LiveIcon} />}

        {Array.isArray(list) && list.length > 0 && (
          <div className="counting">
            <span className="bold">{selectedBIdx + 1}</span>
            <span>{list ? `/ ${list.length}` : ''}</span>
          </div>
        )}
      </div>
    </RecommendWrap>
  )
}

const RecommendWrap = styled.div`
  position: relative;
  height: 220px;

  .selected-wrap {
    position: relative;
    height: 220px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    overflow: hidden;

    .slide-wrap {
      transition: all 0ms cubic-bezier(0.26, 0.26, 0.69, 0.69) 0s;
      position: absolute;
      width: 300%;
      height: 100%;
      transform: translate3d(-33.3334%, 0, 0);
      display: flex;
      flex-direction: row;

      .broad-slide {
        position: relative;
        width: 33.3334%;
        height: 100%;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
      }

      ::after {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0px;
        bottom: 0px;
        background: rgba(0, 0, 0, 0.3);
      }
    }

    .live-icon {
      position: absolute;
      left: 8px;
      width: 51px;
    }

    .specialIcon {
      position: absolute;
      left: 8px;
      top: 8px;
      padding: 2px 7px;
      border-radius: 10px;
      background-color: #ec455f;
      color: #fff;
      font-size: 12px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.33;
      letter-spacing: normal;
      text-align: center;
    }

    .adminIcon {
      position: absolute;
      left: 8px;
      top: 8px;
      padding: 2px 7px;
      border-radius: 10px;
      background-color: #3386f2;
      color: #fff;
      font-size: 12px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.33;
      letter-spacing: normal;
      text-align: center;
    }

    .live-right-icon {
      position: absolute;
      top: 8px;
      right: 8px;
      width: 42px;
      height: 42px;
    }

    .counting {
      right: 2px;
      bottom: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      width: 46px;
      height: 16px;
      font-size: 10px;
      color: rgba(255, 255, 255, 0.5);

      .bold {
        color: #fff;
        margin-right: 4px;
      }
    }
  }

  .image-text-bundle {
    position: absolute;
    bottom: 10px;
    display: flex;
    width: 100%;
    flex-direction: row;
    align-items: center;
    z-index: 1;

    .image-wrap {
      display: block;
      width: 48px;
      height: 48px;
      margin-left: 16px;
      margin-right: 8px;
      border-radius: 50%;
    }

    .text-wrap {
      width: calc(100% - 72px);
    }
  }

  .selected-title {
    color: #fff;
    font-size: 18px;
    font-weight: bold;
    letter-spacing: -0.4px;
    /* text-align: center; */
    transform: skew(-0.03deg);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
  }
  .selected-nickname {
    color: #ffb300;
    font-size: 16px;
    font-weight: bold;
    letter-spacing: -0.35px;
    /* text-align: center; */
    transform: skew(-0.03deg);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;

    span {
      vertical-align: middle;
    }
  }
`
