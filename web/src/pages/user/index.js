/**
 * @file /user/index.js
 * @brief 회원가입
 */
import React, {useState} from 'react'
import styled from 'styled-components'

//context
import {WIDTH_TABLET} from 'Context/config'
//layout
import Layout from 'Pages/common/layout/pure'
//components
import Join from './content/join'
import Password from './content/password'

const User = props => {
  //---------------------------------------------------------------------
  //const
  const {title} = props.match.params
  //---------------------------------------------------------------------
  function userRoute() {
    switch (title) {
      case 'join': //회원가입
        return <Join {...props} />
      case 'password': //비밀번호찾기
        return <Password {...props} />
      default:
        return <p>기본페이지</p>
    }
  }

  //---------------------------------------------------------------------
  return <Layout>{userRoute()}</Layout>
}
export default User
//---------------------------------------------------------------------
