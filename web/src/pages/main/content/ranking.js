/**
 * @file /content/context-list.js
 * @brief 메인 라이브, 캐스트 리스트 component
 */
import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import Swiper from 'react-id-swiper'

//context
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_TABLET_S, WIDTH_PC_S, WIDTH_TABLET, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'

//components

export default props => {
  const slideInfo = [
    {
      id: '1',
      rank: '1',
      tag: '추천',
      title: '박 + 룰루 소리부자',
      img: 'https://devimage.dalbitcast.com/images/api/tica034m19020284.jpg',
      gold: '4,693',
      like: '16,555'
    },
    {
      id: '2',
      rank: '2',
      tag: '추천',
      title: '나른 새벽 함께 해요',
      img: 'https://devimage.dalbitcast.com/images/api/tica034j16080551.jpg',
      gold: '4,693',
      like: '16,555'
    },
    {
      id: '3',
      rank: '3',
      tag: '추천',
      title: '어닝 [팬 모집중]',
      img: 'https://devimage.dalbitcast.com/images/api/ti375a8312.jpg',
      gold: '4,693',
      like: '16,555'
    }
  ]
  let rankingSlider = {}
  const params = {
    slidesPerView: 'auto',
    spaceBetween: 6,
    //freeMode: true,
    resistanceRatio: 0,
    breakpoints: {
      360: {
        spaceBetween: 12
      }
    }
  }

  const arraySlide = slideInfo.map((item, index) => {
    const {id, rank, tag, title, img, gold, like} = item
    const rankClass = `nth${rank}`
    return (
      <RankingItem key={id} className={rankClass}>
        <ImgBox url={img}>
          <img src={img}></img>
          <span>{tag}</span>
        </ImgBox>
        <p>{rank}</p>
        <h2>{title}</h2>
        <State>
          <span>{gold}</span>
          <span>{like}</span>
        </State>
      </RankingItem>
    )
  })

  return (
    <Content>
      <Stitle>
        <h2>랭킹</h2>
        <span>plus</span>
      </Stitle>
      <RankingWrap>
        <PcWrap>{arraySlide}</PcWrap>
        <MobileWrap>
          <Swiper
            {...params}
            getSwiper={e => {
              rankingSlider = e
            }}>
            {arraySlide}
          </Swiper>
        </MobileWrap>
      </RankingWrap>
    </Content>
  )
}

//---------------------------------------------------------------------
//styled

const Content = styled.div`
  position: relative;
  width: 904px;
  margin: 77px auto 100px auto;
  text-align: center;

  &:before {
    position: absolute;
    top: -77px;
    left: 50%;
    width: 1px;
    height: 40px;
    background: ${COLOR_MAIN};
    content: '';
  }

  @media (max-width: ${WIDTH_PC_S}) {
    width: 95%;
  }
  @media (max-width: ${WIDTH_MOBILE}) {
    width: 97.5%;
    margin: 48px 0 60px 2.5%;
    &:before {
      display: none;
    }
  }
`
const Stitle = styled.div`
  width: 100%;
  height: 36px;
  &:after {
    display: block;
    content: '';
    clear: both;
  }
  & h2 {
    display: inline-block;
    margin-right: 16px;
    font-size: 34px;
    font-weight: 800;
    letter-spacing: -0.85px;
    color: ${COLOR_MAIN};
    @media (max-width: ${WIDTH_MOBILE}) {
      float: left;
      font-size: 28px;
    }
  }
  @media (max-width: ${WIDTH_MOBILE}) {
    height: auto;
  }
  & span {
    display: inline-block;
    width: 36px;
    height: 36px;
    font-size: 0;
    background: url('https://devimage.dalbitcast.com/images/api/ico-more-p.png') no-repeat center center / cover;
    vertical-align: top;
    @media (max-width: ${WIDTH_MOBILE}) {
      float: right;
      margin-right: 2.5%;
    }
  }
`

