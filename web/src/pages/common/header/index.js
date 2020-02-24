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
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
//components
import Logo from './logo'
import Navi from './navi'
import Button from './button'
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
  const scrollClassName = scrollTop > 30 ? 'scroll' : 'top'
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
    <Header className={[type, scrollClassName, context.state.isOnCast ? 'on-cast' : 'off-cast']}>
      {/* 상단로고 */}
      <Logo type={[type, scrollClassName]} />
      {/* 네비게이션 */}
      <Navi {...props} type={scrollClassName} />
      {/* 프로필이미지&GNB */}
      {/* <Profile type={scrollTop !== 0 ? 'scroll' : 'top'} /> */}
      {/* 오른쪽 메뉴들 */}
      <Button />
    </Header>
  )
}
//---------------------------------------------------------------------
const Header = styled.header`
  /* pc media query */
  position: fixed;
  display: block;
  width: 100%;
  height: 80px;
  border-bottom: 1px solid #eee;
  background: #fff;
  z-index: 10;

  @media (max-width: ${WIDTH_TABLET_S}) {
    height: 56px;
    border-bottom: 0;
    background: ${COLOR_MAIN};
    /* 모바일 헤더는 메인에서 스크롤 했을때와 서브페이지에서의 헤더가 같은 타입. */
    &.scroll,
    &.sub {
      nav {
        display: none;
      }
      .mobilecast {
        display: inline-block;
      }
    }

    &.on-cast {
      display: none;
      & + main {
        padding-top: 0;
      }
    }
  }
`

const ButtonWrap = styled.div``
