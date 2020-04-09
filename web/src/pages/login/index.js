import React, {useEffect, useState, useContext, useRef} from 'react'
import styled from 'styled-components'
import {Link, Switch, Redirect} from 'react-router-dom'

// component
import Layout from 'pages/common/layout'

// context
import {Context} from 'context'
import {Hybrid, isHybrid} from 'context/hybrid'

// static
import {IMG_SERVER} from 'context/config'
import closeBtn from 'pages/menu/static/ic_close.svg'
import naverLogo from './static/naver_logo.png'
import kakaoLogo from './static/kakao_logo.png'
import googleLogo from './static/google_logo.png'
import facebookLogo from './static/fb_logo.png'

import qs from 'query-string'
import Api from 'context/api'
import {COLOR_MAIN} from 'context/color'

export default props => {
  const globalCtx = useContext(Context)
  const {token} = globalCtx
  const {webview} = qs.parse(location.search)

  const inputPhoneRef = useRef()
  const inputPasswordRef = useRef()

  const [fetching, setFetching] = useState(false)
  const [phoneNum, setPhoneNum] = useState('')
  const [password, setPassword] = useState('')

  const changePhoneNum = e => {
    const target = e.currentTarget
    setPhoneNum(target.value.toLowerCase())
  }

  const changePassword = e => {
    const target = e.currentTarget
    setPassword(target.value.toLowerCase())
  }

  const clickCloseBtn = () => {
    if (isHybrid() && webview && webview === 'new') {
      Hybrid('CloseLayerPopup')
    } else {
      window.history.back()
    }
  }

  const clickLoginBtn = () => {
    if (fetching) {
      return
    }

    const fetchPhoneLogin = async (phone, pw) => {
      setFetching(true)
      const loginInfo = await Api.member_login({
        data: {
          memType: 'p',
          memId: phone,
          memPwd: pw
        }
      })

      if (loginInfo.result === 'success') {
        const {memNo} = loginInfo.data
        globalCtx.action.updateToken(loginInfo.data)

        const profileInfo = await Api.profile({params: {memNo}})
        if (profileInfo.result === 'success') {
          globalCtx.action.updateProfile(profileInfo.data)

          if (isHybrid()) {
            return Hybrid('GetLoginTokenNewWin', loginInfo.data)
          }

          return props.history.push('/')
        }
      } else if (loginInfo.result === 'fail') {
        globalCtx.action.alert({
          title: '로그인 실패',
          msg: `${loginInfo.message}`
        })
      }
      setFetching(false)
    }

    const inputPhoneNode = inputPhoneRef.current
    const inputPasswordNode = inputPasswordRef.current

    if (phoneNum === '') {
      inputPhoneNode.focus()
    } else if (password === '') {
      inputPasswordNode.focus()
    } else {
      fetchPhoneLogin(phoneNum, password)
    }
  }

  const fetchSocialData = async vendor => {
    const res = await fetch(`${__SOCIAL_URL}/${vendor}?target=mobile`, {
      method: 'get',
      headers: {
        authToken: Api.authToken,
        'custom-header': Api.customHeader,
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      }
    })

    if (res.status === 200) {
      const redirectUrl = await res.text()
      window.location.href = `${redirectUrl}`
    }
  }

  useEffect(() => {}, [])

  return (
    <Layout {...props} status={'no_gnb'}>
      <Switch>
        {token && token.isLogin ? (
          <Redirect to={'/'} />
        ) : (
          <Login>
            <img className="close-btn" src={closeBtn} onClick={clickCloseBtn} />
            <div>
              <img
                className="logo"
                src={`${IMG_SERVER}/images/api/logo_p_l.png`}
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
                onKeyDown={e => {
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
                <button className="social-btn" onClick={() => fetchSocialData('facebook')}>
                  <img className="icon facebook" src={facebookLogo} />
                  <span className="text">페이스북 로그인</span>
                </button>

                <button className="social-btn" onClick={() => fetchSocialData('google')}>
                  <img className="icon google" src={googleLogo} />
                  <span className="text">구글 로그인</span>
                </button>
              </div>
              <div className="line-wrap">
                <button className="social-btn" onClick={() => fetchSocialData('naver')}>
                  <img className="icon naver" src={naverLogo} />
                  <span className="text">네이버 로그인</span>
                </button>

                <button className="social-btn" onClick={() => fetchSocialData('kakao')}>
                  <img className="icon kakao" src={kakaoLogo} />
                  <span className="text">카카오톡 로그인</span>
                </button>
              </div>
            </SocialLoginWrap>
          </Login>
        )}
      </Switch>
    </Layout>
  )
}

const SocialLoginWrap = styled.div`
  margin-top: 80px;
  margin-bottom: 40px;

  .line-wrap {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-top: 14px;

    .social-btn {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      width: calc(50% - 6px);
      height: 48px;
      background-color: #f5f5f5;
      box-sizing: border-box;
      padding: 0 6px;

      /* a {
        display: flex;
        width: 100%;
        align-items: center; */

      .icon {
        width: 36px;
      }
      .text {
        display: inline-block;
        width: calc(100% - 36px);
        color: #757575;
        font-size: 12px;
        letter-spacing: -0.3px;
        text-align: center;
      }
      /* } */
    }
  }
`

const Login = styled.div`
  position: relative;
  margin: 0 auto;
  width: 91.111%;

  .close-btn {
    position: absolute;
    right: 0;
    top: 5px;
  }

  .logo {
    display: block;
    margin: 0 auto;
    padding: 40px 0 50px;
    width: 60%;
    max-width: 220px;
  }

  .input-wrap {
    input {
      display: block;
      border: 1px solid #e5e5e5;
      padding: 16px;
      width: 100%;
      height: 56px;
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
      background-color: #8556f6;
      color: #fff;
      font-size: 20px;
      font-weight: bold;
      padding: 21px 0;
    }
  }

  .link-wrap {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 26px 0;

    .link-text {
      color: #8556f6;
      font-size: 16px;
      letter-spacing: -0.4px;
    }

    .bar {
      width: 1px;
      height: 16px;
      background-color: #e5e5e5;
      margin: 0 15px;
    }
  }
`
