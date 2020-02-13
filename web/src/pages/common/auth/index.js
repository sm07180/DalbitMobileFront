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

import {signInWithGoogle, auth} from 'components/lib/firebase.utils'
//import FacebookLogin from 'pages/common/auth/fbAuth'
//context
import {Context} from 'context'
import {arrayTypeAnnotation} from '@babel/types'
//import {switchCase} from '@babel/types'

export default props => {
  const [state, setState] = useState(false)
  //const [Fbstate, setFbState] = userState({isLoggedIn: false, userID: '', name: '', email: '', picture: ''})
  const [fetch, setFetch] = useState(null)
  const [changes, setChanges] = useState({})

  const context = useContext(Context)

  let loginId = ''
  let loginName = ''
  let loginImg = ''
  let loginOs = ''
  let loginPwd = ''

  if (osName == 'IOS') loginOs = 2
  else if (osName == 'Android') loginOs = 1
  else loginOs = 3
  //fetch
  async function fetchData(obj, ostype) {
    switch (ostype) {
      case 'g':
        loginId = obj.additionalUserInfo.profile.id
        loginName = obj.additionalUserInfo.profile.name
        loginImg = obj.additionalUserInfo.profile.picture
        break
      case 'f':
        loginId = obj.userID
        loginName = obj.name
        loginImg = obj.picture.data.url

        break
      case 'k':
        break
      case 'n':
        break
      default:
        loginId = obj.phone
        loginPwd = obj.pwd

        if (typeof loginId === 'undefined' || !loginId) {
          alert('휴대폰번호를 입력해 주세요')
          return
        } else if (typeof loginPwd === 'undefined' || !loginPwd) {
          alert('비밀번호를 입력해 주세요')
          return
        }
        break
    }

    const res = await Api.member_login({
      data: {
        memType: ostype,
        memId: loginId,
        memPwd: loginPwd,
        os: context.customHeader.os,
        deviceId: context.customHeader.deviceId
      }
    })

    setFetch(res)

    const loginInfo = {
      loginID: loginId,
      loginName: loginName,
      loginNickNm: '',
      gender: 'm',
      birth: '',
      image: loginImg,
      memType: ostype,
      osName: context.customHeader.os
    }
    console.log('loginInfo = ' + JSON.stringify(loginInfo))
    if (res && res.code) {
      if (res.code == 0) {
        //Webview 에서 native 와 데이터 주고 받을때 아래와 같이 사용
        console.log(res.data)
        /*
         * 로그인정상
         */
        //token Update
        context.action.updateToken(res.data)
        //native 전달
        Hybrid('GetLoginToken', res.data)
        if (props.history) {
          props.history.push('/')
          context.action.updatePopupVisible(false)
        }
        context.action.updateState(res.data)
        context.action.updateLogin(true)

        // auth.onAuthStateChanged(user => {
        //   console.log('user = ' + user)
        //   // SetloginStatus({currentUser: user})
        // })

        //window.location.href = '/' // 홈페이지로 새로고침
      } else {
        context.action.updatePopupVisible(false)
        context.action.updateLogin(false)
        let result = confirm(res.message)
        if (props.history) {
          switch (ostype) {
            case 'g':
              //props.history.push('/user', obj.profileObj)
              //props.history.push('/user/join', loginInfo)
              break
            default:
          }

          if (result) {
            props.history.push('/user/join', loginInfo)
          } else {
            alert('회원가입 실패 메인이동')
          }
        }
      }
      //alert(res.message)
    } else {
      console.error('서버에서 결과 코드가 안내려옴')
      context.action.updateLogin(false)
    }
  }

  // Facebook에서 성별,생일 권한은 다시 권한 요청이 있어 버린다.
  const responseFacebook = response => {
    // status는 앱 사용자의 로그인 상태를 지정합니다. 상태는 다음 중 하나일 수 있습니다.
    // connected - 사용자가 Facebook에 로그인하고 앱에 로그인했습니다.
    // not_authorized - 사용자가 Facebook에는 로그인했지만 앱에는 로그인하지 않았습니다.
    // unknown - 사용자가 Facebook에 로그인하지 않았으므로 사용자가 앱에 로그인했거나 FB.logout()이 호출되었는지 알 수 없어, Facebook에 연결할 수 없습니다.
    // connected 상태인 경우 authResponse가 포함되며 다음과 같이 구성되어 있습니다.
    // accessToken - 앱 사용자의 액세스 토큰이 포함되어 있습니다.
    // expiresIn - 토큰이 만료되어 갱신해야 하는 UNIX 시간을 표시합니다.
    // signedRequest - 앱 사용자에 대한 정보를 포함하는 서명된 매개변수입니다.
    // userID - 앱 사용자의 ID입니다.

    fetchData(response, 'f')
  }
  const ComponentClicked = response => {
    console.log('FB login click =' + response)
  }
  const responseNaver = response => {
    //console.log(response)
  }
  const responseKakao = response => {
    //console.log(response)
  }
  const responseGoogle = response => {
    //console.log(response)
    fetchData(response, 'g')
  }
  const responseGoogleFail = err => {
    //console.error(err)
  }
  const onLoginHandleChange = e => {
    setChanges({...changes, [e.target.name]: e.target.value})
  }
  function responseGooglelogin() {
    // signInWithGoogle().then(function(result) {
    //   //console.log(result)
    //   // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    //   var token = result.credential.accessToken
    //   // The signed-in user info.
    //   var user = result.user
    //   // console.log('GoogleToken = ' + token)
    //   // console.log('user = ' + user)
    //   // auth.onAuthStateChanged(function(user) {
    //   //   if (user) {
    //   //     // User is signed in.
    //   //     console.log('user2= ' + user)
    //   //   }
    //   // })
    //   fetchData(result, 'g')
    //   //alert(JSON.stringify(result, null, 1))
    //   // SetloginStatus(true)
    // }),
    //   function(error) {
    //     // The provider's account email, can be used in case of
    //     // auth/account-exists-with-different-credential to fetch the providers
    //     // linked to the email:
    //     var email = error.email
    //     // The provider's credential:
    //     var credential = error.credential
    //     // In case of auth/account-exists-with-different-credential error,
    //     // you can fetch the providers using this:
    //     if (error.code === 'auth/account-exists-with-different-credential') {
    //       auth.fetchSignInMethodsForEmail(email).then(function(providers) {
    //         // The returned 'providers' is a list of the available providers
    //         // linked to the email address. Please refer to the guide for a more
    //         // complete explanation on how to recover from this error.
    //       })
    //     }
    //   }
  }
  useEffect(() => {
    //console.log('changes = ' + JSON.stringify(changes))
  }, [changes])
  //---------------------------------------------------------------------
  return (
    <LoginWrap>
      {window.location.pathname === '/login' ? (
        ''
      ) : (
        <Logo className="logo">
          <img src={`${IMG_SERVER}/images/api/ic_logo_normal.png`} />
        </Logo>
      )}

      <LoginInput>
        <input type="text" name="phone" placeholder="전화번호" onChange={onLoginHandleChange} />
        <input type="password" name="pwd" placeholder="비밀번호" onChange={onLoginHandleChange} />
      </LoginInput>
      <LoginSubmit
        onClick={() => {
          fetchData({...changes}, 'p')
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
              context.action.updatePopupVisible(false)
            }}>
            비밀번호 변경
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

      <SocialLogin>
        <FacebookLogin
          appId="2711342585755275"
          autoLoad={false} //실행과 동시에 자동으로 로그인 팝업창이 뜸
          fields="name,email,picture" //어떤 정보를 받아올지 입력하는 필드
          scope="public_profile,email"
          onClick={ComponentClicked}
          callback={responseFacebook}
          // cssClass="my-facebook-button-class"
          // icon="fa-facebook"
        />
      </SocialLogin>
      {/* <NaverLogin
        clientId="OQtHPCzpdRNtD9o2zBKF"
        callbackUrl="http://localhost:9000"
        render={props => <div onClick={props.onClick}>Naver Login</div>}
        onSuccess={responseNaver}
        onFailure={responseNaver}
      /> */}
      {/* <CustomButton onClick={signInWithGoogle}>SIGN IN WITH GOOGLE</CustomButton> */}

      {/* <SnsGoogleLogion onClick={() => responseGooglelogin()}>
        SIGN IN WITH GOOGLE
      </SnsGoogleLogion> */}

      {/* <CustomButton onClick={() => signInWithGoogle}>SIGN IN WITH GOOGLE</CustomButton> */}
      {/* <button onClick={signOut}>Sign out</button> */}
      {/* {currentUser ? (
        <div className="option" onClick={() => auth.signOut()}>
          SIGN OUT
        </div>
      ) : (
        <Link className="option" to="/signin">
          SIGN IN
        </Link>
      )} */}
      {/* <GoogleLogin
        clientId="76445230270-03g60q4kooi6qg0qvtjtnqqnn70juulc.apps.googleusercontent.com"
        onSuccess={responseGoogle}
        onFailure={responseGoogleFail}
        render={renderProps => (
          <button onClick={renderProps.onClick} disabled={renderProps.disabled}>
            LOGIN WITH GOOGLE
          </button>
        )}
        cookiePolicy={'single_host_origin'}
      /> */}
      {/* <KakaoLogin jsKey="b5792aba333bad75301693e5f39b6e90" onSuccess={responseKakao} buttonText="LOGIN WITH KAKAO" onFailure={responseKakao} useDefaultStyle={true} getProfile={true} /> */}
    </LoginWrap>
  )
}

//---------------------------------------------------------------------
const Login = styled.div`
  width: 100%;
  height: 100%;
  background: #fff;
`

const Logo = styled.div`
  margin: 60px 0 50px 0;
  text-align: center;
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
  margin: 30px 0 0 0;
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
const SnsGoogleLogion = styled.button`
  padding: 10px 34px 10px 50px;
  border: 1px solid #e5e5e5;
  background: #fff url(https://devimage.dalbitcast.com/svg/ico-google.svg) no-repeat -1px -3px;
  color: #757575;
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
`
