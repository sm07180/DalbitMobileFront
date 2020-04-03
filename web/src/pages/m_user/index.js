/**
 * @file /user/index.js
 * @brief 회원가입
 */
import React, {useStat, useContext} from 'react'
import styled from 'styled-components'

//context
import {WIDTH_TABLET} from 'context/config'
//layout
import PureLayout from 'pages/common/layout/new_pure'
import Layout from 'pages/common/layout/new_index'
//components
import Join from './content/join-form'
import Password from './content/password'
import SelfAuth from './content/selfAuth'
import Api from 'context/api'
import {Context} from 'context'
import {isHybrid, Hybrid} from 'context/hybrid'

const User = props => {
  //---------------------------------------------------------------------
  //context
  const context = useContext(Context)
  //const
  const {title} = props.match.params
  //---------------------------------------------------------------------
  function userRoute() {
    switch (title) {
      case 'join': //회원가입
        return (
          <PureLayout>
            <Join {...props} update={update} />
          </PureLayout>
        )
      case 'password': //비밀번호찾기
        return (
          <PureLayout>
            <Password {...props} />
          </PureLayout>
        )
      case 'selfAuth': //본인인증 요청
        return (
          <Layout {...props}>
            <SelfAuth {...props} />
          </Layout>
        )
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

  function update(mode) {
    switch (true) {
      case mode.loginSuccess !== undefined: //---------------------로그인,정상
        const {authToken, memNo} = mode.loginSuccess
        //Update
        context.action.updateToken(mode.loginSuccess)
        const _href = window.location.href
        //redirect
        if (props.history) {
          context.action.updatePopupVisible(false)
          context.action.updateGnbVisible(false)
          /**
           * @native 전달
           */
          //앱에서호출되는 로그인팝업
          if (_href.indexOf('/login') !== -1) {
            Hybrid('GetLoginTokenNewWin', mode.loginSuccess)
            // Utility.setCookie('native-player-info', 'GetLoginTokenNewWin', 100)
          } else {
            //일반적인 로그인성공
            Hybrid('GetLoginToken', mode.loginSuccess)
          }
        }
        break
      default:
        break
    }
  }

  //---------------------------------------------------------------------
  return userRoute()
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
