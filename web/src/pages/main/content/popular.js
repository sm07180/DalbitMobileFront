/**
 * @file /content/context-list.js
 * @brief 메인 라이브, 캐스트 리스트 component
 */
import React, {useState} from 'react'
import Swiper from 'react-id-swiper'
import styled from 'styled-components'
import ContentBox from './contentBox'
import {WIDTH_MOBILE} from 'Context/config'
import {WIDTH_TABLET} from 'Context/config'
import {WIDTH_PC} from 'Context/config'
import {COLOR_WHITE} from 'Context/color'
export default props => {
  const [slideInfo, setSlideInfo] = useState(props.Info)
  const params = {
    slidesPerView: 3,
    spaceBetween: 30,
    slidesPerGroup: 3,
    slidesPerColumn: 2,
    slidesPerColumnFill: 'row',

    breakpoints: {
      0: {
        slidesPerView: 1,
        slidesPerGroup: 1,
        slidesPerColumn: 2,
        spaceBetween: 0
      },
      //0까지
      601: {
        slidesPerView: 2,
        slidesPerColumn: 2,
        spaceBetween: 14
      },
      //601까지
      1281: {
        slidesPerView: 3,
        slidesPerColumn: 2,
        spaceBetween: 14
      }
      //1280까지
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    }
  }
  const arraySlide = slideInfo.map((item, index) => {
    console.log(item)
    const {id, title, url, name, people, category} = item
    console.log(url)
    return (
      <Slide key={index}>
        <ContentBox {...item}>
          <ImgBox bg={url}></ImgBox>
          <Info>
            <Category>{category}</Category>
            <Title>{title}</Title>
            <Name>{name}</Name>
          </Info>
        </ContentBox>
      </Slide>
    )
  })
  return (
    <>
      <SwiperWrap>
        <SlierTitle>인기 DJ</SlierTitle>
        <Swiper {...params}>{arraySlide}</Swiper>
      </SwiperWrap>
    </>
  )
}
const SwiperWrap = styled.div`
  width: 1210px;
  margin: 0 auto;
  position: relative;
  & .swiper-container {
    position: static;
  }
  & .swiper-button-prev,
  .swiper-button-next {
    top: 0;
    margin-top: 0;
    width: 36px;
    height: 36px;
    padding: 12px;
    box-sizing: border-box;
  }
  & .swiper-button-prev {
    left: calc(50% + 16px);
    background-size: 12px;
  }
  & .swiper-button-next {
    left: calc(50% + 52px);
    background-size: 12px;
  }
  @media (max-width: ${WIDTH_PC}) {
    width: 100%;
  }
  @media (max-width: ${WIDTH_TABLET}) {
    width: 100%;
  }
  @media (max-width: ${WIDTH_MOBILE}) {
    width: 100%;
  }
`
const SlierTitle = styled.h1`
  width: 50%;
  font-size: 34px;
  line-height: 1.15;
  letter-spacing: -0.85px;
  color: #8556f6;
  text-align: right;
`
const Slide = styled.div`
  width: 32.56%;
`
const Category = styled.span`
  display: block;
  font-size: 14px;
  font-weight: normal;
  letter-spacing: -0.35px;
  color: #bdbdbd;
`
const Title = styled.h2`
  font-size: 18px;
  letter-spacing: -0.45px;
  margin: 20px 0 8px 0;
  box-sizing: border-box;
`

const Name = styled.strong`
  display: block;
  font-size: 14px;
  font-weight: normal;
  letter-spacing: -0.35px;
  padding-right: 22px;
  box-sizing: border-box;
  color: #8556f6;
`

const ImgBox = styled.div`
  float: left;
  width: 48.22%;
  height: 100%;
  background: url(${props => props.bg}) no-repeat center center / cover;
`

const Info = styled.div`
  width: 51.77%;
  padding: 8px 20px 11px 20px;
  box-sizing: border-box;
  float: left;
`
const Imgbox = styled.div``
const InfoBox = styled.div``
const InfoTop = styled.div``
const InfoTitle = styled.div``
const InfoBj = styled.div``
const InfoBottom = styled.div``
const InfoPeople = styled.div``
const InfoLike = styled.div``
