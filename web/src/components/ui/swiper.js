import React, {useEffect, useState, useRef} from 'react'
import styled from 'styled-components'

let touchStartX = null
let touchEndX = null
let swiping = false
let touchStartStatus = false

export default props => {
  const swiperRef = useRef()
  const wrapperRef = useRef()

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
        wrapperNode.insertBefore(cloned, f_child)
        wrapperNode.removeChild(l_child)
      } else {
        // left swipe
        const f_Child = wrapperNode.firstChild
        const cloned = f_Child.cloneNode(true)
        wrapperNode.appendChild(cloned)
        wrapperNode.removeChild(f_Child)
      }

      wrapperNode.style.transform = `translate3d(${centerMoveSize}px, 0, 0)`
      swiping = false
      touchStartX = null
      touchEndX = null
    }, 500)
  }

  const touchCancelEvent = () => {}

  const initialSwipperWrapperStyle = () => {
    const swiperNode = swiperRef.current
    const wrapperNode = wrapperRef.current
    const centerMoveSize = (swiperNode.clientWidth - wrapperNode.clientWidth) / 2

    swiperNode.style.height = `${wrapperNode.clientHeight}px`
    wrapperNode.style.transform = `translate3d(${centerMoveSize}px, 0, 0)`
  }

  useEffect(() => {
    initialSwipperWrapperStyle()
    window.addEventListener('resize', initialSwipperWrapperStyle)
    return () => {
      window.removeEventListener('resize', initialSwipperWrapperStyle)
    }
  }, [])

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
      transition: transform 0.3s ease-in;
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
