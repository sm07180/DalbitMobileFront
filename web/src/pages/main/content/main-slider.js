/**
 * @file /content/context-list.js
 * @brief 메인 라이브, 캐스트 리스트 component
 */
import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import Swiper from 'react-id-swiper'
import useResize from 'components/hooks/useResize'

//context
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE} from 'context/config'

//components

export default props => {
  //---------------------------------------------------------------------
  //state
  //const [slideInfo, setSlideInfo] = useState(props.Info.concat(props.Info))
  const [slideInfo, setSlideInfo] = useState(props.Info)
  const [currentInfo, setCurrentInfo] = useState({
    entryCnt: '',
    likeCnt: '',
    title: '',
    bjNickNm: ''
  })
  //let mainSlider = {}
  const [mainSlider, setMainSlider] = useState()
  const [selecterWidth, setSelecterWidth] = useState(-220)

  const params = {
    loop: true,
    spaceBetween: 6,
    simulateTouch: true,
    centeredSlides: true,
    slidesPerView: 'auto',
    on: {
      slideChangeTransitionEnd: function() {
        const currentIdx = document.getElementsByClassName('main-slide-active')[0].attributes['data-swiper-slide-index'].value
        // console.log('currentIdxcurrentIdxcurrentIdxcurrentIdx', currentIdx)
        //document.getElementsByClassName('select-btn').s
        //console.log('슬라이드 바뀌었을때', slideInfo[currentIdx])
        setCurrentInfo({
          entryCnt: slideInfo[currentIdx].people,
          likeCnt: slideInfo[currentIdx].like,
          title: slideInfo[currentIdx].title,
          bjNickNm: slideInfo[currentIdx].name
        })
      },
      slideChangeTransitionStart: function() {
        const currentIdx = document.getElementsByClassName('main-slide-active')[0].attributes[1].value
        const animNum = 40 + currentIdx * 11
        // console.log(selecterWidth)
        document.getElementsByClassName('select-btn')[0].style.transform = `rotate(${animNum}deg) translate(${selecterWidth}px)`
      }
    },

    slideActiveClass: 'main-slide-active',
    preventClicks: false,
    preventClicksPropagation: false,
    //preventClicks: false,
    breakpoints: {
      601: {
        spaceBetween: 14
      },
      841: {
        simulateTouch: false
      }
    }
  }

  //슬라이더 안에 슬라이드 생성
  const arraySlide = slideInfo.map((item, index) => {
    const {id, title, url, name, reco, category, popu, avata} = item
    return (
      <Slide
        key={index}
        onClick={() => {
          //console.log('클릭은됐는지?', mainSlider)
          if (mainSlider) mainSlider.slideToLoop(index)
        }}>
        <ImgBox bg={url}>
          <img src={url}></img>
        </ImgBox>
        <p>{title}</p>
      </Slide>
    )
  })

  //---------------------------------------------------------------------
  //useEffect
  // useEffect(() => {
  //   if (window.innerWidth > 840) {
  //     setSelecterWidth(-220)
  //     console.log('1')
  //   } else if (window.innerWidth <= 840 && window.innerWidth > 600) {
  //     setSelecterWidth(-185)
  //     console.log('2')
  //   } else {
  //     setSelecterWidth(-120)
  //     console.log('3')
  //   }
  //   if (mainSlider) mainSlider.update()
  // }, [useResize()])

  return (
    <Content>
      <MainSliderWrap className="main-slider">
        <Bg></Bg>
        <SliderItem>
          {/* 실제 프로필 아이템 슬라이드 영역 */}
          <Swiper
            {...params}
            getSwiper={e => {
              setMainSlider(e)
            }}>
            {arraySlide}
          </Swiper>
          {/* 현재 on 된 프로필 아이템 듣는사람, 좋아요 숫자 상태 */}
          <ActiveState>
            <ProfileState type="hit">{currentInfo.entryCnt}</ProfileState>
            <ProfileState type="like">{currentInfo.likeCnt}</ProfileState>
          </ActiveState>
          {/* 현재 on 된 프로필 아이템 재생 버튼, 타이틀 등  */}
          <ActiveItem>
            <button>방송 바로가기</button>
            <span>신입 DJ</span>
            <b>{currentInfo.title}</b>
            <p>{currentInfo.bjNickNm} </p>
          </ActiveItem>
          {/* 레코드 모양 선택 애니메이션 레이아웃 */}
          <Selecter>
            <div>
              <button className="select-btn"></button>
            </div>
          </Selecter>
        </SliderItem>
      </MainSliderWrap>
    </Content>
  )
}

