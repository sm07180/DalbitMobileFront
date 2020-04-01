import React, {useEffect, useState, useRef} from 'react'
import styled from 'styled-components'

let touchStartX = null
let touchEndX = null
let swiping = false
let touchStartStatus = false
let autoIntervalId = null
let intervalBIdx = null

export default props => {
  const {onSwipe, selectedBIdx, clickSwipEvent, selectedWrapRef} = props
  const swiperRef = useRef()
  const wrapperRef = useRef()

  const setInitClosureVariable = () => {
    if (autoIntervalId !== null) {
      clearIntervalId(autoIntervalId)
    }

    touchStartX = null
    touchEndX = null
    swiping = false
    touchStartStatus = false
    autoIntervalId = null
    intervalBIdx = null
  }

  const touchStartEvent = e => {
    const swiperNode = swiperRef.current
    const wrapperNode = wrapperRef.current

    if (wrapperNode.clientWidth <= swiperNode.clientWidth) {
      touchStartStatus = false
      return
    }

    touchStartStatus = true
    touchStartX = e.touches[0].clientX
  }
  const touchMoveEvent = e => {
    touchEndX = e.touches[0].clientX
  }
  const touchEndEvent = e => {
    if (!touchEndX || !touchStartStatus || swiping) {
      return
    }

    const diff = touchEndX - touchStartX
    const minDiffSize = Math.abs(diff) < 80

    if (minDiffSize) {
      return
    }
    const childrenLength = props.children.length
    const swiperNode = swiperRef.current
    const wrapperNode = wrapperRef.current
    const moveBaseUnit = wrapperNode.clientWidth / childrenLength
    const centerMoveSize = (swiperNode.clientWidth - wrapperNode.clientWidth) / 2
    let moveSize = null

    if (diff > 0) {
      // right swipe
      moveSize = centerMoveSize + moveBaseUnit
    } else {
      // left swipe
      moveSize = centerMoveSize - moveBaseUnit
    }

    swiping = true
    wrapperNode.classList.add('animate')
    wrapperNode.style.transform = `translate3d(${moveSize}px, 0, 0)`

    setTimeout(() => {
      wrapperNode.classList.remove('animate')
      if (diff > 0) {
        // right swipe
        const l_child = wrapperNode.lastChild
        const cloned = l_child.cloneNode(true)
        const f_child = wrapperNode.firstChild

        cloned.addEventListener('click', clickSwipEvent)
        wrapperNode.insertBefore(cloned, f_child)

        l_child.removeEventListener('click', clickSwipEvent)
        wrapperNode.removeChild(l_child)
      } else {
        // left swipe
        const f_child = wrapperNode.firstChild
        const cloned = f_child.cloneNode(true)

        cloned.addEventListener('click', clickSwipEvent)
        wrapperNode.appendChild(cloned)

        f_child.removeEventListener('click', clickSwipEvent)
        wrapperNode.removeChild(f_child)
      }

      const centerNodeIdx = Math.floor(childrenLength / 2)
      const targetNode = wrapperNode.childNodes[centerNodeIdx]
      const bIdx = Number(targetNode.getAttribute('data-idx'))
      onSwipe(bIdx)

      wrapperNode.style.transform = `translate3d(${centerMoveSize}px, 0, 0)`
      swiping = false
      touchStartX = null
      touchEndX = null
    }, 300)
  }

  const touchCancelEvent = () => {}

  const autoSlideInterval = () => {
    if (autoIntervalId !== null) {
      clearIntervalId(autoIntervalId)
    }
    const swiperNode = swiperRef.current
    const wrapperNode = wrapperRef.current

    autoIntervalId = setInterval(() => {
      if (intervalBIdx !== null) {
        const childrenLength = props.children.length
        intervalBIdx = intervalBIdx + 1

        if (intervalBIdx === childrenLength) {
          intervalBIdx = 0
        }
        onSwipe(intervalBIdx)
      }
    }, 3000)
  }

  const initialSwipperWrapperStyle = () => {
    const swiperNode = swiperRef.current
    const wrapperNode = wrapperRef.current
    const centerMoveSize = (swiperNode.clientWidth - wrapperNode.clientWidth) / 2

    swiperNode.style.height = `${wrapperNode.clientHeight}px`
    wrapperNode.style.transform = `translate3d(${centerMoveSize}px, 0, 0)`
  }

  const setClickEventAllSlide = () => {
    const wrapperNode = wrapperRef.current
    wrapperNode.childNodes.forEach(child => {
      child.addEventListener('click', clickSwipEvent)
    })
  }

  const removeClickEventAllSlide = () => {
    const wrapperNode = wrapperRef.current
    wrapperNode.childNodes.forEach(child => {
      child.removeEventListener('click', clickSwipEvent)
    })
  }

  const setTouchEventSelectedWrap = () => {
    const selectedWrapNode = selectedWrapRef.current
    selectedWrapNode.addEventListener('touchstart', touchStartEvent)
    selectedWrapNode.addEventListener('touchmove', touchMoveEvent)
    selectedWrapNode.addEventListener('touchend', touchEndEvent)
  }

  const removeTouchEventSelectedWrap = () => {
    const selectedWrapNode = selectedWrapRef.current
    selectedWrapNode.removeEventListener('touchstart', touchStartEvent)
    selectedWrapNode.removeEventListener('touchmove', touchMoveEvent)
    selectedWrapNode.removeEventListener('touchend', touchEndEvent)
  }

  useEffect(() => {
    initialSwipperWrapperStyle()
    window.addEventListener('resize', initialSwipperWrapperStyle)
    setClickEventAllSlide()
    setTouchEventSelectedWrap()
    autoSlideInterval()

    return () => {
      window.removeEventListener('resize', initialSwipperWrapperStyle)
      removeClickEventAllSlide()
      removeTouchEventSelectedWrap()
      setInitClosureVariable()
    }
  }, [])

  useEffect(() => {
    intervalBIdx = selectedBIdx
    // console.log(intervalBIdx, selectedBIdx)
  }, [selectedBIdx])

  return (
    <Swiper
      className="dalbit-swiper"
      ref={swiperRef}
      onTouchStart={touchStartEvent}
      onTouchMove={touchMoveEvent}
      onTouchEnd={touchEndEvent}
      onTouchCancel={touchCancelEvent}>
      <div className="wrapper" ref={wrapperRef}>
        {props.children}
      </div>
    </Swiper>
  )
}

const Swiper = styled.div`
  position: relative;
  overflow: hidden;

  .wrapper {
    position: absolute;
    display: flex;
    flex-direction: row;
    padding: 10px 0;

    &.animate {
      transition: transform 0.2s ease-in;
    }

    .slide {
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
      border-radius: 50%;
      width: 48px;
      height: 48px;
      background-color: #eee;
    }
  }
`
