/**
 * @file /content/context-list.js
 * @brief 메인 라이브, 캐스트 리스트 component
 */
import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import Swiper from 'react-id-swiper'

//context
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'Context/color'

//components

export default props => {
  //---------------------------------------------------------------------
  //state
  const [slideInfo, setSlideInfo] = useState(props.Info)
  let mainSlider = {}

  const params = {
    loop: true,
    spaceBetween: 14,
    initialSlide: 6,
    on: {
      slideChange: function() {
        console.log('슬라이드 바뀌었을때')
        console.log(mainSlider)
        console.log(mainSlider.params.init)
      }
    }
  }
  const arraySlide = slideInfo.map((item, index) => {
    const {id, title, url, name, reco, category, popu, avata} = item
    return (
      <Slide key={index}>
        <img src={url}></img>
      </Slide>
    )
  })

  return (
    <Content>
      <MainSliderWrap>
        <Bg></Bg>
        <SliderItem>
          <Swiper
            {...params}
            getSwiper={e => {
              mainSlider = e
            }}>
            {arraySlide}
          </Swiper>
        </SliderItem>
      </MainSliderWrap>
    </Content>
  )
}

//---------------------------------------------------------------------
//styled

const Content = styled.section``

const MainSliderWrap = styled.div`
  overflow: hidden;
  position: relative;
  height: 658px;
`

const Bg = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 658px;
  text-align: center;

  &::before {
    display: inline-block;
    width: 920px;
    height: 920px;
    margin-top: -131px;
    background-color: ${COLOR_MAIN};
    border-radius: 50%;
    content: '';
  }
`

const SliderItem = styled.div`
  margin: 234px 0;
  .swiper-container {
    overflow: visible;
    width: 190px;
    height: 190px;
  }
  .swiper-slide {
    overflow: hidden;
    width: 190px;
    height: 190px;
    border-radius: 50%;
  }
`

const Slide = styled.div`
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
  }
`

const SwiperWrap = styled.div``
