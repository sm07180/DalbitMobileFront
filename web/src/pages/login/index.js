import React, {useEffect, useState, useContext} from 'react'
import {useHistory} from 'react-router-dom'
import {Context} from "context";

// global components
// components
// contents
// css
import './style.scss'

const LoginPage = () => {
  const history = useHistory()
  const context = useContext(Context)
  const {token} = context

  const loginStart = () => {
    if (!token.isLogin) {
      history.push('/login/start');
    }
  };

  useEffect(() => {
    if (token.isLogin) {
      history.push('/')
    }
  },[]);

  return (
    <div id="loginPage">
      <section className='loginMain'>
        <div className='logo'>
          <img src='https://image.dalbitlive.com/common/header/LOGO.png' alt='dalla'/>
        </div>
        <div className='textWrap'>
          <p className='mainText'>달라에서 매일<br/>재미있는 라이브를 즐겨보아요!</p>
          <p className='subText'>로그인 후 이용할 수 있습니다.</p>
        </div>
        <button className='loginBtn' onClick={loginStart}>로그인</button>
      </section>
    </div>
  )
}

export default LoginPage