import React, {useContext, useState, useEffect, useRef} from 'react'
import {useLocation} from 'react-router-dom'
import qs from 'query-string'
import styled from 'styled-components'
import Api from 'context/api'
import {Hybrid} from 'context/hybrid'

//context
import {Context} from 'context'
import {IMG_SERVER} from 'context/config'
import {COLOR_MAIN} from 'context/color'

//layout
import Layout from 'pages/common/layout'
import Header from 'components/ui/header/Header'

import './selfAuth.scss'

export const openAuthPage = (formTagRef, context) => {
  var KMCIS_window
  var UserAgent = navigator.userAgent
  /* 모바일 접근 체크*/

  // 모바일일 경우 (변동사항 있을경우 추가 필요)
  // alert(navigator.maxTouchPoints)
  // alert(UserAgent)
  if (
    UserAgent.match(
      /iPhone|iPod|iPad|Android|Windows CE|Mac OS|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i
    ) != null ||
    UserAgent.match(/LG|SAMSUNG|Samsung/) != null
  ) {
    document.authForm.target = ''
  } else {
    KMCIS_window = window.open(
      '',
      'KMCISWindow',
      'width=425, height=690, resizable=0, scrollbars=no, status=0, titlebar=0, toolbar=0, left=435, top=250'
    )

    if (KMCIS_window == null) {
      context.action.alert({
        msg: ' ※ 윈도우 XP SP2 또는 인터넷 익스플로러 7 사용자일 경우에는 \n    화면 상단에 있는 팝업 차단 알림줄을 클릭하여 팝업을 허용해 주시기 바랍니다. \n\n※ MSN,야후,구글 팝업 차단 툴바가 설치된 경우 팝업허용을 해주시기 바랍니다.'
      })
    }
    document.authForm.target = 'KMCISWindow'
  }
  // console.log(document.authForm)
  document.authForm.action = 'https://www.kmcert.com/kmcis/web/kmcisReq.jsp'
  document.authForm.submit()
}

export const authReq = async (code, formTagRef, context) => {
  const res = await Api.self_auth_req({
    params: {
      pageCode: code,
      authType: '0'
    }
  })
  if (res.result == 'success' && res.code == 0) {
    //alert(JSON.stringify(res, null, 1))
    let authForm = formTagRef.current
    const makeHiddenInput = (key, value) => {
      const input = document.createElement('input')
      input.setAttribute('type', 'hidden')
      input.setAttribute('name', key)
      input.setAttribute('id', key)
      input.setAttribute('value', value)
      return input
    }
    Object.keys(res.data).forEach((key) => {
      authForm.append(makeHiddenInput(key, res.data[key]))
    })

    // console.log(authForm)
    openAuthPage(formTagRef, context)
  } else {
    context.action.alert({
      msg: res.message
    })
  }
}

//
export default (props) => {
  const location = useLocation()

  const {type, event} = qs.parse(location.search)

  //---------------------------------------------------------------------
  //context
  const context = useContext(Context)

  //인증 요청 버튼
  function authClick() {
    if (event) {
      let url = event.split('/').join('DAL')
      url = url.split('_').join('BIT')
      return authReq(url, context.authRef, context)
    }

    if (type === 'create' || type === 'adultCreate') return authReq('6', context.authRef, context)
    if (type === 'adultJoin') return authReq('8', context.authRef, context)

    return authReq('4', context.authRef, context)
  }

  const goBack = () => {
    //props.history.push(`/mypage/${context.profile.memNo}/wallet`)
    if (type === 'create') return Hybrid('CloseLayerPopup')
    window.history.back()
    context.action.updateWalletIdx(1)
  }

  const AuthContent = () => {
    if (event) {
      if (event === '/store') {
        return (
          <>
            <h4>
              간편결제 계좌 등록을 위해서는
              <br />
              <span>본인인증을 필수</span>로 받으셔야 합니다.
            </h4>
          </>
        )
      } else {
        return (
          <>
            <h4>
              <span>이벤트 참여 또는 경품 수령을 위해</span>
              <br />
              본인인증을 필수로 받으셔야 합니다.
            </h4>
          </>
        )
      }
    }
    if (type === 'create' || type === 'adultJoin') {
      return (
        <>
          <h4>
            <span>20세 이상 방송을 진행하거나 청취하기 위해서는</span>
            <br />
            본인인증을 필수로 받으셔야 합니다.
          </h4>
        </>
      )
    }
    return (
      <>
        <h4>
          환전 승인을 받기 위해서는
          <br />
          <span>본인인증 절차</span>가 필요합니다.
        </h4>
        <div className="noticeInfo">
          <h3>유의사항</h3>
          <p>환전 신청은 만 14세 이상의 회원만 가능합니다.</p> 
          <p>환전 승인을 위해 최초 1회 본인인증이 필요합니다.</p>
          <p>만 14세~만 19세(미성년자)의 경우 법정대리인의 동의는 필수사항 입니다.</p>
        </div>
      </>
    )
  }

  //---------------------------------------------------------------------
  return (
    <div id ="selfAuth">
      <Header type="back"/>
      <section className="imgWrap">
        <div className="img-wrap">
          <img src={`${IMG_SERVER}/images/api/img_rabbit_02.svg`} />
          <h2>본인인증</h2>
        </div>
      </section>
      <section className="authWrap">
        <div className="auth-wrap">
          <AuthContent />
          <div className="btn-wrap">
            <button onClick={authClick}>본인 인증하기</button>
          </div>
        </div>
      </section>
    </div>
  )
}
//---------------------------------------------------------------------

