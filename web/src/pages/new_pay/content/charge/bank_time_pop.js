import React, {useEffect, useContext, useState, useRef} from 'react'
import styled from 'styled-components'

import {useHistory, useLocation} from 'react-router-dom'

export default ({setBankPop, bankFormData}) => {
  let location = useLocation()
  const history = useHistory()

  const closePopup = () => {
    setBankPop(location.state)
  }

  return (
    <PopupWrap>
      <div className="content-wrap">
        <h3>은행 시스템 점검 안내</h3>
        <div className="bankInfoBox">
          <p className="bankInfoBox__time">
            23시 50분 ~ 00시 10분은
            <br />
            <span>금융기관의 시스템 점검시간</span> 입니다.
          </p>

          <div className="bankTime">
            <button onClick={() => history.push('/pay/bank_info')}>은행별 시스템 점검시간 확인 &gt; </button>
            <p>
              ※ <span>다른 결제수단</span>을 이용하시면 <br />
              보다 안정적으로 결제를 완료할 수 있습니다.
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
                    prdtNm: bankFormData.name,
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
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 60;
  text-align: center;
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
        padding: 20px 0 16px;
        font-size: 16px;
        line-height: 24px;
        letter-spacing: -0.4px;
        text-align: center;
        font-weight: 600;

        span {
          color: #632beb;
        }
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
            background-color: #632beb;
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
