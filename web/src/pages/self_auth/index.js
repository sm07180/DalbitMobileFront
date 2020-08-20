import React, {useContext, useState, useEffect} from 'react'
import styled from 'styled-components'
import Api from 'context/api'

//context
import {Context} from 'context'
import {COLOR_MAIN} from 'context/color'

//layout
import Layout from 'pages/common/layout'
import Header from 'components/ui/new_header'

//
export default (props) => {
  //---------------------------------------------------------------------
  //context
  const context = useContext(Context)
  //formData
  const [formState, setFormState] = useState({
    tr_cert: '',
    tr_url: '',
    tr_add: ''
  })

  //본인인증 모듈 호출
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

  //인증 요청
  async function authReq() {
    const res = await Api.self_auth_req({
      params: {
        pageCode: '4',
        authType: '0'
      }
    })
    if (res.result == 'success' && res.code == 0) {
      //alert(JSON.stringify(res, null, 1))
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

  //인증 요청 버튼
  function authClick() {
    authReq()
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
        <div className="auth-wrap">
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
          <div className="btn-wrap">
            <button onClick={authClick}>본인 인증하기</button>
          </div>
        </div>
        <form name="authForm" method="post" id="authForm" target="KMCISWindow">
          <input type="hidden" name="tr_cert" id="tr_cert" value={formState.tr_cert} readOnly />
          <input type="hidden" name="tr_url" id="tr_url" value={formState.tr_url} readOnly />
          <input type="hidden" name="tr_add" id="tr_add" value={formState.tr_add} readOnly />
        </form>
      </Content>
    </Layout>
  )
}
//---------------------------------------------------------------------

const Content = styled.div`
  padding: 30px 16px;
  .auth-wrap {
    h4 {
      text-align: center;
      color: #000;
      font-size: 16px;
      font-weight: 400;
      line-height: 24px;
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
      padding-top: 30px;
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
