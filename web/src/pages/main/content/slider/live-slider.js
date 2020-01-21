/**
 * @file live-slider.js
 * @brief 메인페이지-중간-라이브방송 슬라이더
 */
import React, {useState} from 'react'
import Swiper from 'react-id-swiper'
import styled from 'styled-components'
import {WIDTH_TABLET} from 'Context/config'
export default props => {
  const [LiveInfo, setLiveInfo] = useState(props.Info)
  const params = {
    breakpoints: {
      //0~599
      0: {
        slidesPerView: 1,
        spaceBetween: 0
      },
      //601~1024
      601: {
        slidesPerView: 2,
        spaceBetween: 10
      },
      960: {
        slidesPerView: 3,
        spaceBetween: 10
      },
      1280: {
        slidesPerView: 4,
        spaceBetween: 10
      },
      1440: {
        slidesPerView: 5,
        spaceBetween: 10
      }
    },

    autoplay: {
      delay: 2000,
      disableOnInteraction: false
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    }
  }
  const arraySlide = LiveInfo.map(item => {
    return (
      <Slide key={item.id}>
        {/* <Icon>{item.icon}</Icon>
        <Imgbox>
          <Img src={item.url} alt={item.name} title={item.name} />
        </Imgbox>
        <InfoBox>
          <InfoTitle>{item.title}</InfoTitle>
          <InfoBj>BJ {item.name}</InfoBj>
          <InfoDetail>
            <InfoPeople>{item.people}</InfoPeople>
            <InfoLike>{item.like}</InfoLike>
          </InfoDetail>
        </InfoBox> */}
        <Icon>{item.icon}</Icon>
        <Imgbox>
          <Img src={item.url} alt={item.name} title={item.name} />
        </Imgbox>
        <InfoBox>
          <InfoTop>
            <InfoTitle>{item.title}</InfoTitle>
            <InfoBj>BJ {item.name}</InfoBj>
          </InfoTop>
          <InfoBottom>
            <InfoPeople>{item.people}</InfoPeople>
            <InfoLike>{item.like}</InfoLike>
          </InfoBottom>
        </InfoBox>
      </Slide>
    )
  })
  return (
    <>
      <SlideWrap>
        <Title>실시간 LIVE</Title>
        <Swiper {...params}>{arraySlide}</Swiper>
      </SlideWrap>
    </>
  )
}
/**
 * @brief 내부컴포넌트 css
 * @code
 **/
const SlideWrap = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
  & .swiper-container {
    height: 100%;
    & .swiper-wrapper {
      padding-top: 40px;
      box-sizing: border-box;
    }
    & .swiper-button-prev,
    .swiper-button-next {
      width: 16px;
      height: 28px;
      margin-top: auto;
      top: 0px;
      background-size: auto;
    }
  }
  & .swiper-button-prev {
    left: auto;
    right: 40px;
  }
`
const Title = styled.div`
  font-size: 24px;
  font-weight: bold;
  position: absolute;
  top: 0;
  left: 0;
  @media (max-width: 420px) {
    font-size: 16px;
  }
`
/**
 * @brief 라이브-슬라이더 내부컴포넌트 css
 * @code
 **/
const Slide = styled.div`
  height: 100%;
  background-color: whitesmoke;
`
const Icon = styled.div`
  width: 40px;
  height: 40px;
  line-height: 40px;
  font-size: 12px;
  color: white;
  font-weight: bold;
  text-align: center;
  background-color: skyblue;
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 50%;
  opacity: 0.85;
  &:nth-child(2n) {
    background-color: pink;
  }
`
const Imgbox = styled.div`
  height: 60%;
  @media (max-width: ${WIDTH_TABLET}) {
    /* height: 70%; */
  }
`
const Img = styled.img`
  width: 100%;
  height: 100%;
`
const InfoBox = styled.div`
  height: 40%;
  position: relative;
  &:before {
    content: '소통방송';
    width: 80px;
    height: 20px;
    line-height: 20px;
    color: #fff;
    background-color: coral;
    font-size: 14px;
    text-align: center;
    position: absolute;
    top: -30px;
    left: 0;
    border-radius: 20px;
    opacity: 0.8;
    @media (max-width: ${WIDTH_TABLET}) {
      /* line-height: 16px; */
    }
  }
  @media (max-width: ${WIDTH_TABLET}) {
    /* height: 30%; */
  }
`
const InfoTop = styled.div`
  width: 100%;
  height: 60%;
`
const InfoTitle = styled.h2`
  height: 80%;
  padding: 10px 0;
  font-size: 16px;
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  @media (max-width: ${WIDTH_TABLET}) {
    /* font-size: 16px;
    padding: 0;
    height: 30%;
    text-align: center; */
  }
`
const InfoBj = styled.h2`
  height: 20%;
  color: gray;
  font-size: 14px;
  font-weight: normal;
  padding-bottom: 6px;
  box-sizing: border-box;
  @media (max-width: ${WIDTH_TABLET}) {
    /* text-align: right;
    font-size: 16px; */
  }
`
const InfoBottom = styled.h2`
  height: 40%;
  font-size: 16px;
  padding: 10px 0;
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  @media (max-width: ${WIDTH_TABLET}) {
  }
`
const InfoPeople = styled.div`
  width: 50%;
  height: 100%;
  font-size: 14px;
  padding-left: 24px;
  display: inline-block;
  box-sizing: border-box;
  position: relative;
  @media (max-width: ${WIDTH_TABLET}) {
    font-size: 14px;
  }
  &:before {
    content: 'P';
    width: 20px;
    height: 20px;
    color: #fff;
    background-color: darkcyan;
    text-align: center;
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 50%;
    @media (max-width: ${WIDTH_TABLET}) {
      width: 18px;
      height: 18px;
    }
  }
`
const InfoLike = styled.div`
  width: 50%;
  height: 100%;
  font-size: 14px;
  padding-left: 24px;
  box-sizing: border-box;
  display: inline-block;
  position: relative;
  @media (max-width: ${WIDTH_TABLET}) {
    /* font-size: 10px; */
  }
  &:before {
    content: '♥';
    width: 20px;
    height: 20px;
    color: white;
    background-color: red;
    text-align: center;
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 50%;
    @media (max-width: ${WIDTH_TABLET}) {
      /* width: 18px;
      height: 18px; */
    }
  }
`
