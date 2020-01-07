/**
 * @file header/index.js
 * @brief PC,Mobile 상단에 적용되는 Header영역
 * @todo 반응형으로 처리되어야함
 */
import React, {useEffect} from 'react'
import styled from 'styled-components'
//components
import {COLOR_WHITE} from 'Context/color'
import {DEVICE_MOBILE} from 'Context/config'
import Profile from './profile'
//
export default () => {
  //---------------------------------------------------------------------
  return (
    <Header>
      <a href="#" className="logo">
        달빛라디오
      </a>
      {/* 프로필 */}
      <Profile />
    </Header>
  )
}
//---------------------------------------------------------------------
const Header = styled.header`
  /* mobile media query */
  @media (max-width: ${DEVICE_MOBILE}) {
    background: #ff0000;
    .logo {
      display: inline-block;
    }
  }
  /* pc media query */
  display: block;
  border-bottom: 1px solid #eee;
  padding: 10px 20px;
  height: 50px;
  background: ${COLOR_WHITE};
  box-sizing: border-box;
`
