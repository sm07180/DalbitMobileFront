/**
 * @file rank-slider.js
 * @brief 메인페이지-상단-랭킹 슬라이더
 */
import React, {useState} from 'react'
import Swiper from 'react-id-swiper'
import styled from 'styled-components'

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
        <ImgBox>
          <Img src={item.url} />
        </ImgBox>
        <InfoBox>
          <InfoTiteR>BJ {item.name}</InfoTiteR>
          <RankBox>
            <RankGold>[{item.gold}]</RankGold>
            <RankHeart>[{item.like}]</RankHeart>
          </RankBox>
        </InfoBox>
      </Slide>
    )
  })
  return (
    <>
      <SliderWrap>
        <RankTitle>
          <StarRank>스타랭킹</StarRank>
          <StarHole href="#">전체보기</StarHole>
        </RankTitle>
        <Swiper {...params}>{arraySlide}</Swiper>
      </SliderWrap>
    </>
  )
}
/**
 * @brief rank slider 컴포넌트 css
 * @code
 **/
const SliderWrap = styled.div`
  width: 24%;
  height: 100%;
  font-size: 20px;
  font-weight: bold;
  background-color: #fff;
  padding: 20px 30px;
  float: left;
  box-sizing: border-box;
  & .swiper-container {
    height: 86%;
    & .swiper-button-prev,
    .swiper-button-next {
      top: 30%;
    }
  }
`
const RankTitle = styled.div`
  height: 14%;
  font-size: 14px;
  text-align: center;
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
    font-size: 14px;
    display: inline-block;
    position: absolute;
    top: 0;
    left: 10%;
  }
`
/**
 * @brief 슬라이더 map css
 * @code
 **/
const Slide = styled.div`
  width: 100%;
  height: 100%;
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
    color: blue;
    background-color: yellow;
    text-align: center;
    display: block;
    position: absolute;
    top: 0px;
    left: -20px;
    border-radius: 20px;
    z-index: 99;
  }
`
const Img = styled.img`
  width: 100%;
  height: 100%;
`
const InfoBox = styled.div`
  height: 40%;
`
const InfoTiteR = styled.h4`
  text-align: center;
  color: orangered;
  padding: 10px 0;
  box-sizing: border-box;
`
const RankBox = styled.div`
  width: 60%;
  font-size: 12px;
  text-align: center;
  margin: 0 auto;
  padding: 10px 0px;
  box-sizing: border-box;
`
const RankGold = styled.span`
  width: 50%;
  display: inline-block;
  padding-left: 20px;
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
  }
`
const RankHeart = styled.span`
  width: 50%;
  padding-left: 20px;
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
  }
`
