import React from 'react'

// global components
import Header from 'components/ui/header/Header'
// components
// contents
// css
import '../style.scss'

const LoginSns = () => {
  return (
    <div id="loginPage">
      <Header type="back" />
      <section className='loginSns'>
        <h2 className='title'>시작하기</h2>
        <div className="socialLogin">
          <button className="googleBtn">
            <img className="icon" src="https://image.dalbitlive.com/dalla/login/login_logo-google.png" />
            <span>구글로 계속하기</span>
          </button>            
          <button className="kakaoBtn">
            <img className="icon" src="https://image.dalbitlive.com/dalla/login/login_logo-kakao.png" />
            <span>카카오로 계속하기</span>
          </button>
          <button className="appleBtn">
            <img className="icon" src="https://image.dalbitlive.com/dalla/login/login_logo-apple.png" />
            <span>apple로 계속하기</span>
          </button>
          <button className="phoneBtn">
            <img className="icon" src="https://image.dalbitlive.com/dalla/login/login_logo-phone.png" />
            <span>휴대폰번호로 계속하기</span>
          </button>
          <button className="naverBtn">
            <img className="icon" src="https://image.dalbitlive.com/dalla/login/login_logo-naver.png" />
            <span>네이버로 계속하기</span>
          </button>
          <button className="facebookBtn">
            <img className="icon" src="https://image.dalbitlive.com/dalla/login/login_logo-facebook.png" />
            <span>페이스북으로 계속하기</span>
          </button>    
        </div>
      </section>
    </div>
  )
}

export default LoginSns
