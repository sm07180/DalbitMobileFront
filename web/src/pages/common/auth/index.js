/**
 * @file auth.js
 * @brief 로그인영역
 * @todo 반응형으로 처리되어야함
 */
import React, {useEffect} from 'react'
import styled from 'styled-components'
//components
import GoogleLogin from 'react-google-login'
import KakaoLogin from 'react-kakao-login'
import NaverLogin from 'react-naver-login'
import FacebookLogin from 'react-facebook-login'

// const StyledKakaoLogin = styled(KakaoLogin)`
//   display: inline-block;
//   padding: 0;
//   width: 222px;
//   height: 49px;
//   line-height: 49px;
//   color: #3c1e1e;
//   background-color: #ffeb00;
//   border: 1px solid transparent;
//   border-radius: 3px;
//   font-size: 16px;
//   text-align: center;
// `

export default () => {
  const responseFacebook = response => {
    if (response && response.name) console.log('RESTAPI POST!!!!')
  }

  const ComponentClicked = () => {
    console.log('clicked')
  }

  const responseNaver = result => {
    console.log(result)
  }
  const responseNaverFail = result => {
    console.log(result)
  }

  const responseKakao = result => {
    console.log(result)
  }
  const responseKakaoFail = result => {
    console.log(result)
  }

  const responseGoogle = result => {
    console.log(result)
  }
  const responseGoogleFail = result => {
    console.log(result)
  }

  //---------------------------------------------------------------------
  return (
    <Login>
      <FacebookLogin
        appId="2418533275143361"
        autoLoad={false} //실행과 동시에 자동으로 로그인 팝업창이 뜸
        fields="name,email,picture" //어떤 정보를 받아올지 입력하는 필드
        onClick={ComponentClicked}
        callback={responseFacebook}
      />
      <NaverLogin
        clientId="OQtHPCzpdRNtD9o2zBKF"
        callbackUrl="http://localhost:9000"
        render={props => <div onClick={props.onClick}>Naver Login</div>}
        onSuccess={responseNaver}
        onFailure={responseNaverFail}
      />

      <GoogleLogin
        clientId="93062921102-3fmrfjf2915isd42tjl8m2f9vhpc9j31.apps.googleusercontent.com"
        onSuccess={result => responseGoogle(result)}
        onFailure={result => responseGoogleFail(result)}
        cookiePolicy={'single_host_origin'}
      />
      <KakaoLogin jsKey="b5792aba333bad75301693e5f39b6e90" onSuccess={result => responseKakao(result)} onFailure={result => responseKakaoFail(result)} useDefaultStyle={true} getProfile={true} />
    </Login>
  )
}
//---------------------------------------------------------------------
const Login = styled.div`
  width: 400px;
  height: 400px;
  background: #fff;
`