//---------------------------------------------------------------------
//styled

const Content = styled.section``

const MainSliderWrap = styled.div`
  overflow: hidden;
  position: relative;
  height: 580px;

  @media (max-width: ${WIDTH_TABLET_S}) {
  }

  @media (max-width: ${WIDTH_MOBILE}) {
    height: 382px;
  }
`

const Bg = styled.div`
  position: absolute;
  top: -78px;
  width: 100%;
  height: 658px;
  text-align: center;

  &::before {
    display: inline-block;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 920px;
    height: 920px;
    margin-top: -131px;
    background-color: ${COLOR_MAIN};
    border-radius: 50%;
    content: '';
  }

  @media (max-width: ${WIDTH_TABLET_S}) {
    &::before {
      width: 145%;
      margin-top: -215px;
    }
  }

  @media (max-width: ${WIDTH_MOBILE}) {
    &::before {
      width: 900px;
      margin-top: -460px;
    }
  }

  @media (max-width: 500px) {
    &::before {
      width: 800px;
      /* margin-top: -380px; */
    }
  }
`

const SliderItem = styled.div`
  margin: 168px 0;
  .swiper-container {
    overflow: visible;
    width: 190px;
    height: 190px;
  }
  .swiper-slide {
    overflow: visible;
    width: 190px;
  }
  .swiper-slide.main-slide-active {
    position: relative;
    z-index: 1;
    p {
      display: none;
    }
  }
  .swiper-slide.main-slide-active:before {
    /* display: block;
    position: absolute;
    top: -125px;
    left: -125px;
    width: 440px;
    height: 440px;
    border-radius: 50%;
    background-image: linear-gradient(to bottom, #feac2c 25%, rgba(254, 172, 44, 0) 91%, rgba(254, 172, 44, 0));
    content: '';
    z-index: -1; */
  }

  @media (max-width: ${WIDTH_TABLET_S}) {
    margin: 180px 0;
    .swiper-container {
      width: 160px;
      height: 160px;
    }
    .swiper-slide {
      width: 160px;
    }
  }

  @media (max-width: ${WIDTH_MOBILE}) {
    margin: 140px 0;
    .swiper-container {
      width: 100px;
      height: 100px;
    }
    .swiper-slide {
      width: 100px;
    }
  }
`

const Slide = styled.div`
  overflow: visible;
  text-align: center;
  cursor: pointer;
  img {
    width: 100%;
    height: 0;
  }
  p {
    overflow: hidden;
    margin-top: 15px;
    padding: 0 12px;
    color: #bdbdbd;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &.swiper-slide-duplicate {
    cursor: inherit;
  }

  @media (max-width: ${WIDTH_MOBILE}) {
    p {
      display: none;
    }
  }
`

const ImgBox = styled.div`
  overflow: hidden;
  width: 100%;
  height: 190px;
  border-radius: 50%;
  background: url(${props => props.bg}) no-repeat center center / cover;
  @media (max-width: ${WIDTH_TABLET_S}) {
    height: 160px;
  }
  @media (max-width: ${WIDTH_MOBILE}) {
    height: 100px;
  }
`

const SwiperWrap = styled.div``

