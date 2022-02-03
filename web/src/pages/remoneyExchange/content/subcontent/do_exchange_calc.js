import React from 'react'

const ExchangeReceipt = (props) => {
  const {type} = props

  return (
    <>
      {type !== 'result' ? 
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
          <div className="listRow borderT">
            <div className="title total">환전 예상 금액</div>
            <div className="value total">KRW 173,560</div>
          </div>
        </div>
       :
        <div className="receiptBox">
          <div className="listRow">
            <div className="title">환전 신청 별</div>
            <div className="value">3,000</div>
          </div>
          <div className="listRow">
            <div className="title">환전 실수령액</div>
            <div className="value">
              <span>173,560</span>원
            </div>
          </div>
          <div className="listRow">
            <div className="title">예금주</div>
            <div className="value">홍길동</div>
          </div>
          <div className="listRow">
            <div className="title">입금 예정 은행</div>
            <div className="value">KB 국민은행</div>
          </div>
          <div className="listRow">
            <div className="title">계좌번호</div>
            <div className="value">12313-123123-123123123</div>
          </div>
        </div>
       }
      
    </>
  )
}

export default ExchangeReceipt