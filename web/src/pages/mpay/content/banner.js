/**
 * @file banner.js
 * @brief 스토어 상단 배너
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
    const {imgUrlMo, imgUrl, alt} = item
    //-----------------------------------------------------------------------
    return (
      <Slide key={index}>
        <img src={imgUrl} alt={alt} className="pc" />
        <img src={imgUrlMo} alt={alt} className="mo" />
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
    height: auto;
    /* cursor: pointer; */
  }
  & .swiper-wrapper {
    height: auto;
  }
  & .swiper-pagination {
    position: static;
    margin-top: 14px;
    @media (max-width: ${WIDTH_MOBILE}) {
      margin-top: 10px;
    }
  }
  & .swiper-pagination-bullet {
    width: 8px;
    height: 8px;
    background: #bdbdbd;
    opacity: 1;
  }
  & .swiper-pagination-bullet-active {
    background: ${COLOR_MAIN};
    opacity: 1;
  }
`

const Slide = styled.a`
  img {
    width: 100%;

    &.mo {
      display: none;
    }
  }

  @media (max-width: ${WIDTH_TABLET_S}) {
    img {
      &.mo {
        display: block;
      }
      &.pc {
        display: none;
      }
    }
  }
`
//data
const slideInfo = [
  {
    alt: '모바일 10% 할인쿠폰 모바일 어플로 구매하면 할인쿠폰 증정!',
    imgUrl: `${IMG_SERVER}/images/api/111111@2x.jpg`,
    imgUrlMo: `${IMG_SERVER}/images/api/1111mo@2x.jpg`
  },
  {
    alt: '모바일 10% 할인쿠폰 모바일 어플로 구매하면 할인쿠폰 증정!',
    imgUrl: `${IMG_SERVER}/images/api/111111@2x.jpg`,
    imgUrlMo: `${IMG_SERVER}/images/api/1111mo@2x.jpg`
  },
  {
    alt: '모바일 10% 할인쿠폰 모바일 어플로 구매하면 할인쿠폰 증정!',
    imgUrl: `${IMG_SERVER}/images/api/111111@2x.jpg`,
    imgUrlMo: `${IMG_SERVER}/images/api/1111mo@2x.jpg`
  }
]
