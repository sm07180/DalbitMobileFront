/**
 * @file /content/context-list.js
 * @brief 메인 라이브, 캐스트 리스트 component
 *
 */
import React, {useState} from 'react'
import Swiper from 'react-id-swiper'
import styled from 'styled-components'
import ContentBox from './contentBox'
import {WIDTH_PC_S, WIDTH_TABLET_S, WIDTH_MOBILE} from 'context/config'
import {COLOR_WHITE} from 'context/color'
import creatIcon from 'components/ui/icon'
export default props => {
  const [slideInfo, setSlideInfo] = useState(props.Info)
  const [sswiper, updateSwiper] = useState(true)

  const stopToggle = () => {
    if (sswiper.autoplay.paused == true) {
      sswiper.autoplay.run()
    } else if (sswiper.autoplay.running == true) {
      sswiper.autoplay.pause()
    }
  }
  const params = {
    slidesPerColumnFill: 'row',
    resistanceRatio: 0,
    breakpoints: {
      0: {
        slidesPerView: 1,
        slidesPerGroup: 1,
        slidesPerColumn: 2,
        spaceBetween: -9
      },
      //0까지
      361: {
        slidesPerView: 2,
        slidesPerColumn: 2,
        spaceBetween: 0
      },

      //601까지
      841: {
        slidesPerView: 3,
        spaceBetween: 14,
        slidesPerGroup: 1,
        slidesPerColumn: 2
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
          </Info>
          <People>
            {creatIcon('headphone', '#bdbdbd', 30, 30)}
            <span>{people}</span>
            {creatIcon('like', '#bdbdbd', 30, 30)}
            <span>{like}</span>
          </People>
        </ContentBox>
      </Slide>
    )
  })
  return (
    <>
      <SwiperWrap>
        <ToggleBtn onClick={stopToggle}></ToggleBtn>
        <Stitle>나의 스타 방송</Stitle>
        <SliderControl></SliderControl>
        <Swiper {...params} getSwiper={updateSwiper}>
          {arraySlide}
        </Swiper>
      </SwiperWrap>
    </>
  )
}

const SwiperWrap = styled.div`
  width: 82.48%;
  margin: 79px auto 0 auto;
  position: relative;
  @media (max-width: ${WIDTH_PC_S}) {
    width: 94.53%;
  }
  @media (max-width: ${WIDTH_TABLET_S}) {
    width: 97.73%;
    margin: 76.5px 0 0 2.26%;
  }
  & .swiper-container {
    position: static;
    margin-top: 35px;
  }

  & .swiper-button-prev,
  .swiper-button-next {
    top: 0;
    margin-top: 0;
    width: 36px;
    height: 36px;
    box-sizing: border-box;
    @media (max-width: ${WIDTH_TABLET_S}) {
      display: none;
    }
  }
  & .swiper-button-prev {
    left: calc(50% + 22px);
    background: url('https://devimage.dalbitcast.com/images/api/ico-prev.png') no-repeat center center / cover;
  }
  & .swiper-button-next {
    left: calc(50% + 94px);
    background: url('https://devimage.dalbitcast.com/images/api/ico-next.png') no-repeat center center / cover;
  }
`
const Stitle = styled.h2`
  font-size: 34px;
  font-weight: 800;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.15;
  letter-spacing: -0.85px;
  text-align: right;
  color: #8556f6;
  width: 50%;
  @media (max-width: ${WIDTH_TABLET_S}) {
    width: 100%;
    text-align: center;
  }
`
const SliderControl = styled.div`
  position: absolute;
  top: 0;
  left: calc(50% + 16px);
  height: 36px;
  width: 120px;
  border: 1px solid #8556f6;
  border-radius: 18px;
  box-sizing: border-box;
  @media (max-width: ${WIDTH_TABLET_S}) {
    display: none;
  }
`
const ToggleBtn = styled.div`
  position: absolute;
  top: 0;
  z-index: 9999;
  left: calc(50% + 58px);
  width: 36px;
  height: 36px;
  background: url('https://devimage.dalbitcast.com/images/api/ico-stop.png') no-repeat center center / cover;
  cursor: pointer;
  @media (max-width: ${WIDTH_TABLET_S}) {
    display: none;
  }
`
const Slide = styled.div`
  /* flex-basis: 32.4%; */
  @media (max-width: ${WIDTH_TABLET_S}) {
    margin-left: -1.6px;
  }
`
const Info = styled.div`
  width: 51.77%;
  padding: 2px 4.8% 30px 4.8%;
  box-sizing: border-box;
  float: left;
`
const Category = styled.span`
  display: block;
  font-size: 14px;
  letter-spacing: -0.35px;
  color: #bdbdbd;
  font-weight: 400;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.86;
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
  font-weight: 700;
  font-stretch: normal;
  letter-spacing: -0.45px;
  margin: 20px 0 9px 0;
  box-sizing: border-box;
`

const Name = styled.strong`
  display: block;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.43;
  letter-spacing: -0.35px;
  padding-right: 5.58%;
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
  font-weight: 700;
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
  font-weight: 700;
  line-height: 28px;
  text-align: center;
  margin-left: 5px;
  background-color: #fff;
  color: #e84d6f;
`

const People = styled.div`
  position: absolute;
  left: 53.29%;
  width: 89.69%;
  bottom: 30px;
  height: 30px;
  & span {
    font-size: 14px;
    line-height: 30px;
    padding-left: 1%;
    box-sizing: border-box;
    margin-right: 1%;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: -0.35px;
    text-align: left;
    color: #9e9e9e;
    transform: skew(-0.03deg);
  }
  & span:last-child {
    margin-right: 0;
  }
`