const Selecter = styled.div`
  position: relative;
  width: 438px;
  height: 438px;
  margin: 0 auto;
  z-index: 2;
  div {
    position: absolute;
    top: -315px;
    width: 100%;
    height: 440px;
    border-radius: 50%;
    /* background-image: linear-gradient(to bottom, #feac2c 25%, rgba(254, 172, 44, 0) 91%, rgba(254, 172, 44, 0)); */
    background: url(${IMG_SERVER}/images/api/main-slider-back.png) no-repeat center center/cover;
  }

  button {
    overflow: hidden;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 16px;
    height: 16px;
    margin: auto;
    border: 10px solid #fff;
    border-radius: 50%;
    background: ${COLOR_POINT_P};
    box-sizing: content-box;
    transform: rotate(40deg) translate(-220px);
    transition: transform 0.5s ease-in-out;
  }

  @media (max-width: ${WIDTH_TABLET_S}) {
    width: 370px;
    height: 370px;
    div {
      top: -265px;
      height: 370px;
    }
    button {
      transform: rotate(40deg) translate(-185px) !important;
    }
  }

  @media (max-width: ${WIDTH_MOBILE}) {
    width: 230px;
    height: 230px;
    div {
      top: -165px;
      height: 230px;
    }
    button {
      width: 10px;
      height: 10px;
      border: 6px solid #fff;
      transform: rotate(48deg) translate(-115px) !important;
    }
  }
`

const ActiveItem = styled.div`
  position: absolute;
  bottom: 56px;
  width: 100%;
  text-align: center;
  z-index: 3;
  & * {
    display: block;
    margin: 0 auto;
  }
  button {
    position: relative;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: url(${IMG_SERVER}/images/api/ico-play.svg) no-repeat;
    text-indent: -9999px;
  }
  span {
    display: inline-block;
    margin: 35px 0 0 0;
    padding: 0 15px;
    color: ${COLOR_POINT_Y};
    border-radius: 18px;
    background: #fff;
    font-weight: 600;
    font-size: 14px;
    line-height: 28px;
  }
  b {
    margin-top: 18px;
    color: #fff;
    font-size: 28px;
    font-weight: 600;
    letter-spacing: -0.7px;
  }
  & > p {
    margin-top: 9px;
    color: ${COLOR_POINT_Y};
    font-size: 20px;
    letter-spacing: -0.5px;
  }

  @media (max-width: ${WIDTH_TABLET_S}) {
  }
  @media (max-width: ${WIDTH_MOBILE}) {
    bottom: 58px;

    button {
      width: 30px;
      height: 30px;
      background: url(${IMG_SERVER}/images/api/ico-play.svg) no-repeat center center/ cover;
    }
    span {
      display: none;
    }
    b {
      margin-top: 26px;
      font-size: 18px;
    }
    & > p {
      font-size: 14px;
    }
  }
`

const ActiveState = styled.div`
  position: absolute;
  top: 70px;
  width: 100%;
  text-align: center;
  z-index: 3;
  @media (max-width: ${WIDTH_TABLET_S}) {
    top: 94px;
  }
`

const ProfileLikeImg = `${IMG_SERVER}/images/api/ico-like-w-l.svg`
const ProfileHitImg = `${IMG_SERVER}/images/api/ico-hit-p-l.svg`

const ProfileState = styled.p`
  display: inline-block;
  width: 48px;
  padding-top: 55px;
  background: url(${props => (props.type == 'like' ? ProfileLikeImg : ProfileHitImg)}) no-repeat center top;
  color: #fff;
  font-size: 16px;
  font-weight: 600;

  & + & {
    position: relative;
    margin-left: 40px;
    &:after {
      position: absolute;
      left: -20px;
      top: 4px;
      display: inline-block;
      width: 1px;
      height: 70px;
      background: #febd56;
      content: '';
    }
  }

  @media (max-width: ${WIDTH_TABLET_S}) {
    padding-top: 45px;
  }

  @media (max-width: ${WIDTH_MOBILE}) {
    padding-top: 28px;
    background-size: 30px !important;
    font-size: 12px;

    & + & {
      margin-left: 20px;
      &:after {
        left: -10px;
        top: 1px;
        height: 38px;
        content: '';
      }
    }
  }
`
