// context
import {Context} from 'context'
import Api from 'context/api'
import {COLOR_MAIN} from 'context/color'
import {OS_TYPE} from 'context/config.js'
import {Hybrid, isHybrid} from 'context/hybrid'
// component
import Layout from 'pages/common/layout'
import closeBtn from 'pages/menu/static/ic_close.svg'
import qs from 'query-string'
import React, {useContext, useEffect, useRef, useState} from 'react'
import {Redirect, Switch} from 'react-router-dom'
import styled from 'styled-components'
import appleLogo from './static/apple_logo.svg'
import facebookLogo from './static/facebook_logo.svg'
import googleLogo from './static/google_logo.svg'
import kakaoLogo from './static/kakao_logo.svg'
import naverLogo from './static/naver_logo.svg'

export default (props) => {
  const globalCtx = useContext(Context)
  const {token} = globalCtx
  const {webview, redirect} = qs.parse(location.search)

  const inputPhoneRef = useRef()
  const inputPasswordRef = useRef()

  const [fetching, setFetching] = useState(false)
  const [phoneNum, setPhoneNum] = useState('')
  const [password, setPassword] = useState('')

  const [appleAlert, setAppleAlert] = useState(false)
  const customHeader = JSON.parse(Api.customHeader)

  const changePhoneNum = (e) => {
    const target = e.currentTarget
    setPhoneNum(target.value.toLowerCase())
  }

  const changePassword = (e) => {
    const target = e.currentTarget
    setPassword(target.value.toLowerCase())
  }

  const clickCloseBtn = () => {
    if (isHybrid() && webview && webview === 'new') {
      Hybrid('CloseLayerPopup')
    } else {
      window.location.href = '/'
      // window.history.back()
    }
  }

  const clickLoginBtn = () => {
    if (fetching) {
      return
    }
    let sessionRoomNo = sessionStorage.getItem('room_no')
    if (sessionRoomNo === undefined) {
      sessionRoomNo = ''
    }
    const fetchPhoneLogin = async (phone, pw) => {
      setFetching(true)
      const loginInfo = await Api.member_login({
        data: {
          memType: 'p',
          memId: phone,
          memPwd: pw,
          room_no: sessionRoomNo
        }
      })

      if (loginInfo.result === 'success') {
        const {memNo} = loginInfo.data

        //--##
        /**
         * @마이페이지 redirect
         */
        let mypageURL = ''
        const _parse = qs.parse(location.search)
        if (_parse !== undefined && _parse.mypage_redirect === 'yes') {
          mypageURL = `/mypage/${memNo}`
          if (_parse.mypage !== '/') mypageURL = `/mypage/${memNo}${_parse.mypage}`
        }

        globalCtx.action.updateToken(loginInfo.data)
        const profileInfo = await Api.profile({params: {memNo}})

        if (profileInfo.result === 'success') {
          if (isHybrid()) {
            if (webview && webview === 'new') {
              Hybrid('GetLoginTokenNewWin', loginInfo.data)
            } else {
              Hybrid('GetLoginToken', loginInfo.data)
            }
          }

          if (redirect) {
            const decodedUrl = decodeURIComponent(redirect)
            return (window.location.href = decodedUrl)
          }
          globalCtx.action.updateProfile(profileInfo.data)

          //--##마이페이지 Redirect
          if (mypageURL !== '') {
            return (window.location.href = mypageURL)
          }

          return props.history.push('/')
        }
      } else if (loginInfo.result === 'fail') {
        if (loginInfo.code === '-1') {
          globalCtx.action.alert({
            msg: `아이디(전화번호)와 비밀번호를 확인하고 다시 로그인해주세요.`
          })
        } else if (loginInfo.code === '-3' || loginInfo.code === '-5') {
          let msg = loginInfo.data.opMsg
          if (msg === undefined || msg === null || msg === '') {
            msg = loginInfo.message
          }
          globalCtx.action.alert({
            title: '달빛라이브 사용 제한',
            msg: `${msg}`,
            callback: () => {
              if (webview && webview === 'new') {
                Hybrid('CloseLayerPopUp')
              }
            }
          })
        } else {
          globalCtx.action.alert({
            title: '로그인 실패',
            msg: `${loginInfo.message}`
          })
        }
      }

      setFetching(false)
    }

    const inputPhoneNode = inputPhoneRef.current
    const inputPasswordNode = inputPasswordRef.current

    if (phoneNum === '' && password === '') {
      globalCtx.action.alert({
        msg: `아이디(전화번호)와 비밀번호를 입력하고 다시 로그인해주세요.`,
        callback: () => {
          inputPhoneNode.focus()
        }
      })
    } else if (phoneNum === '' && password !== '') {
      globalCtx.action.alert({
        msg: `아이디(전화번호)를 입력하고 다시 로그인해주세요.`,
        callback: () => {
          inputPhoneNode.focus()
        }
      })
    } else if (password === '' && phoneNum !== '') {
      globalCtx.action.alert({
        msg: `비밀번호를 입력하고 다시 로그인해주세요.`,
        callback: () => {
          inputPasswordNode.focus()
        }
      })
    } else {
      fetchPhoneLogin(phoneNum, password)
    }
  }

  const fetchSocialData = async (vendor) => {
    if (vendor === 'apple') {
      setTimeout(() => {
        setAppleAlert(true)
      }, 1000)
    } else {
      setAppleAlert(false)
    }

    if (vendor === 'google' && (customHeader['os'] === OS_TYPE['Android'] || customHeader['os'] === OS_TYPE['IOS'])) {
      //TODO: 새창로그인 여부 추가
      //Hybrid('openGoogleSignIn', {'webview' : webview})
      Hybrid('openGoogleSignIn')
    } else {
      const res = await fetch(`${__SOCIAL_URL}/${vendor}?target=mobile&pop=${webview}`, {
        method: 'get',
        headers: {
          authToken: Api.authToken,
          'custom-header': Api.customHeader,
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
        }
      })

      if (res.status === 200) {
        const redirectUrl = await res.text()
        return (window.location.href = `${redirectUrl}`)
      }
    }
  }

  useEffect(() => {
    if (window.sessionStorage) {
      const exceptionList = ['room_no', 'room_info', 'push_type']
      Object.keys(window.sessionStorage).forEach((key) => {
        if (!exceptionList.includes(key)) {
          sessionStorage.removeItem(key)
        }
      })
    }
  }, [])

  return (
    <Layout {...props} status="no_gnb">
      <Switch>
        {token && token.isLogin ? (
          <Redirect to={'/'} />
        ) : (
          <Login>
            <img className="close-btn" src={closeBtn} onClick={clickCloseBtn} />
            <div>
              <img
                className="logo"
                src="https://image.dalbitlive.com/images/api/logo_p_l_new.png"
                onClick={() => {
                  if (!webview) {
                    window.location.href = '/'
                  }
                }}
              />
            </div>

            <div className="input-wrap">
              <input
                ref={inputPhoneRef}
                type="number"
                autoComplete="off"
                placeholder="전화번호"
                value={phoneNum}
                onChange={changePhoneNum}
                onKeyDown={(e) => {
                  const {keyCode} = e
                  // Number 96 - 105 , 48 - 57
                  // Delete 8, 46
                  // Tab 9
                  if (
                    keyCode === 9 ||
                    keyCode === 8 ||
                    keyCode === 46 ||
                    (keyCode >= 48 && keyCode <= 57) ||
                    (keyCode >= 96 && keyCode <= 105)
                  ) {
                    return
                  }
                  e.preventDefault()
                }}
              />
              <input
                ref={inputPasswordRef}
                type="password"
                autoComplete="new-password"
                placeholder="비밀번호"
                value={password}
                onChange={changePassword}
              />
              <button className="login-btn" onClick={clickLoginBtn}>
                로그인
              </button>
            </div>

            <div className="link-wrap">
              <a href="/password">
                <div className="link-text">비밀번호 변경</div>
              </a>
              <div className="bar" />
              <a href="/signup">
                <div className="link-text">회원가입</div>
              </a>
            </div>

            <SocialLoginWrap>
              <div className="line-wrap">
                <button className="social-apple-btn" onClick={() => fetchSocialData('apple')}>
                  <img className="icon" src={appleLogo} />
                </button>
                <button className="social-facebook-btn" onClick={() => fetchSocialData('facebook')}>
                  <img className="icon" src={facebookLogo} />
                </button>
                <button className="social-naver-btn" onClick={() => fetchSocialData('naver')}>
                  <img className="icon" src={naverLogo} />
                </button>
                <button className="social-kakao-btn" onClick={() => fetchSocialData('kakao')}>
                  <img className="icon" src={kakaoLogo} />
                </button>
                {((customHeader['os'] === OS_TYPE['Android'] && (__NODE_ENV === 'dev' || customHeader['appBuild'] > 3)) ||
                  (customHeader['os'] === OS_TYPE['IOS'] && (customHeader['appBulid'] > 52 || customHeader['appBuild'] > 52)) ||
                  customHeader['os'] === OS_TYPE['Desktop']) && (
                  <button className="social-google-btn" onClick={() => fetchSocialData('google')}>
                    <img className="icon" src={googleLogo} />
                  </button>
                )}
              </div>
              {appleAlert && <div className="apple-alert">OS를 최신 버전으로 설치해주세요.</div>}
            </SocialLoginWrap>
          </Login>
        )}
      </Switch>
    </Layout>
  )
}

