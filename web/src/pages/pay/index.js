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
export default (props) => {
  //---------------------------------------------------------------------
  //context
  const context = useContext(Context)

  const {webview} = qs.parse(location.search)

  const {result, message, state, returntype} = _.hasIn(props, 'location.state.result') ? props.location.state : ''

  const [pageState, setPageState] = useState(_.hasIn(props, 'location.state.result'))

  if (_.hasIn(props, 'location.state.result')) {
    if (result === 'success') {
      if (state === 'pay') {
        if (returntype === 'room') {
          window.location.href = '/pay_result?webview=new&returntype=room'
        } else {
          const {prdtPrice, prdtNm, phoneNo, orderId, cardName, cardNum, apprno, pgcode, giftType} = props.location.state
          let payType
          if (!phoneNo && cardNum) {
            payType = '카드 결제'
          } else if (!cardNum && phoneNo) {
            payType = '휴대폰 결제'
          } else if (giftType !== undefined) {
            switch (giftType) {
              case 'GM':
                payType = '문화상품권'
                break
              case 'GG':
                payType = '게임문화상품권'
                break
              case 'GC':
                payType = '도서문화상품권'
                break
              case 'HM':
                payType = '해피머니상품권'
              default:
                payType = '상품권'
                break
            }
          } else {
            switch (pgcode) {
              case 'tmoney':
                payType = '티머니'
                break
              case 'cashbee':
                payType = '캐시비'
                break
              case 'kakaopay':
                payType = '카카오페이'
                break
              case 'payco':
                payType = '페이코'
                break
              case 'toss':
                payType = '토스'
                break
              default:
                payType = 'PayLetter'
                break
            }
          }
          const payInfo = {
            prdtPrice: prdtPrice,
            prdtNm: prdtNm,
            payType: payType,
            phoneNo: phoneNo,
            orderId: orderId,
            cardName: cardName,
            cardNum: cardNum,
            apprno: apprno
          }
          //alert(JSON.stringify(payInfo))
          sessionStorage.setItem('pay_info', JSON.stringify(payInfo))
          window.location.href = '/'
        }
      }
    } else {
      //취소로직
      if (state === 'pay') {
        if (returntype === 'room') {
          Hybrid('ClosePayPopup')
        } else {
          window.location.href = '/'
        }
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
        {!pageState && <Content {...props} />}
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
