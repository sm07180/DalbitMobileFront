/**
 *
 */
import React, {useEffect, useContext, useState} from 'react'
//context
import {Context} from 'context'
import Api from 'context/api'
import {Hybrid} from 'context/hybrid'
//components
import Utility from 'components/lib/utility'
import Content from './content'

export default props => {
  //---------------------------------------------------------------------
  //context
  const context = useContext(Context)
  //useState
  //const [Fbstate, setFbState] = userState({isLoggedIn: false, userID: '', name: '', email: '', picture: ''})
  const [fetch, setFetch] = useState(null)
  const {changes, setChanges, onChange} = useChange(update, {onChange: -1})
  //const [changes, setChanges] = useState({})
  let loginId = '',
    loginName = '',
    loginImg = '',
    loginPwd = '',
    loginEmail = '',
    loginNicknm = '',
    gender = ''
  //---------------------------------------------------------------------
  //fetch
  async function fetchData(obj, ostype) {
    switch (ostype) {
      case 'g':
        loginId = typeof obj.additionalUserInfo.profile !== 'undefined' ? obj.additionalUserInfo.profile.id : ''
        loginName = typeof obj.additionalUserInfo.profile !== 'undefined' ? obj.additionalUserInfo.profile.name : ''
        loginImg = typeof obj.additionalUserInfo.profile !== 'undefined' ? obj.additionalUserInfo.profile.picture : ''
        break
      case 'f':
        loginId = typeof obj !== 'undefined' ? obj.userID : ''
        loginName = typeof obj !== 'undefined' ? obj.name : ''
        loginImg = typeof obj.picture !== 'undefined' ? obj.picture.data.url : ''

        break
      case 'k':
        loginId = typeof obj.profile !== 'undefined' ? obj.profile.id : ''
        loginNicknm = typeof obj.profile.properties !== 'undefined' ? obj.profile.properties.nickname : ''
        loginImg = typeof obj.profile.properties !== 'undefined' ? obj.profile.properties.profile_image : ''
        loginEmail = typeof obj.profile.properties !== 'undefined' ? obj.profile.properties.email : ''
        if (gender && typeof gender !== 'undefined') {
          gender = obj.profile.kakao_account.gender === 'male' ? 'm' : 'f'
        }
        break
      case 'n':
        loginId = typeof obj !== 'undefiend' ? obj.id : ''
        loginName = typeof obj !== 'undefiend' ? obj.name : ''
        loginNicknm = typeof obj !== 'undefiend' ? obj.nickname : '' //네이버는 닉네임이 ex) gurenn***
        loginImg = typeof obj !== 'undefiend' ? obj.profile_image : ''
        loginEmail = typeof obj !== 'undefiend' ? obj.email : ''
        if (gender && typeof gender !== 'undefined') {
          gender = obj.gender.toLowerCase()
        }
        break
      default:
        loginId = typeof obj !== 'undefiend' ? obj.phone : ''
        loginPwd = typeof obj !== 'undefiend' ? obj.pwd : ''

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
        memPwd: loginPwd
      }
    })

    setFetch(res)

    const loginInfo = {
      loginID: loginId,
      loginName: loginName,
      loginNickNm: loginNicknm,
      gender: gender ? gender : 'm',
      birth: '',
      image: loginImg,
      memType: ostype,
      email: loginEmail
    }
    console.log('loginInfo = ' + JSON.stringify(loginInfo))
    if (res && res.code) {
      if (res.code == 0) {
        //Webview 에서 native 와 데이터 주고 받을때 아래와 같이 사용
        console.table(res.data)
        /*
         * 로그인정상
         */
        //token Update
        Api.setAuthToken(res.data.authToken)
        context.action.updateToken(res.data)
        //native 전달
        Hybrid('GetLoginToken', mode.loginSuccess)
        //redirect
        if (props.history) {
          props.history.push('/')
          context.action.updatePopupVisible(false)
          context.action.updateGnbVisible(false)
        }

        //context.action.updateState(res.data)
        //context.action.updateLogin(true)
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
            if (ostype === 'n') {
              localStorage.removeItem('com.naver.nid.access_token')
              localStorage.removeItem('com.naver.nid.oauth.state_token')
            }

            props.history.push('/')
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
  //update
  function update(mode) {
    switch (true) {
      case mode.onChange !== undefined:
        //console.log(JSON.stringify(changes))
        break
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
    //fetchData(response, 'f')
  }
  const responseFacebookCallback = response => {
    // status는 앱 사용자의 로그인 상태를 지정합니다. 상태는 다음 중 하나일 수 있습니다.
    // connected - 사용자가 Facebook에 로그인하고 앱에 로그인했습니다.
    // not_authorized - 사용자가 Facebook에는 로그인했지만 앱에는 로그인하지 않았습니다.
    // unknown - 사용자가 Facebook에 로그인하지 않았으므로 사용자가 앱에 로그인했거나 FB.logout()이 호출되었는지 알 수 없어, Facebook에 연결할 수 없습니다.
    // connected 상태인 경우 authResponse가 포함되며 다음과 같이 구성되어 있습니다.
    // accessToken - 앱 사용자의 액세스 토큰이 포함되어 있습니다.
    // expiresIn - 토큰이 만료되어 갱신해야 하는 UNIX 시간을 표시합니다.
    // signedRequest - 앱 사용자에 대한 정보를 포함하는 서명된 매개변수입니다.
    // userID - 앱 사용자의 ID입니다.
    if (response && response.id) {
      fetchData(response, 'f')
    }
    console.log('responseFacebookCallback')

    //fetchData(response, 'f')
  }
  const responseNaver = response => {
    console.log('32123321312321321')()
    console.log('responseNaver')

    fetchData(response, 'n')
  }
  const responseKakao = response => {
    console.log(response)
    fetchData(response, 'k')
  }
  const responseGoogle = response => {
    //console.log(response)
    fetchData(response, 'g')
  }
  const responseGoogleFail = err => {
    //console.error(err)
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
    var naverLogin = new naver.LoginWithNaverId({
      clientId: 'WK0ohRsfYc9aBhZkyApJ',
      callbackUrl: 'https://devm-hgkim1118.dalbitcast.com/login',
      isPopup: false,
      loginButton: {color: 'green', type: 3, height: 60} /* 로그인 버튼의 타입을 지정 */,
      callbackHandle: false
    })
    naverLogin.init()

    naverLogin.getLoginStatus(function(status) {
      if (status) {
        var email = naverLogin.user.getEmail()
        var name = naverLogin.user.getNickName()
        var profileImage = naverLogin.user.getProfileImage()
        var birthday = naverLogin.user.getBirthday()
        var uniqId = naverLogin.user.getId()
        var age = naverLogin.user.getAge()

        if (!context.token.isLogin) {
          fetchData(naverLogin.user, 'n')
        }
      } else {
        console.log('AccessToken이 올바르지 않습니다.')
      }
    })
  }, [])

  // const loadData = () => {
  //   var el = document.getElementById('naverIdLogin')
  //   el.addEventListener('load', function() {
  //     console.warn('asdasdasd')
  //     naverLogin.getLoginStatus(function(status) {
  //       if (status) {
  //         /* (5) 필수적으로 받아야하는 프로필 정보가 있다면 callback처리 시점에 체크 */
  //         var email = naverLogin.user.getEmail()
  //         if (email == undefined || email == null) {
  //           alert('이메일은 필수정보입니다. 정보제공을 동의해주세요.')
  //           /* (5-1) 사용자 정보 재동의를 위하여 다시 네아로 동의페이지로 이동함 */
  //           naverLogin.reprompt()
  //           return
  //         }
  //         window.location.replace('http://' + window.location.hostname + (location.port == '' || location.port == undefined ? '' : ':' + location.port) + '/sample/main.html')
  //       } else {
  //         console.log('callback 처리에 실패하였습니다.')
  //       }
  //     })
  //   })
  // }

  //---------------------------------------------------------------------
  return (
    <React.Fragment>
      <Content {...props} update={update} />
    </React.Fragment>
  )
}
