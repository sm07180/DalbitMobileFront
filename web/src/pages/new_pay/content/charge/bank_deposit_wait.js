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
        <div className="contentBox">
          <div className="top-info">
            <p className="title">
              <span>{phoneWithHypen}</span>(으)로
              <br />
              가상계좌 정보를 발송했습니다!
            </p>
            <p>
              24시간 내 해당계좌로 입금하시면 <br /> 달 충전이 완료됩니다.
            </p>
          </div>
          <div className="receiptBoard">
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
              <p className="highlight">KB국민은행</p>
            </div>
            <div className="text-wrap">
              <span>계좌번호</span>
              <p className="highlight">{bankNo}</p>
            </div>
            <div className="text-wrap">
              <span>입금자</span>
              <p>{name}</p>
            </div>
          </div>
          <div className="btn-wrap">
            <button onClick={handleClick}>확인</button>
          </div>
        </div>
      </Content>
    </>
  )
}
const Content = styled.div`
  min-height: calc(100vh - 40px);
  font-family: 'Noto Sans KR', sans-serif;
  font-weight: 500;
  color:#000;
  &.new {
    min-height: 100%;
  }
  .contentBox{
    padding: 0 16px 15px;
    background:#fff;
  }
  .top-info {
    margin:50px 0 47px 0;
    text-align: center;
    .title{
      font-size:22px;
      line-height:30px;
      color:#000;
      span {
        color: #FF3C7B;
      }
    }
    p {
      font-size: 13px;
      line-height: 20px;
      font-weight:400;
      color:#666
    }
    p + p {
      margin-top: 6px;
      color: #757575;
    }
  }
  .receiptBoard{
    width:100%;
    padding:0 15px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.24);
    background: url('https://image.dalbitlive.com/store/dalla/receiptBoard.png') no-repeat center / contain;
    .text-wrap {
      display: flex;
      align-items:center;
      height:36px;
      margin-top: 4px;
      span {
        font-size:13px;
        font-weight:400;
        color:#999999;
      }
      p {
        font-size:15px;
        font-weight:500;
        margin-left: auto;
        color: #000;
      }
      .highlight{
        color:#FF3C7B;
      }
    }
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
      background: #ff3c7b;
    }
  }
`
