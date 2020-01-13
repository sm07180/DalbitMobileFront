/**
 * @file rank-slider.js
 * @brief 메인페이지-상단-랭킹 슬라이더
 */
import React, {useState} from 'react'
import Swiper from 'react-id-swiper'
import styled from 'styled-components'
import {DEVICE_MOBILE} from 'Context/config'
export default props => {
  const [RankInfo, setLiveInfo] = useState(props.Info)
  const params = {
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    }
  }
  const arraySlide = RankInfo.map(item => {
    return (
      <Slide key={item.id}>
        {/* <ImgBox>
          <Img src={item.url} alt={item.name} title={item.name} />
        </ImgBox>
        <InfoBox>
          <InfoTiteR>BJ {item.name}</InfoTiteR>
          <RankBox>
            <RankGold>[{item.gold}]</RankGold>
            <RankHeart>[{item.like}]</RankHeart>
          </RankBox>
        </InfoBox> */}
        <ImgBox>
          <Img src={item.url} alt={item.name} title={item.name} />
        </ImgBox>
        <ImgInfo>
          <InfoTiteR>BJ {item.name}</InfoTiteR>
          <RankBox>
            <RankGold>[{item.gold}]</RankGold>
            <RankHeart>[{item.like}]</RankHeart>
          </RankBox>
        </ImgInfo>
      </Slide>
    )
  })
  return (
    <SliderWrap>
      <RankTitle>
        <StarRank>스타랭킹</StarRank>
        <StarHole href="#">전체보기</StarHole>
      </RankTitle>
      <Swiper {...params}>{arraySlide}</Swiper>
    </SliderWrap>
  )
}
/**
 * @brief rank slider 컴포넌트 css
 * @code
 **/

const SliderWrap = styled.div`
  width: 24%;
  height: 100%;
  background-color: #fff;
  padding: 20px 30px;
  float: left;
  box-sizing: border-box;
  @media (max-width: ${DEVICE_MOBILE}) {
    width: 100%;
    height: 40%;
  }
  & .swiper-container {
    height: 86%;
    & .swiper-button-prev,
    .swiper-button-next {
      width: 1.5vw;
      height: 3vh;
      background-size: auto;
      top: 30%;
      @media (max-width: ${DEVICE_MOBILE}) {
        width: 20px;
        height: 22px;
        margin-top: auto;
        background-size: auto;
      }
    }
  }
`
const RankTitle = styled.div`
  height: 14%;
  width: 100%;
  font-size: 14px;
  text-align: center;
  @media (max-width: ${DEVICE_MOBILE}) {
    /* height: auto;
    font-size: 12px; */
  }
`
const StarRank = styled.h4`
  width: 50%;
  display: inline-block;
`
const StarHole = styled.h4`
  width: 50%;
  display: inline-block;
  position: relative;
  &:before {
    content: '+';
    width: 20px;
    height: 20px;
    font-size: 14px;
    display: block;
    position: absolute;
    top: 0;
    left: 10%;
    @media (max-width: ${DEVICE_MOBILE}) {
      display: none;
    }
  }
`
/**
 * @brief 슬라이더 map css
 * @code
 **/
const Slide = styled.div`
  @media (max-width: ${DEVICE_MOBILE}) {
    &:after {
      content: '';
      clear: both;
      display: block;
    }
    padding: 1% 20% 0 20%;
    box-sizing: border-box;
  }
`
const ImgBox = styled.div`
  width: 60%;
  height: 60%;
  margin: 0 auto;
  position: relative;
  &:before {
    content: 'TOP';
    width: 60px;
    height: 20px;
    line-height: 20px;
    font-size: 14px;
    font-weight: bold;
    color: blue;
    background-color: yellow;
    text-align: center;
    display: block;
    position: absolute;
    top: 0px;
    left: -20%;
    border-radius: 20px;
    z-index: 99;
    @media (max-width: ${DEVICE_MOBILE}) {
      /* width: 40px;
      height: 16px;
      line-height: 16px; */
    }
  }
  @media (max-width: ${DEVICE_MOBILE}) {
    width: 50%;
    height: 100%;
    float: left;
  }
`
const Img = styled.img`
  width: 100%;
  height: 100%;
  display: block;
`
const ImgInfo = styled.div`
  width: 100%;
  height: 40%;
  @media (max-width: ${DEVICE_MOBILE}) {
    width: 50%;
    height: 100%;
    float: left;
  }
`
const InfoTiteR = styled.h4`
  text-align: center;
  color: orangered;
  padding: 10px 0;
  box-sizing: border-box;
  height: 40%;
  @media (max-width: ${DEVICE_MOBILE}) {
    padding: 0;
    font-size: 14px;
  }
`
const RankBox = styled.div`
  width: 60%;
  height: 60%;
  font-size: 14px;
  text-align: center;
  margin: 0 auto;
  padding: 10px 0px;
  box-sizing: border-box;
  @media (max-width: ${DEVICE_MOBILE}) {
    width: 100%;
  }
`
const RankGold = styled.span`
  width: 50%;
  display: inline-block;
  padding-left: 20px;
  font-weight: bold;
  box-sizing: border-box;
  position: relative;
  &:before {
    content: 'G';
    width: 20px;
    height: 20px;
    line-height: 20px;
    color: white;
    position: absolute;
    left: 0px;
    top: 0;
    background-color: gold;
    border-radius: 50%;
    @media (max-width: ${DEVICE_MOBILE}) {
      /* line-height: 16px;
      left: 18%; */
    }
  }
  @media (max-width: 1440px) {
    font-size: 14px;
  }
  @media (max-width: ${DEVICE_MOBILE}) {
    display: block;
    margin: 0 auto;
  }
`
const RankHeart = styled.span`
  width: 50%;
  padding-left: 20px;
  font-weight: bold;
  display: inline-block;
  position: relative;
  box-sizing: border-box;
  &:before {
    content: '♥';
    width: 20px;
    height: 20px;
    line-height: 20px;
    color: white;
    background-color: red;
    position: absolute;
    left: 0px;
    top: 0;
    border-radius: 50%;
    @media (max-width: ${DEVICE_MOBILE}) {
      /* line-height: 16px;
      left: 18%; */
    }
  }
  @media (max-width: 1440px) {
    font-size: 14px;
  }
  @media (max-width: ${DEVICE_MOBILE}) {
    display: block;
    margin: 4px auto 0 auto;
  }
`
