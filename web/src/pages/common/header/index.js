/**
 * @file header/index.js
 * @brief PC,Mobile 상단에 적용되는 Header영역 ,100% x 80px
 * @todo 반응형으로 처리되어야함
 */
import React, {useEffect, useState, useContext} from 'react'
import {Link, NavLink} from 'react-router-dom'
import styled from 'styled-components'
//context
import {Context} from 'Context'
import {COLOR_WHITE, COLOR_MAIN, COLOR_POINT_Y} from 'Context/color'
import {IMG_SERVER, WIDTH_PC, WIDTH_MOBILE, WIDTH_TABLET} from 'Context/config'
//components
import Logo from './logo'
import Navi from './navi'
import creatIcon from 'Components/ui/icon'
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
      <Profile type={scrollTop !== 0 ? 'scroll' : 'top'} />
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
