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

//
export default () => {
  //---------------------------------------------------------------------
  return (
    <Gnb>
      <a href="/">홈</a>
      <a href="/login">로그인</a>
      <a href="/user">회원가입</a>
      <a href="#">* 마이페이지</a>
      <a href="#">* 인기 DJ</a>
      <a href="#">* 인기 캐스트</a>
    </Gnb>
  )
}
//---------------------------------------------------------------------
const Gnb = styled.nav`
  /* mobile media query */
  @media (max-width: ${DEVICE_MOBILE}) {
  }
  /* pc media query */
  position: fixed;
  width: 200px;
  top: 50px;
  left: 0;
  padding: 10px 20px;
  height: calc(100% - 50px);
  border-right: 1px solid #ccc;
  box-sizing: border-box;
  a {
    display: block;
    padding: 10px 20px;
  }
`
