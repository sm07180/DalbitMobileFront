/**
 * @file /user/content/selfAuth.js
 * @brief 본인인증 페이지
 */
import React, {useState, useEffect, useContext} from 'react'
import styled from 'styled-components'
import Api from 'context/api'

//context
import _ from 'lodash'
import {Context} from 'context'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'

export default props => {
  //---------------------------------------------------------------------
  //context
  const context = useContext(Context)
  const authText = {
    default: ['', '최초 한번'],
    charge: ['유료결제를 위해', '최초 결제 시'],
    cast: ['방송 개설을 위해', '최초 방송방 개설 시']
  }
  let authType = ''
  const [formState, setFormState] = useState({
    tr_cert: '',
    tr_url: '',
    tr_add: ''
  })

  if (_.hasIn(props.location.state, 'type')) {
    authType = props.location.state.type
  } else {
    authType = 'cast'
  }

  //---------------------------------------------------------------------
  //fetchData

  //본인인증 여부 체크. 테스트용
  async function authCheck() {
    const res = await Api.self_auth_check({})
    console.log(res)
  }

  //본인인증모듈 호출
  function authRequest(res) {
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
        'width=425, height=630, resizable=0, scrollbars=no, status=0, titlebar=0, toolbar=0, left=435, top=250'
      )

      if (KMCIS_window == null) {
        context.action.alert({
          msg:
            ' ※ 윈도우 XP SP2 또는 인터넷 익스플로러 7 사용자일 경우에는 \n    화면 상단에 있는 팝업 차단 알림줄을 클릭하여 팝업을 허용해 주시기 바랍니다. \n\n※ MSN,야후,구글 팝업 차단 툴바가 설치된 경우 팝업허용을 해주시기 바랍니다.'
        })
      }
      document.authForm.target = 'KMCISWindow'
    }
    console.log('???', document.authForm)
    document.authForm.action = 'https://www.kmcert.com/kmcis/web/kmcisReq.jsp'
    document.authForm.submit()
  }

  async function authReq() {
    const res = await Api.self_auth_req({})
    if (res.result == 'success' && res.code == 0) {
      console.log(res)
      setFormState({
        tr_cert: res.data.tr_cert,
        tr_url: res.data.tr_url,
        tr_add: res.data.tr_add
      })
      authRequest()
    } else {
      context.action.alert({
        msg: res.message
      })
    }
  }

  function authClick() {
    //authReq()
    const openpop = window.open(
      'https://devm-herbione.dalbitcast.com/user/selfAuthRes',
      'KMCISWindow',
      'width=425, height=630, resizable=0, scrollbars=no, status=0, titlebar=0, toolbar=0, left=435, top=250'
    )
  }

  //---------------------------------------------------------------------
  //useEffect
  useEffect(() => {}, [])

  //---------------------------------------------------------------------
  return (
    <Content>
      <h4>{authText[authType][0]} 본인인증 절차가 필요합니다.</h4>
      <p>
        본인인증은 {authText[authType][1]} 필요합니다.
        <br />
        인증 이후에는 필요하지 않습니다.
      </p>

      <button onClick={authClick}>휴대폰 본인인증</button>

      <form name="authForm" method="post" id="authForm" target="KMCISWindow">
        <span>TEST</span>
        <input type="hidden" name="tr_cert" id="tr_cert" value={formState.tr_cert} readOnly />
        <input type="hidden" name="tr_url" id="tr_url" value={formState.tr_url} readOnly />
        <input type="hidden" name="tr_add" id="tr_add" value={formState.tr_add} readOnly />
      </form>
    </Content>
  )
}

//---------------------------------------------------------------------
//styled
const Content = styled.div`
  margin: 100px auto 100px auto;
  padding-top: 50px;
  width: 95%;
  background: url(${IMG_SERVER}/images/api/cont_logo@2x.png) no-repeat center top;
  background-size: 50px;
  text-align: center;

  h4 {
    padding-top: 40px;
    color: ${COLOR_MAIN};
    font-size: 28px;
    font-weight: 600;
    line-height: 34px;
  }
  p {
    padding-top: 60px;
    padding-bottom: 340px;
    background: url(${IMG_SERVER}/images/api/img_noresult.png) no-repeat center bottom 50px;
    color: #424242;
    font-size: 16px;
    line-height: 24px;
    transform: skew(-0.03deg);
  }

  form {
    display: none;
    margin-top: 40px;
    input {
      display: block;
      margin: 10px auto;
      width: 328px !important;
    }
  }

  button {
    width: 328px;
    border-radius: 5px;
    background: ${COLOR_MAIN};
    color: #fff;
    line-height: 48px;
  }
`