const SocialLoginWrap = styled.div`
  margin-top: 40px;
  margin-bottom: 120px;

  .line-wrap {
    /* display: flex;
    flex-direction: row;
    justify-content: space-around; */
    /* align-items: center; */
    text-align: center;

    .social-apple-btn {
      width: 48px;
      height: 48px;
      border-radius: 25px;
      border: solid 1px #000000;
      background-color: #000000;
      margin-right: 12px;
    }

    .social-facebook-btn {
      width: 48px;
      height: 48px;
      border-radius: 25px;
      border: solid 1px #4064ad;
      background-color: #ffffff;
      margin-right: 12px;
    }

    .social-naver-btn {
      width: 48px;
      height: 48px;
      border-radius: 25px;
      background-color: #2db400;
      margin-right: 12px;
    }

    .social-kakao-btn {
      width: 48px;
      height: 48px;
      border-radius: 25px;
      background-color: #f9e000;
      margin-right: 12px;
    }

    .social-google-btn {
      width: 48px;
      height: 48px;
      border-radius: 25px;
      border: solid 1px #4285f4;
      background-color: #ffffff;
    }
  }

  .apple-alert {
    width: 240px;
    height: 34px;
    border-radius: 17px;
    margin: 0 auto;
    margin-top: 10px;
    background-color: #000;
    text-align: center;
    color: #ffd500;
    line-height: 34px;
    font-size: 14px;
  }
`

