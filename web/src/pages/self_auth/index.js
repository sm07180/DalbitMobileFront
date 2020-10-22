import React, {useContext, useState, useEffect, useRef} from 'react'
import {useLocation} from 'react-router-dom'
import qs from 'query-string'
import styled from 'styled-components'
import Api from 'context/api'

//context
import {Context} from 'context'
import {IMG_SERVER} from 'context/config'
import {COLOR_MAIN} from 'context/color'

//layout
import Layout from 'pages/common/layout'
import Header from 'components/ui/new_header'

let formTag

export const openAuthPage = (formTagRef) => {
  var KMCIS_window
  var UserAgent = navigator.userAgent
  /* 모바일 접근 체크*/

  // 모바일일 경우 (변동사항 있을경우 추가 필요)
  if (
    UserAgent.match(
      /iPhone|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i
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
        msg:
          ' ※ 윈도우 XP SP2 또는 인터넷 익스플로러 7 사용자일 경우에는 \n    화면 상단에 있는 팝업 차단 알림줄을 클릭하여 팝업을 허용해 주시기 바랍니다. \n\n※ MSN,야후,구글 팝업 차단 툴바가 설치된 경우 팝업허용을 해주시기 바랍니다.'
      })
    }
    document.authForm.target = 'KMCISWindow'
  }
  document.authForm.action = 'https://www.kmcert.com/kmcis/web/kmcisReq.jsp'
  document.authForm.submit()
}

export const authReq = async (code, formTagRef) => {
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
    openAuthPage(formTagRef)
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
  console.log(type, event)

  //---------------------------------------------------------------------
  //context
  const context = useContext(Context)

  //ref
  formTag = useRef(null)

  //인증 요청 버튼
  function authClick() {
    if (event) {
      let url = event.split('/').join('DAL')
      url = event.split('_').join('BIT')
      console.log(url)
      return authReq(url, formTag)
    }
    if (type === 'create') {
      authReq('6', formTag)
    } else {
      authReq('4', formTag)
    }
  }

  const goBack = () => {
    //props.history.push(`/mypage/${context.profile.memNo}/wallet`)
    window.history.back()
    context.action.updateWalletIdx(1)
  }

  //---------------------------------------------------------------------
  return (
    <Layout {...props} status="no_gnb">
      <Header title="본인인증" goBack={goBack} />
      <Content>
        <div className="img-wrap">
          <img src={`${IMG_SERVER}/images/api/img_rabbit_02.svg`} />
          <h2>본인인증</h2>
        </div>
        <div className="auth-wrap">
          {type === 'create' ? (
            <>
              <h4>
                <span>처음 방송개설 및 클립등록 시</span>
                <br />
                본인인증을 필수로 받으셔야 합니다.
              </h4>
            </>
          ) : event ? (
            <>
              <h4>
                <span>이벤트 참여 또는 경품 수령을 위해</span>
                <br />
                본인인증을 필수로 받으셔야 합니다.
              </h4>
            </>
          ) : (
            <>
              <h4>
                환전 승인을 받기 위해서는
                <br />
                <span>본인인증 절차</span>가 필요합니다.
              </h4>
              <p>
                ※ 환전 신청은 12세 이상의 회원만 가능합니다.
                <br />
                ※ 환전 승인을 위해 최초 1회 본인인증이 필요합니다.
                <br />※ 12세~20세(미성년자)의 경우 법정대리인의 동의는 필수사항 입니다.
              </p>
            </>
          )}

          <div className="btn-wrap">
            <button onClick={authClick}>본인 인증하기</button>
          </div>
        </div>
        <form ref={formTag} name="authForm" method="post" id="authForm" target="KMCISWindow"></form>
      </Content>
    </Layout>
  )
}
//---------------------------------------------------------------------

const Content = styled.div`
  padding: 30px 16px;
  .img-wrap {
    padding-bottom: 20px;
    text-align: center;
    h2 {
      font-size: 24px;
      line-height: 24px;
      color: #000;
      padding-top: 30px;
    }
  }
  .auth-wrap {
    padding: 10px 0;
    h4 {
      text-align: center;
      color: #000;
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
      strong {
        font-weight: 600;
      }
      span {
        font-weight: 600;
        color: ${COLOR_MAIN};
      }
    }
    h5 {
      text-align: center;
      font-size: 14px;
      line-height: 20px;
      font-weight: 400;
      span {
        color: ${COLOR_MAIN};
      }
    }
    h4 + h5 {
      padding-top: 10px;
    }
    p {
      padding-top: 35px;
      color: #757575;
      font-size: 12px;
      line-height: 18px;
    }
    .btn-wrap {
      display: flex;
      padding-top: 25px;
      button {
        flex: 1;
        height: 44px;
        border-radius: 12px;
        color: #fff;
        font-weight: 600;
        background: ${COLOR_MAIN};
        border: 1px solid ${COLOR_MAIN};
        line-height: 44px;
        &.cancel {
          color: ${COLOR_MAIN};
          background: #fff;
        }
      }
      button + button {
        margin-left: 8px;
      }
    }
  }
`
