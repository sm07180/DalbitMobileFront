import React, {useEffect, useState, useContext} from 'react'
import {useHistory, useLocation} from 'react-router-dom'
import {Context} from "context";
import {isMobileWeb} from "../../context/hybrid";
// global components
// components
// contents
// css
import './style.scss'
import Start from "pages/login/contents/start";

const LoginPage = () => {
  const history = useHistory()
  const location = useLocation();
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
    if(typeof window !== 'undefined' && location.search) {
      sessionStorage.setItem('_loginRedirect__', JSON.stringify(location.search));
    }
  },[]);

  // if (isMobileWeb()){
  //   return <Start/>
  // }else{
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
          
          {/*ios 모바일 웹 일 경우*/}
          {/* <div className="textWrap">
            <p className='mainText'>요즘 대세 라이브는?<br/>당근 달라지!</p>
            <p className='subText'>여기서 뭐해요? 빨리 와서 같이 놀아요!</p>
          </div>
          <button className="downloadBtn">
            <img src="https://image.dalbitlive.com/login/dalla/download-google.png" alt="구글 플레이스토어 다운로드" />
          </button>
          <button className="downloadBtn">
            <img src="https://image.dalbitlive.com/login/dalla/download-apple.png" alt="애플 앱스토어 다운로드" />
          </button> */}
        </section>
      </div>
    )
  // }

}

export default LoginPage
