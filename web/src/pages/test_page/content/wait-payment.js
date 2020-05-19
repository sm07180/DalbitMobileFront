import React from 'react'
import '../seo.scss'
import BackBtn from '../static/ic_back.svg'
import IconMoney from '../static/ic_money.svg'

import Utility from 'components/lib/utility'
export default props => {
  const { name, phone, paymentPriceAddVat, receipt, receiptInput } = props.location.state ? props.location.state : props.history.goBack();

  return (
    <>
      <div className="header">
        <img src={BackBtn} className="header__button--back" onClick={() => {props.history.goBack()}} />
        <h1 className="header__title">달 충전 결제 대기중</h1>
      </div>
      <div className="content">
        <div className="payHold">
          <h2 className="payHold__title">
            <img src={IconMoney} className="payHold__object" />
            결제대기중
            <i className="payHold__dot"></i>
            <i className="payHold__dot"></i>
            <i className="payHold__dot"></i>
          </h2>

          <div className="payHold__sub">
            <span className="payHold__sub--text">24시간 내 해당계좌로 입금</span>하시면
            <br />달 충전이 완료 됩니다.
          </div>
        </div>

        <div className="phone">
          <div className="phone__title">{phone}</div>
          <div className="phone__text">해당 번호로 가상계좌 정보가 발송되었습니다.</div>
        </div>

        <div className="deposit">
          <div className="deposit__list">
            <div className="deposit__label">입금하실 금액</div>
            <div className="deposit__value">{Utility.addComma(paymentPriceAddVat)}원(부가세 포함)</div>
          </div>
          <div className="deposit__list">
            <div className="list__label">예금주</div>
            <div className="deposit__value">(주)인포렉스</div>
          </div>
          <div className="deposit__list">
            <div className="list__label">입금은행</div>
            <div className="deposit__value">KB 국민은행</div>
          </div>
          <div className="deposit__list">
            <div className="list__label">입금은행</div>
            <div className="deposit__value">197790-71-606640</div>
          </div>
          <div className="deposit__list">
            <div className="list__label">입금자명</div>
            <div className="deposit__value">{name}</div>
          </div>
        </div>
        <div className="inquiry">
          <span className="inquriy__title">결제 문의</span>
          <span className="inquiry__number">1522-0251</span>
        </div>

        <button className="chargeButton">확인</button>
      </div>
    </>
  )
}
