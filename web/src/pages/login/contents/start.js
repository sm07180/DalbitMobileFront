import React, {useContext} from 'react'

import Header from 'components/ui/header/Header'
import '../style.scss'
import {Hybrid, isAndroid, isHybrid} from "context/hybrid";
import Api from "context/api";
import qs from "query-string";
import {useHistory} from "react-router-dom";
import {Context} from 'context'

const Start = (props) => {
  const history = useHistory();
  const context = useContext(Context)
  const {webview} = qs.parse(location.search);

  //휴대폰으로 계속하기
  const didLogin = () => {
    history.push('/login/didLogin');
  };

  //소셜로그인
  const socialLogin = async (vendor) => {
    if(vendor !== 'apple' && (isHybrid())) {
      newSocialLogin(vendor)
    }else {
      oldLogin(vendor);
    }
  }
  const newSocialLogin = (vendor) => {
    Hybrid("getSocialToken", {type: vendor})
  }
  const oldLogin = async (vendor) => {
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

  const backButton = () => {
    if(webview === 'new'){
      Hybrid('CloseLayerPopup');
    }else{
      history.push('/')
    }
  }

  const golink = (path) => {
    history.push(path);
  }

  return (
    <div id="loginPage">
      <Header>
        <button className="back" onClick={backButton} />
      </Header>
      <section className='loginSns'>
        <h2 className='title'>시작하기</h2>
        <div className="socialLogin">
          <button className="googleBtn" onClick={()=>{socialLogin('google')}}>
            <img className="icon" src="https://image.dalbitlive.com/dalla/login/login_logo-google.png" alt={"구글"}/>
            <span>구글로 계속하기</span>
          </button>
          <button className="kakaoBtn" onClick={()=>{socialLogin('kakao')}}>
            <img className="icon" src="https://image.dalbitlive.com/dalla/login/login_logo-kakao.png" alt={"카카오"}/>
            <span>카카오로 계속하기</span>
          </button>
          <button className="appleBtn" onClick={()=>{socialLogin('apple')}}>
            <img className="icon" src="https://image.dalbitlive.com/dalla/login/login_logo-apple.png" alt={"애플"}/>
            <span>Apple로 계속하기</span>
          </button>
          <button className="phoneBtn" onClick={didLogin}>
            <img className="icon" src="https://image.dalbitlive.com/dalla/login/login_logo-phone.png" alt={"휴대폰"}/>
            <span>휴대폰번호로 계속하기</span>
          </button>
          <button className="naverBtn" onClick={()=>{socialLogin('naver')}}>
            <img className="icon" src="https://image.dalbitlive.com/dalla/login/login_logo-naver.png" alt={"네이버"}/>
            <span>네이버로 계속하기</span>
          </button>
          <button className="facebookBtn" onClick={()=>{socialLogin('facebook')}}>
            <img className="icon" src="https://image.dalbitlive.com/dalla/login/login_logo-facebook.png" alt={"페이스북"}/>
            <span>페이스북으로 계속하기</span>
          </button>
        </div>
        <p>
          달라에 <span onClick={()=>{golink('/customer')}}>문의사항</span>이 있으신가요?
        </p>
      </section>
    </div>
  )
}

export default Start
