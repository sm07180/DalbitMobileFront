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
import {Context} from 'context'

import qs from 'query-string'
//
export default props => {
  //---------------------------------------------------------------------
  //context
  const context = useContext(Context)

  const {webview} = qs.parse(location.search)

  if (__NODE_ENV === 'dev' && _.hasIn(props, 'location.state.result')) {
    if (props.location.state.result === 'success') {
      //Hybrid('CloseLayerPopup')
      //--------------------결제완료

      if (props.location.state.state === 'auth') {
        window.location.href = '/pay?webview=new'
        //window.location.href = '/selfauth_result?webview=new'
      } else if (props.location.state.state === 'pay') {
        //window.location.href = '/pay_result?webview=new'
        if (props.location.state.returntype === 'store') {
          window.location.href = '/'
        } else {
          alert('결제완료')
          window.location.href = '/pay_result?webview=new'
        }
      }
    } else {
      if (props.location.state.state === 'pay') {
        Hybrid('ClosePayPopup')
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
        <Content {...props} />
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
