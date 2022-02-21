import React, {useEffect, useRef} from 'react'
import styled from 'styled-components'
import Utility from 'components/lib/utility'

// static
import CloseBtn from '../static/ic_close.svg'

let prevAlign = null
let prevGender = null

export default (props) => {
  const {setPopup, info} = props
  const {prdtPrice, prdtNm, phoneNo, payType, orderId, cardName, cardNum, apprno} = info

  // reference
  const layerWrapRef = useRef()

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const closePopup = () => {
    setPopup()
  }

  const wrapClick = (e) => {
    const target = e.target
    if (target.id === 'main-layer-popup') {
      closePopup()
    }
  }

  const wrapTouch = (e) => {
    e.preventDefault()
  }

  const applyClick = () => {
    setPopup()
  }

  const createTypeResult = () => {
    if (payType === '휴대폰 결제') {
      return (
        <>
          <div className="exchangeList">
            휴대폰번호 <div className="exchangeList__text">{Utility.phoneAddHypen(phoneNo)}</div>
          </div>
          <div className="exchangeList">
            주문번호 <div className="exchangeList__text">{orderId}</div>
          </div>
        </>
      )
    } else if (payType === '카드 결제') {
      return (
        <>
          <div className="exchangeList">
            결제카드 <div className="exchangeList__text">{cardName}</div>
          </div>
          <div className="exchangeList">
            승인번호 <div className="exchangeList__text">{apprno}</div>
          </div>
        </>
      )
    } else {
      return (
        <div className="exchangeList">
          주문번호 <div className="exchangeList__text">{orderId}</div>
        </div>
      )
    }
  }

  return (
    <PopupWrap id="main-layer-popup" ref={layerWrapRef}>
      <div className="content-wrap">
        <div className="title-wrap">
          <div className="text">결제 완료</div>
          <img src={CloseBtn} className="close-btn" onClick={() => closePopup()} />
        </div>

        <div className="content">
          <h2 className="charge__title">결제가 완료 되었습니다.</h2>
          <div className="exchangeList">
            결제금액
            <div className="exchangeList__text">
              <div className="exchangeList__text exchangeList__text--purple">{Utility.addComma(prdtPrice)}</div>원 (부가세 포함)
            </div>
          </div>
          <div className="exchangeList">
            상품명 <div className="exchangeList__text">{prdtNm}</div>
          </div>
          <div className="exchangeList">
            결제수단 <div className="exchangeList__text">{payType}</div>
          </div>

          {createTypeResult()}

          <div className="exchangeList__notice">
            결제 내역은 마이페이지 &gt; 내지갑에서
            <br /> 확인하실 수 있습니다.
            <br />
            확인 버튼을 누르시면 팝업을 닫습니다.
            <br />
          </div>
        </div>

        <div className="btn-wrap">
          <button className="apply-btn" onClick={applyClick}>
            확인
          </button>
        </div>
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

  display: flex;
  justify-content: center;
  align-items: center;

  .content-wrap {
    width: calc(100% - 32px);
    max-width: 390px;
    padding: 16px;
    padding-top: 6px;
    border-radius: 12px;
    background-color: #fff;

    .title-wrap {
      position: relative;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #e0e0e0;
      height: 48px;

      .text {
        width: 100%;
        font-weight: 600;
        font-size: 18px;
        text-align: center;
      }

      .close-btn {
        position: absolute;
        top: 4px;
        right: 0;
        cursor: pointer;
      }
    }

    .each-line {
      margin-top: 24px;

      .text {
        font-size: 16px;
        font-weight: 500;
        margin-bottom: 10px;
      }

      .tab-wrap {
        display: flex;
        flex-direction: row;

        .tab {
          border: 1px solid #e0e0e0;
          border-radius: 12px;
          font-size: 14px;
          color: #000;

          width: 33.3334%;
          padding: 7px 0;
          margin: 0 2px;
          box-sizing: border-box;
          text-align: center;

          &.active {
            border-color: transparent;
            background-color: #FF3C7B;
            color: #fff;
          }

          &:first-child {
            margin-left: 0;
          }
          &:last-child {
            margin-right: 0;
          }
        }
      }
    }

    .btn-wrap {
      margin-top: 20px;

      .apply-btn {
        display: block;
        width: 100%;
        /* margin-left: -6px;
        margin-bottom: -6px; */
        border-radius: 12px;
        background-color: #FF3C7B;
        color: #fff;
        font-size: 16px;
        font-weight: 400;
        padding: 12px 0;
      }
    }
  }

  .exchangeList {
    display: flex;
    height: 40px;
    align-items: center;
    font-size: 14px;
    font-weight: 600;
    border-bottom: 1px solid #e0e0e0;
    &__text {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: auto;

      &--purple {
        display: flex;
        margin-right: 2px;
        color: #FF3C7B;
        font-size: 20px;
      }
    }
    &__notice {
      margin-top: 20px;
      font-size: 14px;
      line-height: 20px;
      text-align: center;
      margin-bottom: 32px;
      letter-spacing: -0.5px;
    }
  }

  .chargeButton {
    width: 100%;
    height: 40px;
    margin-bottom: 40px;
    border-radius: 4px;
    background: #bdbdbd;
    color: #fff;

    &--active {
      background: #FF3C7B;
    }
  }

  .charge__title {
    padding: 20px 0 14px 0;
    border-bottom: 1px solid #FF3C7B;
    color: #FF3C7B;
    font-size: 16px;
    font-weight: 600;
  }
`
