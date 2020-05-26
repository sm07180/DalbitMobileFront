import React, {useContext, useState, useEffect} from 'react'

//layout
import Layout from 'pages/common/layout'
//components
import {Hybrid} from 'context/hybrid'
import styled from 'styled-components'
import qs from 'query-string'
import _ from 'lodash'
import {Context} from 'context'

//
export default props => {
  //---------------------------------------------------------------------
  //state
  const context = useContext(Context)
  const {webview, returntype} = qs.parse(location.search)

  useEffect(() => {
    context.action.alert({
      msg: `결제가 완료되었습니다. \n 충전 내역은 '마이페이지 >\n 내 지갑'에서 확인해주세요.`,
      callback: () => {
        Hybrid('CloseLayerPopup')
        Hybrid('ClosePayPopup')
      }
    })
  }, [])

  /**
   *
   * @returns
   */
  //---------------------------------------------------------------------
  return <Layout {...props} status="no_gnb"></Layout>
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
