import React, {useEffect, useContext, useState, useRef} from 'react'
import styled from 'styled-components'

import {useHistory, useLocation} from 'react-router-dom'

export default ({setBankPop, bankFormData}) => {
  const history = useHistory()

  const closePopup = () => {
    setBankPop(false)
  }

  return (
    <PopupWrap>
      <div className="content-wrap">
        <h3>무통장 입금이 지연되는 경우</h3>
        <div className="bankInfoBox">
          <p className="bankInfoBox__time">
            23시 50분 ~ 00시 10분은
            <br />
            <span>금융기관 시스템을 주로 점검하는 시간</span>입니다.
          </p>
          <p className="bankInfoBox__desc">
            무통장 입금이 지연되는 경우
            <br />
            해당 은행의 시스템 점검시간을 확인하세요.
          </p>

          <div className="bankTime">
            <button onClick={() => history.push('/pay/bank_info')}>은행별 점검시간 확인 &gt; </button>
            <p>
              ※ <span>다른 결제수단</span>을 이용하시면 <br />
              보다 빠르게 달 충전을 할 수 있습니다.
            </p>
          </div>

          <div className="btnWrap">
            <button onClick={() => setBankPop(false)}>다른 결제수단</button>
            <button
              onClick={() => {
                setBankPop(false)
                history.push({
                  pathname: '/pay/bank',
                  state: {
                    prdtNm: bankFormData.prdtNm,
                    prdtPrice: bankFormData.prdtPrice,
                    itemNo: bankFormData.itemNo,
                    webview: bankFormData.webview,
                    event: bankFormData.event,
                    itemAmt: bankFormData.itemAmt
                  }
                })
              }}>
              계속하기
            </button>
          </div>
        </div>
        <button
          className="btn-close"
          onClick={() => {
            closePopup()
          }}>
          <img src="https://image.dalbitlive.com/svg/ic_close_w.svg" />
        </button>
      </div>
    </PopupWrap>
  )
}

const PopupWrap = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 60;
  text-align: center;
  letter-spacing: -1px;
  background-color: rgba(0, 0, 0, 0.7);
  color: #000;
  display: flex;
  justify-content: center;
  align-items: center;

  .content-wrap {
    position: relative;
    width: calc(100% - 32px);
    max-width: 328px;
    border-radius: 12px;
    background-color: #fff;

    h3 {
      padding: 16px 0;
      font-size: 18px;
      border-bottom: 1px solid #eee;
    }

    .bankInfoBox {
      background-color: #eee;
      padding: 0 16px 16px;
      border-radius: 0 0 12px 12px;

      &__time {
        padding: 4px 0 10px;
        font-size: 16px;
        line-height: 24px;
        letter-spacing: -0.4px;
        font-weight: 600;
        text-align: center;
        span {
          color: #FF3C7B;
          letter-spacing: -1.8px;
        }
      }
      &__desc {
        padding-bottom: 20px;
        font-size: 13px;
        color: #757575;
        text-align: center;
        line-height: 1.4;
      }

      .bankTime {
        padding: 16px 0;
        border-radius: 12px;
        border: solid 1px #e0e0e0;
        background-color: #fff;
        font-size: 12px;
        line-height: 16px;
        text-align: center;

        span {
          color: #ec455f;
        }

        button {
          margin-bottom: 12px;
          padding: 0 10px;
          height: 27px;
          border-radius: 18px;
          background-color: #000;
          color: #fff;
          font-size: 13px;
        }
      }

      .btnWrap {
        display: flex;
        justify-content: space-between;
        margin-top: 16px;

        button {
          width: 146px;
          height: 44px;
          border-radius: 12px;
          background-color: #757575;
          color: #fff;
          font-size: 18px;

          &:last-child {
            background-color: #FF3C7B;
          }
        }
      }
    }

    .btn-close {
      position: absolute;
      top: -38px;
      right: 0;
      cursor: pointer;
    }
  }
`
