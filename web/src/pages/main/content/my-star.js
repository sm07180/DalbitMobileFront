/**
 * @file /content/context-list.js
 * @brief 메인 라이브, 나의 스타 라이브component
 *
 */
import React, {useState, useRef} from 'react'
import Swiper from 'react-id-swiper'
import styled from 'styled-components'
import ContentBox from './my-star-contentBox'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'

export default props => {
  const [slideInfo, setSlideInfo] = useState(props.Info)
  const [sswiper, updateSwiper] = useState(true)

  //ref
  const prev = useRef(null) // 채팅창 스크롤 영역 선택자
  const next = useRef(null) // 채팅창 스크롤 영역 선택자

  const stopToggle = () => {
    if (sswiper.autoplay.paused == true) {
      sswiper.autoplay.run()
    } else if (sswiper.autoplay.running == true) {
      sswiper.autoplay.pause()
    }
  }

  const goNextSlide = () => {
    sswiper.slideNext()
  }

  const goPrevSlide = () => {
    sswiper.slidePrev()
  }

  const params = {
    slidesPerColumnFill: 'row',
    resistanceRatio: 0,
    breakpoints: {
      0: {
        slidesPerView: 1,
        slidesPerGroup: 1,
        spaceBetween: -9
      },
      //0까지
      601: {
        slidesPerView: 2,
        spaceBetween: 0
      },

      //601까지
      841: {
        slidesPerView: 3,
        spaceBetween: 14,
        slidesPerGroup: 1,
        slidesPerColumn: 1
      }
      //1280까지
    }

    // navigation: {
    //   nextEl: '.swiper-button-next',
    //   prevEl: '.swiper-button-prev'
    // }
  }
  const arraySlide = slideInfo.map((item, index) => {
    const {id, title, url, name, reco, category, popu, avata, people, like} = item
    //-----------------------------------------------------------------------
    return (
      <Slide key={index}>
        <ContentBox {...item}>
          <ImgBox bg={url}>
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
              <Viewer></Viewer>
              <span>{people}</span>
              <Lover></Lover>
              <span>{like}</span>
            </People>
          </Info>
        </ContentBox>
      </Slide>
    )
  })
  //////////////////////////////////////////////////
  return (
    <>
      <SwiperWrap>
        <div className="title-btn">
          <h2>나의 스타 방송</h2>
          <SliderControl>
            <button className="prev" onClick={goPrevSlide}>
              이전
            </button>
            <button className="stop" onClick={stopToggle}>
              중지
            </button>
            <button className="next" onClick={goNextSlide}>
              다음
            </button>
          </SliderControl>
        </div>
        <Swiper {...params} getSwiper={updateSwiper}>
          {arraySlide}
        </Swiper>
      </SwiperWrap>
    </>
  )
}

const SwiperWrap = styled.div`
  position: relative;
  padding: 60px 0 80px 0;

  .title-btn {
    display: flex;
    line-height: 36px;
    text-align: left;
    h2 {
      display: inline-block;
      margin-right: 18px;
      font-size: 28px;
      font-weight: 800;
      letter-spacing: -0.85px;
      color: ${COLOR_MAIN};
    }
  }

  & .swiper-container {
    overflow: hidden;
    position: static;
    margin-top: 35px;
    height: 190px;
    @media (max-width: ${WIDTH_MOBILE}) {
      height: 140px;
    }
  }

  & .swiper-button-prev,
  .swiper-button-next {
    top: 0;
    width: 36px;
    height: 36px;
    margin-top: 0;
    box-sizing: border-box;
    z-index: 2;
    @media (max-width: ${WIDTH_TABLET_S}) {
      display: none;
    }
  }
  & .swiper-button-prev {
    left: calc(50% + 22px);
    background: url('${IMG_SERVER}/images/api/ico-prev.png') no-repeat center center / cover;
  }
  & .swiper-button-next {
    left: calc(50% + 94px);
    background: url('${IMG_SERVER}/images/api/ico-next.png') no-repeat center center / cover;
  }

  @media (max-width: ${WIDTH_TABLET_S}) {
    padding: 40px 0 60px 0;
    .title-btn {
      h2 {
        font-size: 22px;
      }
    }
    & .swiper-container {
      margin-top: 20px;
    }
  }
`
const SliderControl = styled.div`
  width: 120px;
  height: 36px;
  margin: 0 0 0 auto;
  padding: 0 8px 0 11px;
  border: 1px solid ${COLOR_MAIN};
  border-radius: 18px;
  box-sizing: border-box;

  button {
    width: 33px;
    height: 36px;
    text-indent: -9999px;

    &.prev {
      background: url(${IMG_SERVER}/images/api/ico-prev.png) no-repeat center center/ cover;
    }
    &.stop {
      background: url(${IMG_SERVER}/images/api/ico-stop.png) no-repeat center center/ cover;
    }
    &.next {
      background: url(${IMG_SERVER}/images/api/ico-next.png) no-repeat center center/ cover;
    }
  }
  @media (max-width: ${WIDTH_TABLET_S}) {
    /* margin-right: 2.5%; */
    display: none;
  }
`
const ToggleBtn = styled.div`
  position: absolute;
  top: 0;
  left: calc(50% + 58px);
  width: 36px;
  height: 36px;
  background: url('${IMG_SERVER}/images/api/ico-stop.png') no-repeat center center / cover;
  cursor: pointer;
  z-index: 2;
  @media (max-width: ${WIDTH_TABLET_S}) {
    display: none;
  }
`
const Slide = styled.div`
  @media (max-width: ${WIDTH_TABLET_S}) {
    margin-left: -1.2px;
  }
`
const Info = styled.div`
  float: left;
  width: 51.77%;
  padding: 2px 4.8% 30px 4.8%;
  box-sizing: border-box;
  @media (max-width: ${WIDTH_MOBILE}) {
    width: 57.3%;
    padding: 2px 10% 30px 4.8%;
  }
`
const Category = styled.span`
  display: block;
  color: #777;
  font-size: 14px;
  font-weight: 400;
  letter-spacing: -0.35px;
  transform: skew(-0.03deg);
`
const Title = styled.h2`
  overflow: hidden;
  max-height: 46px;
  margin: 21px 0 9px 0;
  box-sizing: border-box;
  color: #444;
  white-space: nowrap;
  text-overflow: ellipsis;
  white-space: normal;
  word-wrap: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.44;
  letter-spacing: -0.45px;
  @media (max-width: ${WIDTH_MOBILE}) {
    margin: 9px 0 9px 0;
    font-size: 16px;
  }
`

