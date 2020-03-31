import React, {useEffect, useState, useRef} from 'react'
import styled from 'styled-components'

export default props => {
  console.log('props', props)

  const wrapperRef = useRef()
  const [swiperHeight, setSwiperHeight] = useState(0)
  const {slideList, children} = props

  if (Array.isArray(slideList) && slideList.length % 2 === 0) {
    slideList.pop()
  }

  useEffect(() => {
    const {current} = wrapperRef
    setSwiperHeight(current.clientHeight + 'px')
  }, [slideList])

  return (
    <Swiper swiperHeight={swiperHeight}>
      <div className="wrapper" ref={wrapperRef}>
        {children}
      </div>
    </Swiper>
  )
}

const Swiper = styled.div`
  position: relative;
  overflow: hidden;
  height: ${props => props.swiperHeight};
  .wrapper {
    position: absolute;
    display: flex;
    flex-direction: row;

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
