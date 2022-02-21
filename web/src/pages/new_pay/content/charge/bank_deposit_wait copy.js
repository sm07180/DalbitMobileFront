/**
 * @route /pay/bank_wait
 * @file /pay/content/charge/bank_deposit_wait.js
 * @brief 무통장 입금(계좌이체) 결과 페이지
 */

import React from 'react'
import styled from 'styled-components'
import {useHistory, useLocation} from 'react-router-dom'
import {Hybrid} from 'context/hybrid'

//context
import qs from 'query-string'

//layout
import Header from 'components/ui/new_header'

export default () => {
  const location = useLocation()
  const history = useHistory()
  const {itemPrice, name, bankNo, phone, webview, event} = location.state
  const pageCode = webview === 'new' ? '2' : '1'

  const handleClick = () => {
    if (pageCode === '2') {
      Hybrid('CloseLayerPopup')
      Hybrid('ClosePayPopup')
    } else {
      if (event === '3') {
        history.push('/event/purchase')
      } else {
        history.push('/')
      }
    }
  }

  const phoneAddHypen = (string) => {
    if (typeof string === 'string' && string !== null && string !== '')
      return string
        .replace(/[^0-9]/g, '')
        .replace(/(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})/, '$1-$2-$3')
        .replace('--', '-')
  }

  const phoneWithHypen = phoneAddHypen(phone)

  return (
    <>
      {webview !== 'new' && <Header title="무통장 입금(계좌이체)" />}
      <Content className={webview ? 'new' : ''}>
        <h5 className="sub-title">결제 대기 중...</h5>
        <div className="top-info">
          <p>
            <span>{phoneWithHypen}</span>(으)로
            <br />
            입금하실 가상계좌 정보를 발송했습니다.
          </p>
          <p>
            24시간 내 해당계좌로 입금하시면 <br /> 달 충전이 완료됩니다.
          </p>
        </div>

        <div className="text-wrap">
          <span>입금예정 금액</span>
          <p>{Number(itemPrice).toLocaleString()}원(부가세포함)</p>
        </div>

        <div className="text-wrap">
          <span>예금주</span>
          <p>(주)여보야</p>
        </div>

        <div className="text-wrap">
          <span>입금은행</span>
          <p>KB국민은행</p>
        </div>

        <div className="text-wrap">
          <span>계좌번호</span>
          <p>{bankNo}</p>
        </div>

        <div className="text-wrap">
          <span>입금자</span>
          <p>{name}</p>
        </div>

        <div className="btn-wrap">
          <button onClick={handleClick}>확인</button>
        </div>
      </Content>
    </>
  )
}
const Content = styled.div`
  min-height: calc(100vh - 40px);
  padding: 6px 16px;
  background: #eeeeee;
  padding-bottom: 30px;
  &.new {
    min-height: 100%;
  }

  .top-info {
    margin-bottom: 8px;
    margin-top: 8px;
    padding: 16px;
    border: 1px solid #ec455f;
    border-radius: 12px;
    background: #fff;
    text-align: center;
    p {
      font-size: 14px;
      line-height: 20px;
      font-weight: bold;
    }
    p:first-child {
      span {
        color: #ec455f;
      }
      color: #000;
    }
    p + p {
      margin-top: 6px;
      color: #757575;
    }
  }

  .text-wrap {
    display: flex;
    margin-top: 4px;
    padding: 0 16px;
    border-radius: 12px;
    border: 1px solid #e0e0e0;
    background: #fff;
    line-height: 42px;
    font-size: 14px;
    font-weight: bold;
    span {
      display: inline-block;
      color: #FF3C7B;
    }
    p {
      margin-left: auto;
      color: #000;
    }
  }

  .sub-title {
    padding-top: 15px;
    font-size: 16px;
    font-weight: 900;
    color: #000;
  }

  .btn-wrap {
    padding-top: 32px;
    button {
      width: 100%;
      height: 44px;
      border-radius: 12px;
      color: #fff;
      font-size: 18px;
      font-weight: bold;
      background: #FF3C7B;
    }
    button:disabled {
      background: #757575;
    }
  }
`
