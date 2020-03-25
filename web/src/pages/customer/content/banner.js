/**
 * @file banner.js
 * @brief 고객센터 상단 배너
 *
 */
import React, {useState, useRef} from 'react'
//swiper
import Swiper from 'react-id-swiper'
//styled-component
import styled from 'styled-components'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'

export default props => {
  //swiper customize
  const params = {
    slidesPerColumnFill: 'row',
    resistanceRatio: 0,
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    }
  }
  const BannerSlide = slideInfo.map((item, index) => {
    const {name, imgUrl} = item
    //-----------------------------------------------------------------------
    return (
      <Slide key={index} bg={imgUrl}>
        <h2>{name}</h2>
      </Slide>
    )
  })
  //--------------------------------------------------------------------------
  return (
    <>
      <Wrap>
        <Swiper {...params}>{BannerSlide}</Swiper>
      </Wrap>
    </>
  )
}
//style
//----------------------------------------------------------------------------
const Wrap = styled.div`
  & .swiper-slide {
    display: block;
    width: 100%;
    height: 120px;
  }
  & .swiper-wrapper {
    height: auto;
  }
  & .swiper-pagination {
    position: static;
    margin-top: 20px;
    @media (max-width: ${WIDTH_MOBILE}) {
      margin-top: 10px;
    }
  }
  & .swiper-pagination-bullet {
    width: 11px;
    height: 11px;
    background: #000000;
    opacity: 0.5;
  }
  & .swiper-pagination-bullet-active {
    background: ${COLOR_MAIN};
    opacity: 1;
  }
`

const Slide = styled.a`
  background: url(${props => props.bg}) no-repeat center center / cover;
  color: #fff;
`
//data
const slideInfo = [
  {
    name: '슬라이드1',
    imgUrl: `${IMG_SERVER}/images/api/customerBanner1.png`
  },
  {
    name: '슬라이드2',
    imgUrl: `${IMG_SERVER}/images/api/customerBanner1.png`
  },
  {
    name: '슬라이드3',
    imgUrl: `${IMG_SERVER}/images/api/customerBanner1.png`
  }
]
