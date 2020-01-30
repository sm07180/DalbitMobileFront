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
import Api from 'context/api'
import {Hybrid} from 'context/hybrid'

//context
import {COLOR_WHITE, COLOR_MAIN, COLOR_POINT_Y} from 'context/color'
import {IMG_SERVER, WIDTH_PC, WIDTH_TABLET} from 'context/config'

//context
import {Context} from 'context'
//import {switchCase} from '@babel/types'

export default props => {
  const [state, setState] = useState(false)
  const [fetch, setFetch] = useState(null)
  const [changes, setChanges] = useState({})

  const context = useContext(Context)

  //fetch
  async function fetchData(obj, ostype) {
    console.log(JSON.stringify(obj))
    let loginId = ''
    let loginOs = ''
    let loginName = ''

    if (osName == 'IOS') loginOs = 2
    else if (osName == 'Android') loginOs = 1
    else loginOs = 0

    console.log('obj ------------------- ' + JSON.stringify(obj))
    switch (ostype) {
      case 'g':
        loginId = obj.googleId
        loginName = obj.profileObj.name
        break
      case 'f':
        break
      case 'k':
        break
      case 'n':
        break
      default:
        loginId = obj.phone
        break
    }

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
      loginID: loginId,
      loginName: loginName,
      loginNickNm: '',
      gender: 'm',
      birth: '20201010',
      image: ''
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
              props.history.push('/user/join', loginInfo)
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
  const onLoginHandleChange = e => {
    setChanges({...changes, [e.target.name]: e.target.value})
    console.log(changes)
  }
  //---------------------------------------------------------------------
  return (
    <LoginWrap>
      <LoginInput>
        <input type="text" name="phone" placeholder="전화번호" onChange={onLoginHandleChange} />
        <input type="password" name="password" placeholder="비밀번호" onChange={onLoginHandleChange} />
      </LoginInput>
      <LoginSubmit
        onClick={() => {
          fetchData({...changes}, 'p')
          // console.log('setPassword = ' + e.target)
          //fetchData()
        }}>
        로그인
      </LoginSubmit>
      <ButtonArea>
        <input type="checkbox" id="keeplogin" />
        <label htmlFor="keeplogin">로그인 유지</label>
        <div>
          <button
            onClick={() => {
              props.history.push('/user/password')
            }}>
            비밀번호 찾기
          </button>
          <button
            onClick={() => {
              props.history.push('/user/join')
              context.action.updatePopupVisible(false)
            }}>
            회원가입
          </button>
        </div>
      </ButtonArea>
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
        clientId="76445230270-03g60q4kooi6qg0qvtjtnqqnn70juulc.apps.googleusercontent.com"
        onSuccess={responseGoogle}
        onFailure={responseGoogleFail}
        buttonText="LOGIN WITH GOOGLE"
        cookiePolicy={'single_host_origin'}
      />
      <KakaoLogin jsKey="b5792aba333bad75301693e5f39b6e90" onSuccess={responseKakao} buttonText="LOGIN WITH KAKAO" onFailure={responseKakao} useDefaultStyle={true} getProfile={true} />
    </LoginWrap>
  )
}

//---------------------------------------------------------------------
const Login = styled.div`
  width: 100%;
  height: 100%;
  background: #fff;
`

const LoginWrap = styled.div``

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
