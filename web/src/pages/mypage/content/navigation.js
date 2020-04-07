import React, {useState, useEffect, useContext, useRef} from 'react'
import styled from 'styled-components'
import {NavLink} from 'react-router-dom'
import Swiper from 'react-id-swiper'

//context
import {Context} from 'context'
import Api from 'context/api'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_TABLET_S, WIDTH_PC_S, WIDTH_TABLET, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'

let naviSwiper = ''
export default props => {
  const {list, memNo, type, webview} = props
  const current = type
  let currentTab = list.filter(list => {
    return list.type == current
  })[0].id

  const params = {
    slidesPerView: 'auto',
    initialSlide: currentTab,
    freeMode: true,
    touchRatio: 0.6,
    resistanceRatio: 0,
    roundLengths: true
  }

  useEffect(() => {
    currentTab = currentTab == 1 || currentTab == 2 ? 0 : currentTab == 3 ? 2 : currentTab
    naviSwiper.slideTo(currentTab, 300)
  }, [currentTab])

  return (
    <Navigation className={`tab${list.length}`}>
      <Swiper
        {...params}
        getSwiper={e => {
          naviSwiper = e
        }}>
        {list.map((bundle, index) => {
          const {type, txt} = bundle
          return (
            <NavLink
              to={webview ? `/mypage/${memNo}/${type}?webview=${webview}` : `/mypage/${memNo}/${type}`}
              activeClassName="active"
              key={index}>
              <TabText>{txt}</TabText>
            </NavLink>
          )
        })}
      </Swiper>
    </Navigation>
  )
}

const TabText = styled.div`
  color: ${COLOR_MAIN};
  cursor: pointer;
`

const Navigation = styled.div`
  display: flex;
  flex-direction: row;

  .swiper-container {
    width: calc(100%);
  }

  @media (max-width: ${WIDTH_TABLET_S}) {
    height: 49px;
    .swiper-container {
      position: absolute;
      left: 4.445%;
      width: 95.555%;
      padding-right: 4.445%;
    }
  }

  a {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 14.285%;
    height: 48px;
    box-sizing: border-box;
    border-top: 1px solid #e0e0e0;
    border-right: 1px solid #e0e0e0;
    min-width: 100px;
    box-sizing: border-box;
    letter-spacing: -0.4px;
    transform: skew(-0.03deg);
    border-bottom: 1px solid ${COLOR_MAIN};

    &:first-child {
      border-left: 1px solid #e0e0e0;
    }

    &.active {
      border-top: 1px solid #8556f6;
      border-left: none;
      border-right: none;

      background-color: #8556f6;
      & > div {
        color: #fff;
      }
    }
    @media (max-width: ${WIDTH_MOBILE}) {
      width: 30%;
    }
  }

  &.tab2 {
    a {
      width: 50%;
      min-width: 50%;
    }
  }

  &.tab3 {
    a {
      width: 33.333%;
      min-width: 33%;
    }
  }
  &.tab4 {
    a {
      width: 25%;
      /* min-width: 33%; */
      @media (max-width: ${WIDTH_MOBILE}) {
        width: 30%;
      }
    }
  }
  &.tab5 {
    a {
      width: 20%;
      /* min-width: 33%; */
      @media (max-width: ${WIDTH_MOBILE}) {
        width: 30%;
      }
    }
  }
`
