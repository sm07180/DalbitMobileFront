/**
 * @file /mypage/content/my-profile.js
 * @brief 마이페이지 상단에 보이는 내 프로필 component
 */

import React, {useEffect, useStet} from 'react'
import styled from 'styled-components'

//layout
import {WIDTH_PC, WIDTH_TABLET} from 'Context/config'

const Profile = () => {
  return <MyProfile>내 프로필 영역 component</MyProfile>
}

export default Profile

const MyProfile = styled.div`
  width: 600px;
  margin: 0 auto;
  padding: 30px;
  min-height: 300px;
  background: #eee;

  @media (max-width: ${WIDTH_PC}) {
    width: 90%;
  }
`
