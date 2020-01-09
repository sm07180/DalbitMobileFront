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

const responseFacebook = () => {
  console.log('성공')
}

const ComponentClicked = () => {
  console.log('clicked')
}

export default () => {
  //---------------------------------------------------------------------
  return (
    <Login>
      <GoogleLogin clienrId={process.env.REACT_APP_Goolgle} buttonText="Google" onSuccess={'성공1'} onFailure={'실패'} />
      <KakaoLogin />
      <NaverLogin />
      <FacebookLogin
        appId="2418533275143361"
        autoLoad={true} //실행과 동시에 자동으로 로그인 팝업창이 뜸
        fields="name,email,picture" //어떤 정보를 받아올지 입력하는 필드
        onClick={ComponentClicked}
        callback={responseFacebook}
      />
    </Login>
  )
}
//---------------------------------------------------------------------
const Login = styled.div`
  width: 800px;
  height: 400px;
  background: #fff;
`
