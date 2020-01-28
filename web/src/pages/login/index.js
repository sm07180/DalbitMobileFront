/**
 * @file /login/index.js
 * @brief 로그인
 */
import React, {useEffect, useState} from 'react'
import styled from 'styled-components'

//layout
import Layout from 'Pages/common/layout'

//context
import {COLOR_WHITE, COLOR_MAIN, COLOR_POINT_Y} from 'Context/color'
import {IMG_SERVER, WIDTH_PC, WIDTH_TABLET} from 'Context/config'

//components
import Api from 'Context/api'
//
import {GoogleLogin} from 'react-google-login'
import KakaoLogin from 'react-kakao-login'
import NaverLogin from 'react-naver-login'
import FacebookLogin from 'react-facebook-login'

export default props => {
  //---------------------------------------------------------------------
  const [fetch, setFetch] = useState(null)
  //fetch
  //Get 방식일때 사용 가능한 가이드
  async function fetchData(obj) {
    const res = await Api.member_login({
      data: {
        id1: '010-1234-7412',
        password: '1234'
      }
    })
    //alert(JSON.stringify(res))
    setFetch(res)
    console.log(res)
  }
  // useEffect(() => {
  //   fetchData()
  // }, [])
  //---------------------------------------------------------------------
  return (
    <Layout {...props}>
      <section>
        <LoginWrap>
          <Logo>
            <img src={`${IMG_SERVER}/images/api/ic_logo_normal.png`} />
          </Logo>
          <LoginInput>
            <input type="text" placeholder="전화번호" />
            <input type="password" placeholder="비밀번호" />
          </LoginInput>
          <LoginSubmit>로그인</LoginSubmit>
          <ButtonArea>
            <input type="checkbox" id="keeplogin" />
            <label htmlFor="keeplogin">로그인 유지</label>
            <div>
              <button>비밀번호 찾기</button>
              <button>회원가입</button>
            </div>
          </ButtonArea>
          <SocialLogin>
            <GoogleLogin
              clientId="93062921102-3fmrfjf2915isd42tjl8m2f9vhpc9j31.apps.googleusercontent.com"
              // onSuccess={responseGoogle}
              // onFailure={responseGoogleFail}
              buttonText="LOGIN WITH GOOGLE"
              cookiePolicy={'single_host_origin'}
              redirectUri="http://localhost:9000/live"
            />

            <div></div>
            <div></div>
            <div></div>
          </SocialLogin>
        </LoginWrap>
      </section>
    </Layout>
  )
}

const Logo = styled.div`
  margin: 60px 0 50px 0;
  text-align: center;
`
const LoginWrap = styled.div`
  width: 394px;
  margin: 40px auto;
`

const LoginInput = styled.div`
  input {
    width: 100%;
    border: 1px solid #e5e5e5;
    font-size: 16px;
    line-height: 56px;
    text-indent: 18px;
  }
  input + input {
    margin-top: 14px;
  }
`
const LoginSubmit = styled.button`
  width: 100%;
  margin-top: 14px;
  background: ${COLOR_MAIN};
  color: #fff;
  font-size: 20px;
  font-weight: bold;
  line-height: 64px;
`

const ButtonArea = styled.div`
  margin-top: 20px;
  label {
    padding-left: 5px;
    color: #555;
  }
  div {
    float: right;
    button {
      color: ${COLOR_MAIN};
    }
    button + button::before {
      display: inline-block;
      width: 1px;
      height: 12px;
      margin: 0 10px -1px 10px;
      background: ${COLOR_MAIN};
      content: '';
    }
  }
`

const SocialLogin = styled.div`
  margin: 80px 0 60px 0;
  div {
    float: left;
    width: 48.5%;
    height: 48px;
    margin-left: 3%;
    margin-bottom: 12px;
    background: #f5f5f5;
  }
  div:nth-child(2n + 1) {
    margin-left: 0;
  }
  &:after {
    display: block;
    clear: both;
    content: '';
  }
`
