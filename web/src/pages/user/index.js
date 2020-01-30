/**
 * @file /user/index.js
 * @brief 회원가입
 */
import React, {useState} from 'react'
import styled from 'styled-components'

//context
import {WIDTH_TABLET} from 'context/config'
//layout
import Layout from 'pages/common/layout/pure'
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
        return (
          <Common>
            <p>/user 메뉴 </p>
            <button
              onClick={() => {
                props.history.push('/user/join')
              }}>
              회원가입
            </button>
            <br></br>
            <button
              onClick={() => {
                props.history.push('/user/password')
              }}>
              비밀번호찾기
            </button>
          </Common>
        )
    }
  }

  //---------------------------------------------------------------------
  return <Layout>{userRoute()}</Layout>
}
export default User
//---------------------------------------------------------------------

const Common = styled.div`
  margin: 50px 0;
  button {
    margin-top: 20px;
    width: 130px;
    line-height: 60px;
    border: 1px solid #eee;
    font-size: 16px;
    text-align: left;
    text-indent: 10px;
  }
`
