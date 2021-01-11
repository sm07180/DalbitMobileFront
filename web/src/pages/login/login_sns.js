import React, {useContext, useState} from 'react'
import {useHistory} from 'react-router-dom'
import {Context} from 'context'

import Api from 'context/api'
import qs from 'query-string'
import {OS_TYPE} from 'context/config.js'
import {Hybrid} from 'context/hybrid'

import appleLogo from './static/apple_logo.svg'
import facebookLogo from './static/facebook_logo.svg'
import googleLogo from './static/google_logo.svg'
import kakaoLogo from './static/kakao_logo.svg'
import naverLogo from './static/naver_logo.svg'
import logoW from './static/logo_w_no_symbol.svg'

export default function login_sns() {
  const history = useHistory()
  const globalCtx = useContext(Context)

  const {webview, redirect} = qs.parse(location.search)

  const [appleAlert, setAppleAlert] = useState(false)
  const customHeader = JSON.parse(Api.customHeader)

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

  return (
    <div className="loginForm">
      <h1
        onClick={() => {
          if (!webview) {
            window.location.href = '/'
          }
        }}>
        {/* <img className="logo" src="https://image.dalbitlive.com/images/login/login_img.png" /> */}
        <img src={logoW} alt="달빛라이브" />
      </h1>

      <button className="loginForm__btnHome" onClick={() => history.push('/')}>
        둘러보기
      </button>

      <p className="loginForm__msg">
        레벨업하면 <span>최대 10,000원</span>
        <br />
        상당의 달 지급
      </p>

      {(globalCtx.nativeTid == '' || globalCtx.nativeTid == 'init') && (
        <div className="socialLogin">
          <button className="social-kakao-btn" onClick={() => fetchSocialData('kakao')}>
            <img className="icon" src={kakaoLogo} /> <span>카카오로 계속하기</span>
          </button>
          <button className="social-naver-btn" onClick={() => fetchSocialData('naver')}>
            <img className="icon" src={naverLogo} /> <span>네이버로 계속하기</span>
          </button>
          <button className="social-google-btn" onClick={() => fetchSocialData('google')}>
            <img className="icon" src={googleLogo} /> <span>구글로 계속하기</span>
          </button>
          <button className="social-facebook-btn" onClick={() => fetchSocialData('facebook')}>
            <img className="icon" src={facebookLogo} /> <span>페이스북으로 계속하기</span>
          </button>

          <button className="social-apple-btn" onClick={() => fetchSocialData('apple')}>
            <img className="icon" src={appleLogo} /> <span>애플로 계속하기</span>
          </button>

          {appleAlert && <div className="apple-alert">OS를 최신 버전으로 설치해주세요.</div>}

          <button className="social-phone-btn" onClick={() => history.push('/signup')}>
            <span>전화번호로 가입하기</span>
          </button>
        </div>
      )}

      <div className="link-wrap">
        <a href="/login/phone">
          <div className="link-text">전화번호 로그인</div>
        </a>
        <div className="bar" />
        <a href="/service">
          <div className="link-text yellow">고객센터</div>
        </a>
      </div>
    </div>
  )
}
