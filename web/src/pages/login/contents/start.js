import React from 'react'
import {useHistory} from 'react-router-dom'

import Header from 'components/ui/header/Header'
import '../style.scss'
import {Hybrid, isAndroid, isHybrid} from "context/hybrid";
import Utility from "components/lib/utility";
import {OS_TYPE} from "context/config";
import Api from "context/api";
import qs from "query-string";

const Start = (props) => {
  const customHeader = JSON.parse(Api.customHeader);
  const {webview} = qs.parse(location.search);

  //휴대폰으로 계속하기
  const didLogin = () => {
    props.history.push('/login/didLogin');
  };

  //소셜로그인
  const socialLogin = async (vendor) => {
    const successCallback = () => newSocialLogin(vendor); // 소셜로그인 native 처리 이후 버전
    const failCallback = () => oldLogin(vendor); // 소셜로그인 옛날 버전 & 사과로그인(사과만 웹에서)
    if(vendor !== 'apple' && (isHybrid())) {
      const targetVersion = isAndroid() ? '1.6.9' : '1.6.3';
      await Utility.compareAppVersion(targetVersion, successCallback, failCallback);
    }else {
      await failCallback();
    }
  }
  const newSocialLogin = (vendor) => {
    Hybrid("getSocialToken", {type: vendor})
  }
  const oldLogin = async (vendor) => {
    if (vendor === 'google' && (customHeader['os'] === OS_TYPE['Android'] || customHeader['os'] === OS_TYPE['IOS'])) {
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

  return (
    <div id="loginPage">
      <Header type="back"/>
      <section className='loginSns'>
        <h2 className='title'>시작하기</h2>
        <div className="socialLogin">
          <button className="googleBtn" onClick={()=>socialLogin('google')}>
            <img className="icon" src="https://image.dalbitlive.com/dalla/login/login_logo-google.png" alt={"구글"}/>
            <span>구글로 계속하기</span>
          </button>
          <button className="kakaoBtn" onClick={()=>socialLogin('kakao')}>
            <img className="icon" src="https://image.dalbitlive.com/dalla/login/login_logo-kakao.png" alt={"카카오"}/>
            <span>카카오로 계속하기</span>
          </button>
          <button className="appleBtn" onClick={()=>socialLogin('apple')}>
            <img className="icon" src="https://image.dalbitlive.com/dalla/login/login_logo-apple.png" alt={"애플"}/>
            <span>apple로 계속하기</span>
          </button>
          <button className="phoneBtn" onClick={didLogin}>
            <img className="icon" src="https://image.dalbitlive.com/dalla/login/login_logo-phone.png" alt={"휴대폰"}/>
            <span>휴대폰번호로 계속하기</span>
          </button>
          <button className="naverBtn" onClick={()=>socialLogin('naver')}>
            <img className="icon" src="https://image.dalbitlive.com/dalla/login/login_logo-naver.png" alt={"네이버"}/>
            <span>네이버로 계속하기</span>
          </button>
          <button className="facebookBtn" onClick={()=>socialLogin('facebook')}>
            <img className="icon" src="https://image.dalbitlive.com/dalla/login/login_logo-facebook.png" alt={"페이스북"}/>
            <span>페이스북으로 계속하기</span>
          </button>
        </div>
      </section>
    </div>
  )
}

export default Start
