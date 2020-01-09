/**
 * @file profile.js
 * @brief Header영역의 우측 프로필사진
 * @todo 반응형으로 처리되어야함
 */
import React, {useEffect} from 'react'
import styled from 'styled-components'
//components
import {GoogleLogin} from 'react-google-login'
import KakaoLogin from 'react-kakao-login'

export default () => {
  //---------------------------------------------------------------------
  return (
    <Profile>
      <img src="/images/profile.jpg" />
    </Profile>
  )
}
//---------------------------------------------------------------------
const Profile = styled.span`
  display: inline-block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  box-sizing: border-box;
  img {
    width: 100%;
    height: auto;
    vertical-align: top;
  }
`
