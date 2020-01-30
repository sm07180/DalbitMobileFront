/**
 * @file /content/context-list.js
 * @brief 메인 라이브, 캐스트 리스트 component
 *
 */
import React, {useState} from 'react'
import Swiper from 'react-id-swiper'
import styled from 'styled-components'
import ContentBox from './contentBox'
import {WIDTH_MOBILE} from 'Context/config'
import {WIDTH_TABLET} from 'Context/config'
import {WIDTH_PC} from 'Context/config'
import {COLOR_WHITE} from 'Context/color'
import creatIcon from 'Components/ui/icon'
import {object} from 'prop-types'
import {setState} from 'expect/build/jestMatchersObject'
export default props => {
  const [slideInfo, setSlideInfo] = useState(props.Info)
  const [sswiper, updateSwiper] = useState(true)

  const stopToggle = () => {
    if (sswiper.autoplay.paused == true) {
      sswiper.autoplay.run()
    } else if (sswiper.autoplay.running == true) {
      sswiper.autoplay.pause()
    }
    console.log(sswiper)
  }
  const params = {
    slidesPerView: 3,
    spaceBetween: 30,
    slidesPerGroup: 3,
    slidesPerColumn: 2,
    slidesPerColumnFill: 'row',
    autoplay: {
      delay: 2000
    },

    breakpoints: {
      0: {
        slidesPerView: 1,
        slidesPerGroup: 1,
        slidesPerColumn: 2,
        spaceBetween: -9
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
    // console.log(item)
    const {id, title, url, name, reco, category, popu, avata, people, like} = item
    //-----------------------------------------------------------------------
    return (
      <Slide key={index}>
        <ContentBox {...item}>
          <ImgBox bg={url}>
            {/* {reco !== undefined ? <Reco>{reco}</Reco> : ''} */}
            <IconBox>
              {reco && <Reco>{reco}</Reco>}
              {popu && <Popu>{popu}</Popu>}
            </IconBox>
            {avata && <Avata bg={avata}></Avata>}
          </ImgBox>
          <Info>
            <Category>{category}</Category>
            <Title>{title}</Title>
            <Name>{name}</Name>
            <People>
              {creatIcon('headphone', '#bdbdbd', 30, 30)}
              <span>{people}</span>
              {creatIcon('like', '#bdbdbd', 30, 30)}
              <span>{like}</span>
            </People>
          </Info>
        </ContentBox>
      </Slide>
    )
  })
  return (
    <>
      <SwiperWrap>
        <ToggleBtn onClick={stopToggle}></ToggleBtn>
        <Stitle>인기 DJ</Stitle>
        <SliderControl></SliderControl>
        <Swiper {...params} getSwiper={updateSwiper}>
          {arraySlide}
        </Swiper>
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
    margin-top: 37px;
  }
  & .swiper-button-prev,
  .swiper-button-next {
    top: 0;
    margin-top: 0;
    width: 36px;
    height: 36px;
    /* padding: 12.5px 15px; */
    box-sizing: border-box;
    background-position: center center;
    background-size: 6.3px 11.5px;
  }
  & .swiper-button-prev {
    left: calc(50% + 22px);
  }
  & .swiper-button-next {
    left: calc(50% + 94px);
  }
  @media (max-width: ${WIDTH_PC}) {
    width: 63.02%;
  }
  @media (max-width: ${WIDTH_TABLET}) {
    width: 95.47%;
  }
  @media (max-width: ${WIDTH_MOBILE}) {
    width: 91.11%;
  }
`

const Stitle = styled.h2`
  display: block;
  width: 50%;
  text-align: right;
  font-size: 34px;
  line-height: 1.15;
  color: #8556f6;
`
const SliderControl = styled.div`
  position: absolute;
  top: 0;
  left: calc(50% + 16px);
  height: 38px;
  width: 120px;
  border: 1px solid #8556f6;
  border-radius: 18px;
  box-sizing: border-box;
`
const ToggleBtn = styled.div`
  position: absolute;
  top: 0;
  z-index: 9999;
  left: calc(50% + 60px);
  width: 36px;
  height: 36px;
  background: url('https://cdn.iconscout.com/icon/free/png-256/pause-38-204304.png') no-repeat center center / cover;
  cursor: pointer;
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
  max-height: 46px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  word-wrap: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
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
  position: relative;
`
const Avata = styled.div`
  position: absolute;
  height: 42.1%;
  right: 0;
  bottom: 0;
  width: 42.1%;
  background: url(${props => props.bg}) no-repeat center center / cover;
`
const IconBox = styled.div`
  position: absolute;
  top: 6px;
  left: 0;
  width: 100%;
  height: 28px;
`
const Reco = styled.span`
  display: inline-block;
  font-size: 14px;
  width: 25.26%;
  height: 28px;
  line-height: 28px;
  background-color: #fff;
  margin-left: 5px;
  text-align: center;
  color: #8556f6;
`
const Popu = styled.span`
  display: inline-block;
  font-size: 14px;
  width: 25.26%;
  height: 28px;
  line-height: 28px;
  text-align: center;
  margin-left: 5px;
  background-color: #fff;
  color: #e84d6f;
`

const Info = styled.div`
  width: 51.77%;
  padding: 8px 20px 11px 20px;
  box-sizing: border-box;
  float: left;
`
const People = styled.div`
  width: 100%;
  height: 30px;
  margin-top: 55px;
  & span {
    font-size: 14px;
    line-height: 30px;
    padding-left: 9px;
    box-sizing: border-box;
    margin-right: 4px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: -0.35px;
    text-align: left;
    color: #bdbdbd;
  }
  & span:last-child {
    margin-right: 0;
  }
`
