/**
 * @file profile.js
 * @brief Header영역의 우측 프로필사진
 * @todo 반응형으로 처리되어야함
 */
import React, {useEffect} from 'react'
import styled from 'styled-components'
//components

//
export default () => {
  //---------------------------------------------------------------------
  return (
    <Profile>
      <img src="/images/profile.jpg" />
    </Profile>
  )
}
//---------------------------------------------------------------------
const Profile = styled.div`
  float: right;
  box-sizing: border-box;
`