const Name = styled.strong`
  display: block;
  padding-right: 5.58%;
  box-sizing: border-box;
  color: ${COLOR_MAIN};
  font-size: 14px;
  font-weight: 400;
  line-height: 1.43;
  letter-spacing: -0.35px;
  transform: skew(-0.03deg);
  @media (max-width: ${WIDTH_MOBILE}) {
    padding-right: 12%;
  }
`

const ImgBox = styled.div`
  position: relative;
  float: left;
  width: 48.22%;
  height: 100%;
  background: url(${props => props.bg}) no-repeat center center / cover;
  @media (max-width: ${WIDTH_MOBILE}) {
    width: 42.68%;
  }
`
const Avata = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 80px;
  height: 80px;
  background: url(${props => props.bg}) no-repeat center center / cover;
  @media (max-width: ${WIDTH_MOBILE}) {
    width: 64px;
    height: 64px;
  }
`

const IconBox = styled.div`
  position: absolute;
  top: 6px;
  left: 0;
  width: 100%;
  height: 28px;
  @media (max-width: ${WIDTH_MOBILE}) {
    left: 6px;
  }
`
const Reco = styled.span`
  display: inline-block;
  width: 48px;
  height: 28px;
  margin-left: 5px;
  background-color: #fff;
  font-size: 14px;
  text-align: center;
  line-height: 28px;
  font-weight: 700;
  color: ${COLOR_MAIN};
  transform: skew(-0.03deg);
  @media (max-width: ${WIDTH_MOBILE}) {
    margin-left: 2px;
  }
`
const Popu = styled.span`
  display: inline-block;
  width: 48px;
  height: 28px;
  margin-left: 5px;
  background-color: #fff;
  color: ${COLOR_POINT_P};
  font-size: 14px;
  text-align: center;
  font-weight: 700;
  line-height: 28px;
  transform: skew(-0.03deg);
  @media (max-width: ${WIDTH_MOBILE}) {
    margin-left: 2px;
  }
`

const People = styled.div`
  position: absolute;
  bottom: 0;
  & span {
    float: left;
    overflow: hidden;
    height: 24px;
    padding-left: 6px;
    margin-right: 14px;
    box-sizing: border-box;
    color: #9e9e9e;
    font-size: 14px;
    text-align: left;
    line-height: 2;
    letter-spacing: -0.35px;
    text-overflow: ellipsis;
    white-space: nowrap;
    transform: skew(-0.03deg);
    @media (max-width: ${WIDTH_MOBILE}) {
      padding-left: 6px;
      margin-right: 11px;
    }
  }
  & span:last-child {
    margin-right: 0;
  }
`
const Viewer = styled.div`
  float: left;
  width: 24px;
  height: 24px;
  background: url('${IMG_SERVER}/images/api/hit-g-s.png') no-repeat center center / cover;
`
const Lover = styled.div`
  float: left;
  width: 24px;
  height: 24px;
  background: url('${IMG_SERVER}/images/api/ico-like-g-s.png') no-repeat center center / cover;
`
