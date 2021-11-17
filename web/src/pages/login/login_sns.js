import React, {useContext, useState} from 'react'
import {useHistory} from 'react-router-dom'
import {Context} from 'context'

import Api from 'context/api'
import qs from 'query-string'
import {OS_TYPE} from 'context/config.js'
import {Hybrid} from 'context/hybrid'
import LoginForm from './login_form'
import appleLogo from './static/apple_logo.svg'
import facebookLogo from './static/facebook_logo.svg'
import googleLogo from './static/google_logo.svg'
import kakaoLogo from './static/kakao_logo.svg'
import naverLogo from './static/naver_logo.svg'
import phoneLogo from './static/phone_logo.svg'
import logoW from './static/logo_w_no_symbol.svg'
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

    const isAndroid = customHeader['os'] === OS_TYPE['Android'];
    const isIos = customHeader['os'] === OS_TYPE['IOS'];
    let targetVersion = '';
    const successCallback = () => newSocialLogin(vendor); // 소셜로그인 native 처리 이후 버전
    const failCallback = () => oldLogin(vendor); // 소셜로그인 옛날 버전 & 사과로그인(사과만 웹에서)

    if(vendor !== 'apple' && (isAndroid || isIos)) {
      targetVersion = isAndroid ? '1.6.9' : '1.6.3';
      await Utility.compareAppVersion(targetVersion, successCallback, failCallback);
    }else {
      await failCallback();
    }
  }

  return (
    <>
      {webview === 'new' ? (
        <button className="btnHome" onClick={() => Hybrid('CloseLayerPopup')}>
          <img src="https://image.dalbitlive.com/svg/close_w_l.svg" alt="close" />
        </button>
      ) : (
        <button className="btnHome" onClick={() => history.push('/')}>
          둘러보기
        </button>
      )}
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
        <p className="loginForm__msg">
          레벨업하면 <span>최대 10,000원</span>
          <br />
          상당의 달 지급
        </p>

        {(globalCtx.nativeTid == '' || globalCtx.nativeTid == 'init') && (
          <div className="socialLogin">
            {moreSection === false &&
              (customHeader['os'] === OS_TYPE['IOS'] ? (
                <>
                  <button className="social-kakao-btn" onClick={() => fetchSocialData('kakao')}>
                    <img className="icon" src={kakaoLogo} /> <span>카카오로 계속하기</span>
                  </button>
                  <button className="social-apple-btn" onClick={() => fetchSocialData('apple')}>
                    <img className="icon" src={appleLogo} /> <span>Apple로 계속하기</span>
                  </button>
                </>
              ) : (
                <>
                  <button className="social-kakao-btn" onClick={() => fetchSocialData('kakao')}>
                    <img className="icon" src={kakaoLogo} /> <span>카카오로 계속하기</span>
                  </button>
                  <button className="social-google-btn" onClick={() => fetchSocialData('google')}>
                    <img className="icon" src={googleLogo} /> <span>구글로 계속하기</span>
                  </button>
                </>
              ))}
            {moreSection === true && (
              <div className={`moreAnimation ${customHeader['os'] === OS_TYPE.IOS && 'ios'}`}>
                <button className="social-kakao-btn" onClick={() => fetchSocialData('kakao')}>
                  <img className="icon" src={kakaoLogo} /> <span>카카오로 계속하기</span>
                </button>
                {customHeader['os'] === OS_TYPE.IOS ? (
                  <>
                    <button className="social-apple-btn" onClick={() => fetchSocialData('apple')}>
                      <img className="icon" src={appleLogo} /> <span>Apple로 계속하기</span>
                    </button>
                    <button className="social-google-btn" onClick={() => fetchSocialData('google')}>
                      <img className="icon" src={googleLogo} /> <span>구글로 계속하기</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button className="social-google-btn" onClick={() => fetchSocialData('google')}>
                      <img className="icon" src={googleLogo} /> <span>구글로 계속하기</span>
                    </button>
                    <button className="social-apple-btn" onClick={() => fetchSocialData('apple')}>
                      <img className="icon" src={appleLogo} /> <span>Apple로 계속하기</span>
                    </button>
                  </>
                )}

                <button className="social-naver-btn" onClick={() => fetchSocialData('naver')}>
                  <img className="icon" src={naverLogo} /> <span>네이버로 계속하기</span>
                </button>
                <button className="social-facebook-btn" onClick={() => fetchSocialData('facebook')}>
                  <img className="icon" src={facebookLogo} /> <span>페이스북으로 계속하기</span>
                </button>

                <button className="social-phone-btn" onClick={() => setLoginPop(true)}>
                  <img className="icon" src={phoneLogo} /> <span>전화번호로 계속하기</span>
                </button>
              </div>
            )}
            {moreSection === false && (
              <button className="social-more-btn" onClick={() => setMoreSection(true)}>
                <span>다른 방법으로 계속하기</span>
              </button>
            )}

            {appleAlert && (
              <div className="apple-alert">
                OS를 최신 버전으로 업데이트해 주세요.
                <br />
                만약 OS업데이트 후에도 로그인이 안 될 경우
                <br />
                앱을 재설치하신 뒤 휴대폰을 재부팅한 후<br />
                로그인을 시도해 주세요.
              </div>
            )}
          </div>
        )}

        <div className="link-wrap">
          <span onClick={() => history.push('/signup')}>
            <div className="link-text">회원가입</div>
          </span>
          {!webview && (
            <>
              <div className="bar" />
              <a href="/service">
                <div className="link-text yellow">고객센터</div>
              </a>
            </>
          )}
        </div>

        {loginPop && <LoginForm setLoginPop={setLoginPop} props={props} />}
      </div>
    </>
  )
}
