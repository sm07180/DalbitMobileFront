import React, {useEffect, useState, useRef} from 'react'
import styled from 'styled-components'

export default props => {
  console.log('props', props)

  const swiperRef = useRef()
  const wrapperRef = useRef()
  const [swiperStyle, setSwiperStyle] = useState(0)

  useEffect(() => {
    const swiperNode = swiperRef.current
    const wrapperNode = wrapperRef.current

    setSwiperStyle({
      swiperHeight: wrapperNode.clientHeight + 'px',
      wrapperTransform: `translate3d(${(swiperNode.clientWidth - wrapperNode.clientWidth) / 2}px, 0, 0)`
    })
  }, [])

  return (
    <Swiper swiperStyle={swiperStyle} ref={swiperRef}>
      <div className="wrapper" ref={wrapperRef}>
        {props.children}
      </div>
    </Swiper>
  )
}

const Swiper = styled.div`
  position: relative;
  overflow: hidden;
  height: ${props => props.swiperStyle.swiperHeight};

  .wrapper {
    position: absolute;
    display: flex;
    flex-direction: row;
    transform: ${props => props.swiperStyle.wrapperTransform};

    .slide {
    }
    .b-list {
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
      border-radius: 50%;
      width: 48px;
      height: 48px;
      margin: 0 5px;
      background-color: #eee;
    }
  }
`
