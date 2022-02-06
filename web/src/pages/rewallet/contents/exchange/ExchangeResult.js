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
import './exchangeResult.scss'

const ExchangeResult = () => {
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
    <div id="resultPage">
      <Header title="환전하기" type="back" />
      <section className="bankResult">
        <div className="resultText">
          <div className="title">
            <span>환전 신청 완료</span> 되었습니다!
          </div>
          <div className="subTitle">
          실제 입금까지는 최대 2-3일 소요될 예정입니다.<br/>
          관련 문의는 고객센터로 부탁드립니다.
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
    </div>
  )
}

export default ExchangeResult