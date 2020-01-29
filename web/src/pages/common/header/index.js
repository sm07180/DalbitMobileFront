/**
 * @file header/index.js
 * @brief PC,Mobile 상단에 적용되는 Header영역 ,100% x 80px
 * @todo 반응형으로 처리되어야함
 */
import React, {useEffect, useContext} from 'react'
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
  //const
  const type = props.type == 'main' ? 'main' : 'sub'
  //---------------------------------------------------------------------
  return (
    <Header className={type}>
      {/* 네비게이션 */}
      <Navi type={type} />
      {/* 상단로고 */}
      <Logo />
      {/* 프로필이미지&GNB */}
      <Profile />
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
`
