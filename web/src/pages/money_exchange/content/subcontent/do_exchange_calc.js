import React from 'react'

export default function ExchangeReceipt() {
  return (
    <div className="receiptBox">
      <div className="listRow">
        <div className="title">환전 신청 금액</div>
        <div className="value">KRW 180,000</div>
      </div>
      {/* <div className="listRow">
        <div className="title">스페셜DJ 혜택(+5%)</div>
        <div className="value">+</div>
      </div> */}
      <div className="listRow">
        <div className="title">원천징수세액</div>
        <div className="value">-5,940</div>
      </div>
      <div className="listRow">
        <div className="title">이체수수료</div>
        <div className="value">-500</div>
      </div>
      <div className="listRow">
        <div className="title total">환전 예상 금액</div>
        <div className="value total">KRW 173,560</div>
      </div>
    </div>
  )
}
