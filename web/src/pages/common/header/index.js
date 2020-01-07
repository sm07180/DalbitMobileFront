/**
 * @file header/index.js
 * @brief PC,Mobile 상단에 적용되는 Header영역
 * @todo 반응형으로 처리되어야함
 */
import React, {useEffect, useContext} from 'react'
import styled from 'styled-components'
//context
import {Context} from 'Context'
//components
import {COLOR_WHITE} from 'Context/color'
import {DEVICE_MOBILE} from 'Context/config'
import Profile from './profile'
//
export default () => {
  const context = useContext(Context)
  //---------------------------------------------------------------------
  return (
    <Header>
      <a href="#" className="logo">
        달빛라디오
      </a>
      <div className="util">
        <Login
          onClick={() => {
            context.action.updatePopup('LOGIN')
          }}>
          로그인
        </Login>
        {/* 프로필 */}
        <Profile />
      </div>
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
  .util {
    float: right;
  }
`
const Login = styled.button`
  display: inline-block;
  padding: 10px;
  vertical-align: middle;
`