const Login = styled.div`
  position: relative;
  margin: 0 auto;

  .close-btn {
    position: absolute;
    right: 10px;
    top: 6px;
  }

  .logo {
    display: block;
    margin: 0 auto;
    padding: 70px 0 50px;
    width: 150px;
    max-width: 220px;
  }

  .input-wrap {
    width: 300px;
    margin: 0 auto;
    input {
      display: block;
      border: 1px solid #e5e5e5;
      padding: 16px;
      width: 100%;
      height: 56px;
      border-radius: 28px;
      color: #616161;
      font-size: 16px;
      letter-spacing: -0.4px;
    }
    input[type='password'] {
      margin-top: 12px;
    }
    input:focus {
      border: 1px solid ${COLOR_MAIN};
    }
    .login-btn {
      display: block;
      margin-top: 12px;
      width: 100%;
      background-color: #632beb;
      color: #fff;
      font-size: 20px;
      font-weight: 600;
      letter-spacing: -0.5px;
      padding: 17px 0;
      border-radius: 28px;
    }
  }

  .link-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 26px 0;

    .link-text {
      color: #632beb;
      font-size: 16px;
      letter-spacing: -0.64px;
    }

    .bar {
      width: 1px;
      height: 16px;
      background-color: #e5e5e5;
      margin: 0 10px;
    }
  }
`
