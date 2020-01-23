/**
 * @file auth.js
 * @brief 로그인영역
 * @todo 반응형으로 처리되어야함
 */
import React, {useEffect, useState, useContext} from 'react'
import styled from 'styled-components'
//components
import {GoogleLogin} from 'react-google-login'
import KakaoLogin from 'react-kakao-login'
import NaverLogin from 'react-naver-login'
import FacebookLogin from 'react-facebook-login'
import {osName, browserName} from 'react-device-detect'
//context
import Api from 'Context/api'
import {Hybrid} from 'Context/hybrid'

//context
import {Context} from 'Context'
import {switchCase} from '@babel/types'

export default props => {
  const [state, setState] = useState(false)
  const [fetch, setFetch] = useState(null)
  const context = useContext(Context)

  //fetch
  async function fetchData(obj, ostype) {
    console.log(JSON.stringify(obj))
    let loginId = ''
    let loginOs

    if (osName == 'IOS') loginOs = 2
    else if (osName == 'Android') loginOs = 1
    else loginOs = 0

    switch (ostype) {
      case 'g':
        loginId = obj.googleId
        break
      case 'f':
        break
      case 'k':
        break
      case 'n':
        break
      default:
        loginId = obj.googleId
        break
    }
    console.log('id = ' + loginId)
    const res = await Api.member_login({
      data: {
        memType: ostype,
        memId: loginId,
        os: loginOs
      }
    })
    // console.log('구글아이디 = ' + obj.googleId)
    // console.log('이미지 = ' + obj.imageUrl)
    // console.log('닉네임 = ' + obj.nickName)

    setFetch(res)
    ///----- memb
    //ios

    const loginInfo = {
      loginID: obj.profileObj.googleId ? obj.profileObj.googleId : '',
      loginName: obj.profileObj.name ? obj.profileObj.name : '',
      loginNickNm: '',
      gender: obj.profileObj.gender ? obj.profileObj.gender : 'm',
      birth: obj.profileObj.birth ? obj.profileObj.birth : '20201010',
      image: obj.profileObj.imageUrl ? obj.profileObj.imageUrl : ''
    }
    console.log('loginInfo = ' + JSON.stringify(loginInfo))
    if (res && res.code) {
      if (res.code == 0) {
        //Webview 에서 native 와 데이터 주고 받을때 아래와 같이 사용
        Hybrid('GetLoginToken', res.data)

        console.log('props.history = ' + props.history)
        if (props.history) {
          props.history.push('/')
          context.action.updatePopupVisible(false)
        }
        context.action.updateLogin(true)
        //window.location.href = '/' // 홈페이지로 새로고침
      } else {
        context.action.updatePopupVisible(false)
        context.action.updateLogin(false)
        if (props.history) {
          switch (ostype) {
            case 'g':
              //props.history.push('/user', obj.profileObj)
              props.history.push('/user', loginInfo)
              break
            default:
          }
        }
      }
      alert(res.message)
    } else {
      console.error('서버에서 결과 코드가 안내려옴')
      context.action.updateLogin(false)
    }
  }

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
    console.log(response)
    fetchData(response, 'g')
  }
  const responseGoogleFail = err => {
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
        redirectUri="http://localhost:9000/live"
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
