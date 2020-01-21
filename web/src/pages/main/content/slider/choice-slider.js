/**
 * @file choice-slider.js
 * @brief 메인페이지-최상단-방송추천 슬라이더
 */
import React, {useState} from 'react'
import Swiper from 'react-id-swiper'
import styled from 'styled-components'
import {WIDTH_TABLET} from 'Context/config'

export default props => {
  const [ChoiceInfo, setChoiceInfo] = useState(props.Info)

  const arraySlide = ChoiceInfo.map(item => {
    return (
      <Slide key={item.id}>
        {/* <ImgBox>
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
        </ImgInfo> */}
        <ImgBox>
          <Img src={item.url} alt={item.name} title={item.name} />
        </ImgBox>
        <ImgInfo>
          <InfoTop>
            <RecoBj>추천 BJ</RecoBj>
            <RecoTitle>{item.title}</RecoTitle>
            <RecoBjName>BJ {item.name}</RecoBjName>
          </InfoTop>
          <InfoBottom>
            <RecoPeople>{item.people}명 시청중</RecoPeople>
            <RecoLike>{item.like}명 좋아요</RecoLike>
          </InfoBottom>
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
  @media (max-width: ${WIDTH_TABLET}) {
    width: 100%;
    height: 60%;
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
  float: left;
  @media (max-width: ${WIDTH_TABLET}) {
    width: 40%;
  }
`
const Img = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 20px;
`
const ImgInfo = styled.div`
  width: 40%;
  height: 100%;
  float: left;
  @media (max-width: ${WIDTH_TABLET}) {
    width: 60%;
  }
`
const InfoTop = styled.div`
  width: 100%;
  height: 60%;
  padding-left: 20px;
  box-sizing: border-box;
  @media (max-width: ${WIDTH_TABLET}) {
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
  @media (max-width: ${WIDTH_TABLET}) {
  }
`
const RecoTitle = styled.h2`
  font-size: 18px;
  padding: 10px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  @media (max-width: ${WIDTH_TABLET}) {
    font-size: 16px;
  }
`
const RecoBjName = styled.h3`
  width: 80%;
  margin-left: 20%;
  color: darkblue;
  font-size: 15px;
  font-weight: bold;
  text-align: right;
  padding: 10px 0;
  box-sizing: border-box;
  @media (max-width: ${WIDTH_TABLET}) {
    font-size: 14px;
  }
`
const InfoBottom = styled.div`
  width: 100%;
  height: 40%;
  padding-left: 20px;
  box-sizing: border-box;
  @media (max-width: ${WIDTH_TABLET}) {
  }
`
const RecoPeople = styled.span`
  width: 50%;
  padding-left: 30px;
  box-sizing: border-box;
  font-size: 14px;
  display: block;
  float: left;
  position: relative;
  @media (max-width: ${WIDTH_TABLET}) {
    font-size: 12px;
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
    @media (max-width: ${WIDTH_TABLET}) {
    }
  }
`
const RecoLike = styled.span`
  width: 50%;
  padding-left: 30px;
  box-sizing: border-box;
  font-size: 14px;
  display: block;
  float: left;
  position: relative;
  @media (max-width: ${WIDTH_TABLET}) {
    font-size: 12px;
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
    @media (max-width: ${WIDTH_TABLET}) {
    }
  }
`
