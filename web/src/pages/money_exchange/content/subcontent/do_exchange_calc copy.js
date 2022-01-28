import React from 'react'

export default function MakeCalcContents({exchangeCalc}) {
  return (
    <div className="calcWrap">
      <div className="calcWrap__list calcWrap__list--bold">
        <div className="calcWrap__label calcWrap__label--title">환전 예상 금액</div>
        <div className="calcWrap__value">KRW {Number(exchangeCalc.basicCash).toLocaleString()}</div>
      </div>
      {exchangeCalc.benefitCash > 0 && (
        <div className="calcWrap__list">
          <div className="calcWrap__label">스페셜DJ 혜택(+5%)</div>
          <div className="calcWrap__value">+{Number(exchangeCalc.benefitCash).toLocaleString()}</div>
        </div>
      )}
      <div className="calcWrap__list">
        <div className="calcWrap__label">원천징수세액</div>
        <div className="calcWrap__value">-{Number(exchangeCalc.taxCash).toLocaleString()}</div>
      </div>
      <div className="calcWrap__list">
        <div className="calcWrap__label">이체수수료</div>
        <div className="calcWrap__value">-{Number(exchangeCalc.feeCash).toLocaleString()}</div>
      </div>
      <div className="calcWrap__list calcWrap__list--bold calcWrap__list--line">
        <div className="calcWrap__label calcWrap__label--title">환전 실수령액</div>
        <div className="calcWrap__value calcWrap__value--p">KRW {Number(exchangeCalc.realCash).toLocaleString()}</div>
      </div>
    </div>
  )
}
