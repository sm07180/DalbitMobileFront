import React, {useContext, useEffect, useState} from 'react'
import {Context} from 'context'
import Api from 'context/api'
import {authReq} from 'pages/self_auth'
import {Hybrid, isHybrid} from 'context/hybrid'
import Layout from 'pages/common/layout'
import {BeforeLogout} from 'common/logout_func'

import NoServiceIcon from './static/ic_sorry.png'
import './index.scss'
import Message from 'pages/common/message'
import {useHistory} from "react-router-dom";

export default function Service() {
  const globalCtx = useContext(Context)
  const history = useHistory();
  const [fetching, setFetching] = useState(false)
  const [authCheckYn, setAuthCheckYn] = useState('y') // y인 경우에 본인인증을 시도할 수 있다 (1일 1회)

  const clickLogoutBtn = async () => {
    if (fetching) {
      return
    }
    const fetchLogout = async () => {
      setFetching(true)
      const logoutInfo = await Api.member_logout()
      if (logoutInfo.result === 'success') {
        if (isHybrid()) {
          Hybrid('GetLogoutToken', logoutInfo.data)
        }
        globalCtx.action.updateToken(logoutInfo.data)
        globalCtx.action.updateProfile(null)
        // props.history.push('/')
        window.location.href = '/'
        return
      } else if (logoutInfo.result === 'fail') {
        globalCtx.action.alert({
          title: '로그아웃 실패',
          msg: `${logoutInfo.message}`
        })
        setFetching(false)
      }
    }
    BeforeLogout(globalCtx, fetchLogout)
  }

  const authYnCheck = () => {
    Api.certificationCheck().then((res) => {
      if (res.data === 'y') {
        setAuthCheckYn('y')
      } else {
        setAuthCheckYn('n')
      }
    })
  }

  useEffect(() => {
    authYnCheck()
  }, [])

  return (
    <Layout status="no_gnb">
      <div id="noServiceWrap">
        <div className="infoWrap">
          <img src={NoServiceIcon} alt="달라이미지" />
          <div className="text">
            서비스 이용 가능 연령(만 14세 이상) 미달로
            <br />
            달라를 이용하실 수 없습니다.
          </div>
        </div>
        <div className="buttonWrap">
          <button onClick={() => {history.push('/customer/inquire')}}>1:1 문의하기</button>
          {authCheckYn === 'y' ? (
            <button onClick={() => authReq({code: '9', formTagRef: globalCtx.authRef, context: globalCtx})}>본인인증</button>
          ) : (
            <button className="disabled" disabled>
              본인인증을 이미 완료했습니다.
              <br />
              1일 1회만 가능합니다.
            </button>
          )}
          <button className="logOut" onClick={clickLogoutBtn}>
            로그아웃
          </button>
        </div>
      </div>
      <Message />
    </Layout>
  )
}
