import React, {useEffect, useState, useContext} from 'react'
import {Context} from "context";

import Api from 'context/api'
import Utility from 'components/lib/utility'

// global components
import Header from 'components/ui/header/Header'
import SubmitBtn from 'components/ui/submitBtn/SubmitBtn'
// components
// contents
// css
import './bankTransfer.scss'

const BankTransfer = () => {
  const context = useContext(Context);

  // 조회 Api

  // 결재단위 셀렉트
  const onSelectMethod = (e) => {
    const {targetIndex} = e.currentTarget.dataset
    
    setSelect(targetIndex)
  }

  useEffect(() => {
  },[])

  return (
    <section className="bankResult">
      <div className="result">
        <p className="title">
          <span>01030965957</span>(으)로<br />
          가상계좌 정보를 발송했습니다!
        </p>
        <p>
          24시간 내 해당계좌로 입금하시면 <br /> 달 충전이 완료됩니다.
        </p>
      </div>
      <div className="receiptBoard">
        <div className="text-wrap">
          <span>입금예정 금액</span>
          <p> 원(부가세포함)</p>
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
          <p className="highlight"></p>
        </div>
        <div className="text-wrap">
          <span>입금자</span>
          <p></p>
        </div>
      </div>
      <div className="btn-wrap">
        <button>확인</button>
      </div>
    </section>
  )
}

export default BankTransfer