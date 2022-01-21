import React, {useContext, useState} from 'react'
import {useHistory} from 'react-router-dom'
import {Context} from 'context'

import Api from 'context/api'
import qs from 'query-string'
import {OS_TYPE} from 'context/config.js'
import {Hybrid, isHybrid, isAndroid} from 'context/hybrid'
import LoginForm from './loginForm'
import appleLogo from '../static/apple_logo.svg'
import facebookLogo from '../static/facebook_logo.svg'
import googleLogo from '../static/google_logo.svg'
import kakaoLogo from '../static/kakao_logo.svg'
import naverLogo from '../static/naver_logo.svg'
import phoneLogo from '../static/phone_logo.svg'
import Utility from 'components/lib/utility'

export default function login_sns({props}) {
  const history = useHistory()
  const globalCtx = useContext(Context)

  const {webview, redirect} = qs.parse(location.search)
  const [loginPop, setLoginPop] = useState(false)

  const [appleAlert, setAppleAlert] = useState(false)
  const [moreSection, setMoreSection] = useState(false)

  const customHeader = JSON.parse(Api.customHeader)
  const context = useContext(Context)

  const oldLogin = async (vendor) => {
    if (vendor === 'google' && (customHeader['os'] === OS_TYPE['Android'] || customHeader['os'] === OS_TYPE['IOS'])) {
      //TODO: 새창로그인 여부 추가
      //Hybrid('openGoogleSignIn', {'webview' : webview})
      Hybrid('openGoogleSignIn')
    } else if (vendor === 'facebook' && customHeader['os'] === OS_TYPE['Android']) {
      // 안드로이드 페이스북 로그인
      const successCallback = () => Hybrid('openFacebookLogin')
      const failCallback = () => {
        context.action.confirm({
          buttonText: {right: '업데이트'},
          msg: `페이스북 로그인을 하시려면<br/>앱을 업데이트해 주세요.`,
          callback: async () => Hybrid('goToPlayStore')
        })
      }
      await Utility.compareAppVersion('1.6.0', successCallback, failCallback)
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

  const newSocialLogin = (vendor) => {
    Hybrid("getSocialToken", {type: vendor})
  }

  const fetchSocialData = async (vendor) => {
    if (vendor === 'apple') {
      setTimeout(() => {
        setAppleAlert(true)
      }, 1000)
    } else {
      setAppleAlert(false)
    }

    const successCallback = () => newSocialLogin(vendor); // 소셜로그인 native 처리 이후 버전
    const failCallback = () => oldLogin(vendor); // 소셜로그인 옛날 버전 & 사과로그인(사과만 웹에서)

    if(vendor !== 'apple' && (isHybrid())) {
      const targetVersion = isAndroid() ? '1.6.9' : '1.6.3';
      await Utility.compareAppVersion(targetVersion, successCallback, failCallback);
    }else {
      await failCallback();
    }
  }

  return (
    <div id="loginPage">
      {webview === 'new' ? (
        <button className="btnHome" onClick={() => Hybrid('CloseLayerPopup')}>
          <img src="https://image.dalbitlive.com/svg/close_w_l.svg" alt="close" />
        </button> 
      ) : (
        <button className="btnHome" onClick={() => history.push('/login')}></button>
      )}
      <div className="loginForm">
        <div className='loginStart'>시작하기</div>

        {(globalCtx.nativeTid == '' || globalCtx.nativeTid == 'init') && (
          <div className="socialLogin">
            <button className="social-google-btn" onClick={() => fetchSocialData('google')}>
              <img className="icon" src="https://image.dalbitlive.com/dalla/login/login_logo-google.png" />
              <span>구글로 계속하기</span>
            </button>            
            <button className="social-kakao-btn" onClick={() => fetchSocialData('kakao')}>
              <img className="icon" src="https://image.dalbitlive.com/dalla/login/login_logo-kakao.png" />
              <span>카카오로 계속하기</span>
            </button>
            <button className="social-apple-btn" onClick={() => fetchSocialData('apple')}>
              <img className="icon" src="https://image.dalbitlive.com/dalla/login/login_logo-apple.png" />
              <span>apple로 계속하기</span>
            </button>
            <button className="social-phone-btn" onClick={() => setLoginPop(true)}>
              <img className="icon" src="https://image.dalbitlive.com/dalla/login/login_logo-phone.png" />
              <span>휴대폰번호로 계속하기</span>
            </button>
            <button className="social-naver-btn" onClick={() => fetchSocialData('naver')}>
              <img className="icon" src="https://image.dalbitlive.com/dalla/login/login_logo-naver.png" />
              <span>네이버로 계속하기</span>
            </button>
            <button className="social-facebook-btn" onClick={() => fetchSocialData('facebook')}>
              <img className="icon" src="https://image.dalbitlive.com/dalla/login/login_logo-facebook.png" />
              <span>페이스북으로 계속하기</span>
            </button>    
          </div>
        )}

        {loginPop && <LoginForm setLoginPop={setLoginPop} props={props} />}
      </div>
    </div>
  )
}
