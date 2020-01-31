/**
 * @file /content/context-list.js
 * @brief 메인 라이브, 캐스트 리스트 component
 */
import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import Swiper from 'react-id-swiper'

//context
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER} from 'context/config'

//components

export default props => {
  //---------------------------------------------------------------------
  //state
  const [slideInfo, setSlideInfo] = useState(props.Info.concat(props.Info).concat(props.Info))
  let mainSlider = {}

  const params = {
    loop: true,
    spaceBetween: 14,
    initialSlide: 12, //0 based
    simulateTouch: true,
    on: {
      slideChange: function() {
        console.log('슬라이드 바뀌었을때')
        console.log(mainSlider)
        console.log(mainSlider.params.init)
      }
    }
  }
  const arraySlide = slideInfo.map((item, index) => {
    const {id, title, url, name, reco, category, popu, avata} = item
    return (
      <Slide key={index}>
        <ImgBox bg={url}>
          <img src={url}></img>
        </ImgBox>
        <p>{title}</p>
      </Slide>
    )
  })

  return (
    <Content>
      <MainSliderWrap>
        <Bg></Bg>
        <SliderItem>
          {/* 실제 프로필 아이템 슬라이드 영역 */}
          <Swiper
            {...params}
            getSwiper={e => {
              mainSlider = e
            }}>
            {arraySlide}
          </Swiper>
          {/* 현재 on 된 프로필 아이템 듣는사람, 좋아요 숫자 상태 */}
          <ActiveState>
            <ProfileState type="hit">420</ProfileState>
            <ProfileState type="like">756</ProfileState>
          </ActiveState>
          {/* 현재 on 된 프로필 아이템 재생 버튼, 타이틀 등  */}
          <ActiveItem>
            <button>방송 바로가기</button>
            <span>신입 DJ</span>
            <b>오후 잠을 깨워줄 상큼한 목소리 들어요</b>
            <p>★하늘하늘이에요</p>
          </ActiveItem>
          {/* 레코드 모양 선택 애니메이션 레이아웃 */}
          <Selecter>
            <div>
              <button></button>
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
  height: 658px;
`

const Bg = styled.div`
  position: absolute;
  top: 0;
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
`

const SliderItem = styled.div`
  margin: 234px 0;
  .swiper-container {
    overflow: visible;
    width: 190px;
    height: 190px;
  }
  .swiper-slide {
    overflow: visible;
    width: 190px;
  }
  .swiper-slide.swiper-slide-active {
    position: relative;
    z-index: 1;
    p {
      display: none;
    }
  }
  .swiper-slide.swiper-slide-active:before {
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
`

const Slide = styled.div`
  overflow: visible;
  text-align: center;
  img {
    width: 100%;
    height: 0;
  }
  p {
    overflow: hidden;
    margin-top: 15px;
    color: #bdbdbd;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`

const ImgBox = styled.div`
  overflow: hidden;
  width: 100%;
  height: 190px;
  border-radius: 50%;
  background: url(${props => props.bg}) no-repeat center center / cover;
`

const SwiperWrap = styled.div``

const Selecter = styled.div`
  position: relative;
  width: 440px;
  height: 440px;
  margin: 0 auto;
  div {
    position: absolute;
    top: -316px;
    width: 100%;
    height: 440px;
    border-radius: 50%;
    background-image: linear-gradient(to bottom, #feac2c 25%, rgba(254, 172, 44, 0) 91%, rgba(254, 172, 44, 0));
  }
`

const ActiveItem = styled.div`
  position: absolute;
  bottom:65px;
  width: 100%;
  text-align: center;
  z-index: 3;
  & *{
    display:block;
    margin:0 auto;
  }
  button {
    position:relative;
    width:48px;
    height:48px;
    border-radius:50%;
    background:url(${IMG_SERVER}/images/api/ico-play.svg) no-repeat;
    text-indent:-9999px;
  }
  span {
    display:inline-block;
    margin:35px 0 0 0;
    padding:0 15px;
    color:${COLOR_POINT_Y}
    border-radius:18px;
    background:#fff;
    font-weight:600;
    font-size: 14px;
    line-height:28px;
  }
  b {
    margin-top:18px;
    color:#fff;
    font-size:28px;
    font-weight:600;
    letter-spacing: -0.7px;
  }
  & > p{
    margin-top:9px;
    color:${COLOR_POINT_Y}
    font-size:20px;
    letter-spacing: -0.5px;
  }
`

const ActiveState = styled.div`
  position: absolute;
  top: 138px;
  width: 100%;
  text-align: center;
  z-index: 3;
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
    margin-left: 30px;
  }
`
