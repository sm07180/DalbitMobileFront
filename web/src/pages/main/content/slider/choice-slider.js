/**
 * @file choice-slider.js
 * @brief 메인페이지-최상단-방송추천 슬라이더
 */
import React, {useState} from 'react'
import Swiper from 'react-id-swiper'
import styled from 'styled-components'
import {DEVICE_MOBILE} from 'Context/config'

export default props => {
  const [ChoiceInfo, setChoiceInfo] = useState(props.Info)

  const arraySlide = ChoiceInfo.map(item => {
    return (
      <Slide key={item.id}>
        <ImgBox>
          <Img src={item.url} alt={item.name} title={item.name} />
        </ImgBox>
        <ImgInfo>
          <RecoBj>추천 BJ</RecoBj>
          <RecoTitle>{item.title}</RecoTitle>
          <RecoBjName>BJ {item.name}</RecoBjName>
          <RecoDetail>
            <RecoPeople>{item.people}명 시청중</RecoPeople>
            <RecoLike>{item.like}명 좋아요</RecoLike>
          </RecoDetail>
        </ImgInfo>
      </Slide>
    )
  })

  const params = {
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    }
  }
  return (
    <>
      <SliderWrap>
        <Swiper {...params}>{arraySlide}</Swiper>
      </SliderWrap>
    </>
  )
}

/**
 * @brief 초이스-슬라이더 내부컴포넌트 css
 * @code
 **/
const SliderWrap = styled.div`
  width: 76%;
  height: 100%;
  background-color: white;
  font-size: 20px;
  font-weight: bold;
  padding: 10px;
  float: left;
  box-sizing: border-box;
  @media (max-width: ${DEVICE_MOBILE}) {
    width: 100%;
    height: 60%;
  }
  @media (max-width: 420px) {
    padding: 10px 0;
  }
  & .swiper-container {
    height: 100%;
  }
  & .swiper-container-horizontal > .swiper-pagination-bullets {
    width: auto;
    left: auto;
    right: calc(15% + 10px);
  }
`
/**
 * @brief 슬라이더 map css
 * @code
 **/
const Slide = styled.div`
  &:after {
    content: '';
    clear: both;
    display: block;
  }
`
const ImgBox = styled.div`
  width: 60%;
  height: 100%;
  margin-right: 5%;
  float: left;
  @media (max-width: ${DEVICE_MOBILE}) {
    width: 50%;
  }
  @media (max-width: 420px) {
    margin-right: 2%;
  }
`
const Img = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 20px;
`
const ImgInfo = styled.div`
  width: 30%;
  margin-right: 5%;
  float: left;
  @media (max-width: ${DEVICE_MOBILE}) {
    width: 40%;
  }
  @media (max-width: 420px) {
    width: 46%;
    margin-right: 2%;
  }
`
const RecoBj = styled.span`
  width: 80px;
  height: 30px;
  line-height: 30px;
  color: white;
  background-color: lightcoral;
  font-size: 14px;
  font-weight: normal;
  text-align: center;
  display: block;
  border-radius: 20px;
  @media (max-width: ${DEVICE_MOBILE}) {
    width: 60px;
    height: 20px;
    line-height: 20px;
  }
`
const RecoTitle = styled.h2`
  font-size: 18px;
  padding: 10px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  @media (max-width: ${DEVICE_MOBILE}) {
    padding: 6px 0;
  }
`
const RecoBjName = styled.h3`
  color: darkblue;
  font-size: 15px;
  text-align: right;
  font-weight: bold;
  margin: 10px 0;
  @media (max-width: ${DEVICE_MOBILE}) {
    margin: 6px 0;
  }
`
const RecoDetail = styled.div`
  text-align: left;
  margin: 20px 0;
`
const RecoPeople = styled.span`
  width: 50%;
  font-size: 14px;
  text-align: center;
  display: block;
  float: left;
  position: relative;
  @media (max-width: ${DEVICE_MOBILE}) {
    padding-left: 12px;
    box-sizing: border-box;
  }
  &:before {
    content: 'P';
    width: 20px;
    height: 20px;
    line-height: 20px;
    color: yellow;
    background-color: skyblue;
    text-align: center;
    display: block;
    position: absolute;
    left: 0px;
    border-radius: 50%;
    @media (max-width: ${DEVICE_MOBILE}) {
      line-height: 16px;
    }
    @media (max-width: 420px) {
      line-height: 12px;
    }
  }
`
const RecoLike = styled.span`
  width: 50%;
  font-size: 14px;
  text-align: center;
  display: block;
  float: left;
  position: relative;
  @media (max-width: ${DEVICE_MOBILE}) {
    padding-left: 14px;
    box-sizing: border-box;
  }
  &:before {
    content: '♥';
    width: 20px;
    height: 20px;
    line-height: 20px;
    color: white;
    background-color: red;
    text-align: center;
    display: block;
    position: absolute;
    left: 0px;
    border-radius: 50%;
    @media (max-width: ${DEVICE_MOBILE}) {
      line-height: 16px;
    }
    @media (max-width: 420px) {
      line-height: 12px;
    }
  }
`
