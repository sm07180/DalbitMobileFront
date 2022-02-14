import React, {useEffect, useState, useContext} from 'react'
import {useHistory} from 'react-router-dom'
import {Context} from "context";

// global components
// components
// contents
// css
import './style.scss'

const mobileWeb = () => {
  const history = useHistory()
  const context = useContext(Context)
  const {token} = context

  const loginStart = () => {
    if (!token.isLogin) {
      history.push('/login/start');
    }
  };

  return (
    <div id="mobileWeb">
      <section className='appDownload'>
        <div className='logo'>
          <img src='https://image.dalbitlive.com/common/header/LOGO.png' alt='dalla'/>
        </div>
        <div className='textWrap'>
          <p className='mainText'>요즘 대세 라이브는?<br/>당근 달라지!</p>
          <p className='subText'>여기서 뭐해요? 빨리 와서 같이 놓아요!</p>
        </div>
        <div className='btnWrap'>
          <button className='googlePlay'></button>
          <button className='appStore'></button>
        </div>
      </section>
    </div>
  )
}

export default mobileWeb