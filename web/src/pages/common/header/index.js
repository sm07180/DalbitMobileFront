/**
 * @file header/index.js
 * @brief PC,Mobile 상단에 적용되는 Header영역 ,100% x 80px
 * @todo 반응형으로 처리되어야함
 */
import React, {useEffect, useState, useContext} from 'react'
import {Link, NavLink} from 'react-router-dom'
import styled from 'styled-components'
//context
import {Context} from 'context'
import {COLOR_WHITE, COLOR_MAIN, COLOR_POINT_Y} from 'context/color'
import {IMG_SERVER, WIDTH_PC, WIDTH_MOBILE, WIDTH_TABLET} from 'context/config'
//components
import Logo from './logo'
import Navi from './navi'
import Profile from './profile'
//
export default props => {
  //context
  const context = useContext(Context)
  //useState
  const [scrollTop, setScrollTop] = useState(0)
  //let
  let timer
  //const
  const scrollTime = 10
  const type = props.type || 'sub'
  //---------------------------------------------------------------------

  //checkScroll
  const scrollEvtHdr = event => {
    if (timer) window.clearTimeout(timer)
    timer = window.setTimeout(function() {
      //스크롤
      setScrollTop(document.body.scrollTop || document.documentElement.scrollTop)
    }, scrollTime)
  }
  //useEffect
  useEffect(() => {
    window.addEventListener('scroll', scrollEvtHdr)
    return () => {
      window.removeEventListener('scroll', scrollEvtHdr)
    }
  }, [])

  //---------------------------------------------------------------------
  return (
    <Header className={[type, scrollTop !== 0 ? 'scroll' : 'top']}>
      {/* 네비게이션 */}
      <Navi type={scrollTop !== 0 ? 'scroll' : 'top'} />
      {/* 상단로고 */}
      <Logo />
      {/* 프로필이미지&GNB */}
      {/* <Profile type={scrollTop !== 0 ? 'scroll' : 'top'} /> */}
      <ButtonWrap>
        <button
          onClick={() => {
            context.action.updateGnbState('search')
          }}>
          검색
        </button>
        <button
          onClick={() => {
            context.action.updateGnbState('mypage')
          }}>
          >프로필
        </button>
        <button
          onClick={() => {
            context.action.updateGnbState('notice')
          }}>
          >알람
        </button>
        <button
          onClick={() => {
            context.action.updateGnbState('menu')
          }}>
          >메뉴
        </button>
      </ButtonWrap>
    </Header>
  )
}
//---------------------------------------------------------------------
const Header = styled.header`
  /* mobile media query */
  @media (max-width: ${WIDTH_TABLET}) {
  }
  /* pc media query */
  position: fixed;
  display: block;
  width: 100%;
  height: 80px;
  z-index: 10;
  &.sub {
    nav a {
      color: #111;
    }
  }
  &.scroll {
    background: #fff;
    /* 모바일사이즈 */
    @media screen and (max-width: ${WIDTH_MOBILE}) {
      background: transparent;
      /* 네비,로고 hide */
      nav,
      .logo {
        display: none;
      }
    }
  }
`

const ButtonWrap = styled.div`
  position: absolute;
  right: 10px;
  top: 18px;

  button {
    width: 48px;
    height: 48px;
    margin: 0 5px;
    font-size: 16px;
    text-indent: -9999px;
  }

  button:nth-child(1) {
    background: url(${IMG_SERVER}/svg/ic_search_normal.svg) no-repeat center;
  }
  button:nth-child(2) {
    background: url(${IMG_SERVER}/svg/ic_user_normal.svg) no-repeat center;
  }
  button:nth-child(3) {
    background: url(${IMG_SERVER}/svg/ic_alarm.svg) no-repeat center;
  }
  button:nth-child(4) {
    background: url(${IMG_SERVER}/svg/ic_menu_normal.svg) no-repeat center;
  }
`
