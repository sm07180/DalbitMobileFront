/**
 * @file /mpay/index.js
 * @brief 안드로이드 전용 결제
 */
import React, {useContext, useState} from 'react'
//context
import {PayProvider} from './store'
//layout
import Layout from 'pages/common/layout'
//components
import {Hybrid} from 'context/hybrid'
import styled from 'styled-components'

import Content from './content'
import _ from 'lodash'
//
export default props => {
  //---------------------------------------------------------------------
  //state
  const [payState, setPayState] = useState(false)
  //context
  if (__NODE_ENV === 'dev' && _.hasIn(props, 'location.state.result')) {
    if (props.location.state.result === 'success') {
      // alert('### 결제완료_화면디자인필요 ###')
      // alert(props.location.state.message)
      // alert(JSON.stringify(props.location.state, null, 1))
      //Hybrid('CloseLayerPopup')
      //메인에서 스토어에서 뒤로가기 막아야함
      //window.location.href = '/pay?webview=new'
      //--------------------결제완료
      if (props.location.state.state === 'auth') {
        window.location.href = '/pay?webview=new'
      } else if (props.location.state.state === 'pay') {
        alert('결제완료,  setPayState(true)')
        setPayState(true)
      }
    }
  }
  /**
   *
   * @returns
   */
  //---------------------------------------------------------------------
  return (
    <PayProvider>
      <Layout {...props} status="no_gnb">
        {payState ? (
          <ChargeWrap>
            <h4>결제가 완료되었습니다.</h4>
            <button
              onClick={() => {
                Hybrid('CloseLayerPopup')
              }}>
              확인
            </button>
          </ChargeWrap>
        ) : (
          <Content {...props} />
        )}
      </Layout>
    </PayProvider>
  )
}
//---------------------------------------------------------------------

const ChargeWrap = styled.div`
  margin: 30px auto 70px auto;
  h4 {
    padding-top: 40px;
    color: #555;
    font-size: 20px;
    font-weight: 600;
    line-height: 34px;
    text-align: center;
  }

  button {
    display: block;
    max-width: 328px;
    width: 100%;
    margin: 40px auto 30px auto;
    border-radius: 5px;
    background: #632beb;
    color: #fff;
    line-height: 48px;
  }
`
