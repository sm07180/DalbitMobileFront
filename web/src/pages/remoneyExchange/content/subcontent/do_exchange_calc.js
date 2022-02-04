import React from 'react'

const ExchangeReceipt = (props) => {
  const {type} = props

  return (
    <>
      {type !== 'result' ? 
        <div className="receiptBoard">
          <div className="text-wrap">
            <span>환전 신청 금액</span>
            <p>KRW 180,000</p>
          </div>
          {/* <div className="text-wrap">
            <span>스페셜DJ 혜택(+5%)</span>
            <p>+</p>
          </div> */}
          <div className="text-wrap">
            <span>원천징수세액</span>
            <p>-5940</p>
          </div>
          <div className="text-wrap">
            <span>이체 수수료</span>
            <p>-500</p>
          </div>
          <div className="text-wrap total">
            <span>환전 예상 금액</span>
            <p className="highlight">KRW 175360</p>
          </div>
        </div>
       :
        <div className="receiptBoard">
          <div className="text-wrap">
            <span>환전 신청 별</span>
            <p>3,000</p>
          </div>
          <div className="text-wrap">
            <span>환전 실수령액</span>
            <p>
              <span className="highlight">173,560</span>원
            </p>
          </div>
          <div className="text-wrap">
            <span>예금주</span>
            <p>홍길동</p>
          </div>
          <div className="text-wrap">
            <span>입금 예정 은행</span>
            <p>KB 국민은행</p>
          </div>
          <div className="text-wrap">
            <span>계좌번호</span>
            <p>12313-123123-123123123</p>
          </div>
        </div>
       }
      
    </>
  )
}

export default ExchangeReceipt