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
import './bankResult.scss'

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
    <>
    <section className="bankResult">
      <div className="resultText">
        <div className="title">
          <span>01030965957</span>(으)로<br />
          가상계좌 정보를 발송했습니다!
        </div>
        <div className="subTitle">
          24시간 내 해당계좌로 입금하시면<br />달 충전이 완료됩니다.
        </div>
      </div>
      <div className="receiptBoard">
        <div className="receiptList">
          <span>입금예정 금액</span>
          <p>{Utility.addComma(33000)} 원(부가세포함)</p>
        </div>
        <div className="receiptList">
          <span>예금주</span>
          <p>(주)여보야</p>
        </div>
        <div className="receiptList">
          <span>입금은행</span>
          <p className="point">KB국민은행</p>
        </div>
        <div className="receiptList">
          <span>계좌번호</span>
          <p className="point">455-555-456789</p>
        </div>
        <div className="receiptList">
          <span>입금자</span>
          <p>홍길동</p>
        </div>
      </div>
      <SubmitBtn text="확인" />
    </section>
    </>
  )
}

export default BankTransfer