const RankingWrap = styled.div`
  margin-top: 37px;
  @media (max-width: ${WIDTH_MOBILE}) {
    margin-top: 25px;
  }

  .nth1 p {
    position: relative;
    width: 60px;
    margin-top: -30px;
    padding: 9px 0 7px 0;
    background: ${COLOR_MAIN};
    font-size: 37px;
    font-weight: 800;

    &:before {
      display: block;
      position: absolute;
      top: -26px;
      left: calc(50% - 21px);
      width: 42px;
      height: 34px;
      background: url(${IMG_SERVER}/svg/ico-crown.svg) no-repeat center / cover;
      content: '';
    }

    @media (max-width: ${WIDTH_MOBILE}) {
      margin-top: -22px;
      width: 44px;
      padding: 0;
      font-size: 28px;

      &:before {
        top: -20px;
        left: calc(50% - 17px);
        width: 34px;
        height: 28px;
      }
    }
  }
  .nth2 p {
    background: ${COLOR_POINT_P};
  }
  .nth3 p {
    background: ${COLOR_POINT_Y};
  }
  @media (min-width: ${WIDTH_MOBILE}) {
    .nth1 {
      order: 2;
    }
    .nth2 {
      order: 1;
    }
    .nth3 {
      order: 3;
    }
  }
`

const PcWrap = styled.div`
  display: flex;
  justify-content: space-between;
  @media (max-width: ${WIDTH_MOBILE}) {
    display: none;
  }
`

const MobileWrap = styled.div`
  display: none;
  .swiper-slide {
    width: 60%;
  }
  @media (max-width: ${WIDTH_MOBILE}) {
    display: block;
  }
`

const RankingItem = styled.div`
  width: 32.3%;
  text-align: center;

  p {
    width: 44px;
    margin: -22px auto 32px auto;
    border-radius: 50%;
    background: ${COLOR_POINT_P};
    color: #fff;
    font-size: 28px;
    font-weight: 600;
    line-height: 44px;

    @media (max-width: ${WIDTH_MOBILE}) {
      margin: -22px auto 18px auto;
    }
  }
  h2 {
    overflow: hidden;
    color: #424242;
    font-size: 24px;
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`

const ImgBox = styled.div`
  overflow: hidden;
  position: relative;
  width: 100%;
  height: 292px;
  padding: 4px;
  background: url(${props => props.url}) no-repeat center center / cover;
  text-align: left;
  z-index: -1;
  span {
    display: inline-block;
    padding: 0 11px;
    background: #fff;
    color: ${COLOR_POINT_P};
    font-size: 14px;
    line-height: 28px;
  }
  img {
    position: absolute;
    left: 0;
    top: 0;
    height: 0;
    z-index: -1;
  }
  @media (max-width: ${WIDTH_TABLET_S}) {
    height: 230px;
  }
  @media (max-width: ${WIDTH_MOBILE_S}) {
    height: 180px;
  }
`

const State = styled.div`
  margin-top: 20px;

  @media (max-width: ${WIDTH_MOBILE}) {
    margin-top: 15px;
  }

  span {
    display: inline-block;
    color: #9e9e9e;
    line-height: 26px;
  }

  span:first-child {
    padding-left: 44px;
    background: url(${IMG_SERVER}/svg/ico-gold.svg) no-repeat left center;
    @media (max-width: ${WIDTH_MOBILE}) {
      padding-left: 29px;
      background-size: 22px;
    }
  }
  span:last-child {
    padding-left: 38px;
    background: url(${IMG_SERVER}/svg/ico-like-r-m.svg) no-repeat left center;
    @media (max-width: ${WIDTH_MOBILE}) {
      padding-left: 26px;
      background-size: 23px;
    }
  }
  span:first-child::after {
    display: inline-block;
    width: 1px;
    height: 16px;
    margin: 0 15px -2px 19px;
    background: #e0e0e0;
    content: '';
    @media (max-width: ${WIDTH_MOBILE}) {
      height: 14px;
      margin: 0 10px -2px 13px;
    }
  }
`
