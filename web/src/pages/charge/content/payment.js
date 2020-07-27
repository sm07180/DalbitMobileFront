import React, {useContext, useEffect, useRef, useState} from 'react'
import styled from 'styled-components'

import {Context} from 'context'
import {COLOR_MAIN} from 'context/color'
import Utility from 'components/lib/utility'
import Api from 'context/api'
import qs from 'query-string'

//layout
import Header from 'components/ui/new_header'

//static
import icoNotice from '../static/ic_notice.svg'

//방송방 내 결제에서는 헤더 보이지 않기, 취소 처리 등 다름

export default (props) => {
  return (
    <>
      <Header title="달 충전" />
      <Content>
        <h2>구매 내역</h2>
        <div className="field">
          <label>결제상품</label>
          <p>300달</p>
        </div>
        <div className="field">
          <label>결제금액</label>
          <p>
            <strong>30,000원</strong>
          </p>
        </div>

        <h2>결제 수단</h2>
        <div className="select-item">
          <button>신용카드 결제</button>
          <button>휴대폰 결제</button>
          <button className="on">신용카드 결제</button>
          <button>휴대폰 결제</button>
        </div>

        <div className="info-wrap">
          <h5>달 충전 안내</h5>
          <p>충전한 달의 유효기간은 구매일로부터 5년입니다.</p>
          <p>달 보유/구매/선물 내역은 내지갑에서 확인할 수 있습니다.</p>
          <p>미성년자가 결제할 경우 법정대리인이 동의하지 아니하면 본인 또는 법정대리인은 계약을 취소할 수 있습니다.</p>
          <p>사용하지 아니한 달은 7일 이내에 청약철회 등 환불을 할 수 있습니다.</p>
        </div>
      </Content>
    </>
  )
}

const Content = styled.div`
  min-height: calc(100vh - 40px);
  padding: 0 16px;
  background: #eeeeee;

  h2 {
    padding: 15px 0 4px 0;
    font-size: 16px;
    font-weight: 900;
  }

  .field {
    display: flex;
    align-items: center;
    height: 44px;
    margin-top: 4px;
    padding: 0 16px;
    border-radius: 12px;
    border: solid 1px #e0e0e0;
    background-color: #ffffff;

    label {
      color: ${COLOR_MAIN};
      font-size: 14px;
      font-weight: bold;
    }
    p {
      margin-left: auto;
      font-size: 14px;
      font-weight: bold;
      strong {
        font-size: 18px;
      }
    }
  }

  .select-item {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    button {
      width: calc(50% - 2px);
      height: 44px;
      margin-bottom: 4px;
      background: #ffffff;
      border-radius: 12px;
      border: 1px solid #e0e0e0;
      font-size: 14px;
      font-weight: bold;

      &.on {
        border-color: ${COLOR_MAIN};
        color: ${COLOR_MAIN};
      }
    }
  }

  .info-wrap {
    margin-top: 30px;
    h5 {
      margin-bottom: 5px;
      padding-left: 16px;
      background: url(${icoNotice}) no-repeat left center;
      color: #424242;
      font-size: 12px;
      font-weight: bold;
    }
    p {
      position: relative;
      padding-left: 16px;
      color: #757575;
      font-size: 12px;
      line-height: 20px;
      &::before {
        position: absolute;
        left: 6px;
        top: 9px;
        width: 2px;
        height: 2px;
        background: #757575;
        content: '';
      }
    }
  }
`