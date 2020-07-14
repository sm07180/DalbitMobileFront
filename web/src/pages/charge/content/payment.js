import React, {useContext, useEffect, useRef, useState} from 'react'
import styled from 'styled-components'

import {Context} from 'context'
import {COLOR_MAIN} from 'context/color'
import Utility from 'components/lib/utility'
import Api from 'context/api'
import qs from 'query-string'

//static
//layout
import Header from 'components/ui/new_header'

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
          <button>신용카드 결제</button>
          <button>휴대폰 결제</button>
        </div>

        <div className="info-wrap">
          <p className="title">달 충전 안내</p>
          <h5></h5>
          <p></p>
          <p className="list">충전한 달의 유효기간은 구매일로부터 5년입니다.</p>
          <p className="list">달 보유/구매/선물 내역은 내지갑에서 확인할 수 있습니다.</p>
          <p className="list">
            미성년자가 결제할 경우 법정대리인이 동의하지 아니하면 본인 또는 법정대리인은 계약을 취소할 수 있습니다.
          </p>
          <p className="list">사용하지 아니한 달은 7일 이내에 청약철회 등 환불을 할 수 있습니다.</p>
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
`
