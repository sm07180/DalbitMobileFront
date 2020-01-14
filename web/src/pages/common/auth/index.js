/**
 * @file auth.js
 * @brief 로그인영역
 * @todo 반응형으로 처리되어야함
 */
import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
//components
import {GoogleLogin} from 'react-google-login'
import KakaoLogin from 'react-kakao-login'
import NaverLogin from 'react-naver-login'
import FacebookLogin from 'react-facebook-login'
import {setState} from 'expect/build/jestMatchersObject'

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
  const [state, setState] = useState(false)

  const signup = (res, type) => {
    if (type == 'facebook') {
      console.log('facebook')
    } else if (type == 'google') {
      console.log('google')
    }
  }
  // state = {
  //   isLoggedIn = false,
  //   userID : '',
  //   name:'',
  //   email:'',
  //   picture:''
  // }

  // Facebook에서 성별,생일 권한은 다시 권한 요청이 있어 버린다.
  const responseFacebook = response => {
    if (response && response.name) console.log('RESTAPI POST!!!!')
    console.log(response)
    // signup(response, 'facebook')

    // setState({
    //   isLoggedIn: true,
    //   userID: response.userID,
    //   name: response.name,
    //   email: response.email,
    //   picture: response.picture.data.callbackUrl
    // })
  }
  const ComponentClicked = response => {
    console.log(response)
  }
  const responseNaver = response => {
    console.log(response)
  }
  const responseKakao = response => {
    console.log(response)
  }
  const responseGoogle = response => {
    console.log('responseGoogleresult = ' + JSON.stringify(response))
    console.log(response)
    signup(response, 'google')
  }
  const responseGoogleFail = err => {
    console.log('responseGoogleresult = ' + JSON.stringify(err))
    console.error(err)
  }

  //---------------------------------------------------------------------
  return (
    <Login>
      <FacebookLogin
        appId="2418533275143361"
        autoLoad={false} //실행과 동시에 자동으로 로그인 팝업창이 뜸
        fields="name,email,picture" //어떤 정보를 받아올지 입력하는 필드
        scope="public_profile,email"
        onClick={ComponentClicked}
        callback={responseFacebook}
      />
      <NaverLogin
        clientId="OQtHPCzpdRNtD9o2zBKF"
        callbackUrl="http://localhost:9000"
        render={props => <div onClick={props.onClick}>Naver Login</div>}
        onSuccess={responseNaver}
        onFailure={responseNaver}
      />
      <GoogleLogin
        clientId="93062921102-3fmrfjf2915isd42tjl8m2f9vhpc9j31.apps.googleusercontent.com"
        onSuccess={responseGoogle}
        onFailure={responseGoogleFail}
        buttonText="LOGIN WITH GOOGLE"
        cookiePolicy={'single_host_origin'}
        redirectUri="http://localhost:8000"
      />
      <KakaoLogin jsKey="b5792aba333bad75301693e5f39b6e90" onSuccess={responseKakao} buttonText="LOGIN WITH KAKAO" onFailure={responseKakao} useDefaultStyle={true} getProfile={true} />
    </Login>
  )
}
//---------------------------------------------------------------------
const Login = styled.div`
  width: 400px;
  height: 400px;
  background: #fff;
`
