import React, {useEffect, useState, useRef} from 'react'
import styled from 'styled-components'

let touchStartX = null
let touchEndX = null
let swiping = false
let touchStartStatus = false
let autoIntervalId = null
let tempSelectedNode = null

export default props => {
  const {onSwipe, selectedBIdx, clickSwipEvent, selectedWrapRef} = props
  const swiperRef = useRef()
  const wrapperRef = useRef()

  const setInitClosureVariable = () => {
    clearAutoSlideInterval()

    touchStartX = null
    touchEndX = null
    swiping = false
    touchStartStatus = false
    autoIntervalId = null
  }

  const oneStepSlide = direction => {
    clearAutoSlideInterval()

    const childrenLength = props.children.length
    const swiperNode = swiperRef.current
    const wrapperNode = wrapperRef.current
    const moveBaseUnit = wrapperNode.clientWidth / childrenLength
    const centerMoveSize = (swiperNode.clientWidth - wrapperNode.clientWidth) / 2
    let moveSize = null

    if (direction === 'right') {
      moveSize = centerMoveSize + moveBaseUnit
    } else if (direction === 'left') {
      moveSize = centerMoveSize - moveBaseUnit
    }

    swiping = true
    wrapperNode.classList.add('animate')
    wrapperNode.style.transform = `translate3d(${moveSize}px, 0, 0)`

    setTimeout(() => {
      wrapperNode.classList.remove('animate')
      if (direction === 'right') {
        // right swipe
        const l_child = wrapperNode.lastChild
        if (l_child) {
          const cloned = l_child.cloneNode(true)
          const f_child = wrapperNode.firstChild

          cloned.addEventListener('click', clickSwipEvent)
          wrapperNode.insertBefore(cloned, f_child)

          l_child.removeEventListener('click', clickSwipEvent)
          wrapperNode.removeChild(l_child)
        }
      } else if (direction === 'left') {
        // left swipe
        const f_child = wrapperNode.firstChild
        if (f_child) {
          const cloned = f_child.cloneNode(true)

          cloned.addEventListener('click', clickSwipEvent)
          wrapperNode.appendChild(cloned)

          f_child.removeEventListener('click', clickSwipEvent)
          wrapperNode.removeChild(f_child)
        }
      }
      if (childrenLength > 0) {
        const centerNodeIdx = Math.floor(childrenLength / 2)
        const targetNode = wrapperNode.childNodes[centerNodeIdx]
        const bIdx = Number(targetNode.getAttribute('data-idx'))
        onSwipe(bIdx)

        wrapperNode.style.transform = `translate3d(${centerMoveSize}px, 0, 0)`
        touchStartX = null
        touchEndX = null
        swiping = false
      }

      autoSlideInterval()
    }, 300)
  }

  const autoSlideInterval = () => {
    if (props.children.length) {
      autoIntervalId = setInterval(() => {
        oneStepSlide('left')
      }, 3000)
    }
  }

  const clearAutoSlideInterval = () => {
    if (autoIntervalId !== null) {
      clearInterval(autoIntervalId)
      autoIntervalId = null
    }
  }

  const touchStartEvent = e => {
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

    if (diff > 0) {
      oneStepSlide('right')
    } else {
      oneStepSlide('left')
    }
  }

  const touchCancelEvent = () => {}

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
    if (wrapperNode) {
      wrapperNode.childNodes.forEach(child => {
        child.removeEventListener('click', clickSwipEvent)
      })
    }
  }

  const setTouchEventSelectedWrap = () => {
    const selectedWrapNode = selectedWrapRef.current
    tempSelectedNode = selectedWrapNode
    selectedWrapNode.addEventListener('touchstart', touchStartEvent)
    selectedWrapNode.addEventListener('touchmove', touchMoveEvent)
    selectedWrapNode.addEventListener('touchend', touchEndEvent)
  }

  const removeTouchEventSelectedWrap = () => {
    if (tempSelectedNode) {
      tempSelectedNode.removeEventListener('touchstart', touchStartEvent)
      tempSelectedNode.removeEventListener('touchmove', touchMoveEvent)
      tempSelectedNode.removeEventListener('touchend', touchEndEvent)
    }
    tempSelectedNode = null
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
    const wrapperNode = wrapperRef.current
    const middleIdx = Math.floor(wrapperNode.children.length / 2)
    wrapperNode.childNodes.forEach((child, idx) => {
      if (middleIdx === idx) {
        child.firstChild.style.opacity = 0
      } else {
        child.firstChild.style.opacity = 1
        child.firstChild.style.backgroundColor = 'rgba(117,65,241, 0.6)'
      }
    })
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
  }
`
