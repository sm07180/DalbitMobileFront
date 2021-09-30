import React, {useContext, useEffect, useState, useRef} from 'react'
import {Context} from 'context'
import {OS_TYPE} from 'context/config'
import {useHistory} from 'react-router-dom'
import {Hybrid} from 'context/hybrid'
import Api from 'context/api'
import {authReq} from 'pages/self_auth'
import Layout from 'pages/common/layout'

import NoServiceIcon from './static/ic_sorry.png'
import './index.scss'

export default function Service() {
  const globalCtx = useContext(Context)
  const hisotry = useHistory()
  const formTag = useRef(null)

  return (
    <Layout status="no_gnb">
      <form ref={formTag} name="authForm" method="post" id="authForm" target="KMCISWindow"></form>
      <div id="noServiceWrap">
        <div className="infoWrap">
          <img src={NoServiceIcon} alt="달빛이미지" />
          <div className="text">
            서비스 이용 가능 연령 미달로
            <br />
            달빛라이브를 이용하실 수 없습니다.
          </div>
        </div>
        <div className="buttonWrap">
          <button onClick={() => (window.location.href = '/customer/personal')}>1:1 문의하기</button>
          <button onClick={() => authReq('5', formTag, globalCtx)}>본인인증</button>
        </div>
      </div>
    </Layout>
  )
}
