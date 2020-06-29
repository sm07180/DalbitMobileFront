import React, {useContext, useState, useEffect} from 'react'
import styled from 'styled-components'
import qs from 'query-string'

//context
import {COLOR_MAIN} from 'context/color'

//layout
import Layout from 'pages/common/layout'
import Header from 'components/ui/new_header'
import {stringify} from 'qs'

//
export default (props) => {
  //---------------------------------------------------------------------
  //state

  const data = {
    result: 'success',
    returntype: 'legal'
  }

  /**
   * returntype
   * self : 자기 자신 본인인증 완료 후
   * legal : 법정대리인 본인인증 완료 후
   */
  //const {result, returntype} = props.locaiton.state
  const {result, returntype} = data

  alert(JSON.stringify(data))

  if (result !== 'success')
    return context.action.alert({
      msg: '본인인증 실패'
    })

  useEffect(() => {}, [])

  const createResult = () => {
    if (returntype === 'self') {
      return (
        <div className="auth-wrap">
          <h4>
            <strong>본인인증이 완료되었습니다.</strong>
          </h4>
          <h5>
            20세 미만의 회원의 환전 신청 시 <br />
            <span>법정대리인(보호자) 동의가 필요합니다.</span>
          </h5>
          <p>
            ※ 법정대리인(보호자) 동의 시 제공되는 정보는 <br />
            해당 인증기관에서 직접 수집하여, 인증 이외의 용도로 이용 또는 <br />
            저장되지 않습니다.
          </p>
          <div className="btn-wrap">
            <button className="cancel">취소</button>
            <button>동의 받기</button>
          </div>
        </div>
      )
    } else if (returntype === 'legal') {
      return (
        <div className="auth-wrap">
          <h4>
            20세 미만 미성년자 이용에 대한
            <br />
            <span>법정대리인(보호자) 동의가 완료</span>되었습니다.
          </h4>
          <p>
            ※ 동의 철회를 원하시는 경우, <br />
            달빛라디오 고객센터에서 철회 신청을 해주시기 바랍니다.
          </p>
          <div className="btn-wrap">
            <button>확인</button>
          </div>
        </div>
      )
    }
  }

  //---------------------------------------------------------------------
  return (
    <Layout {...props} status="no_gnb">
      <Header title={returntype === 'self' ? '본인인증 완료' : '법정대리인(보호자) 동의 완료'} />
      <Content>{createResult()}</Content>
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
      line-height: 20px;
      strong {
        font-weight: 600;
      }
      span {
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
