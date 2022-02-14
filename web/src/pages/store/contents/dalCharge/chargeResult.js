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
import './chargeResult.scss'

const ChargeResult = () => {
  const context = useContext(Context);
  const [payType, setPayType] = useState();

  const CreateTypeResult = () => {
    if (payType === 'tel') {
      return (
        <>
          <div className="receiptList">
            <span>휴대폰번호</span>
            <p>123123123</p>
          </div>
          <div className="receiptList">
            <span>주문번호</span>
            <p>416541651321</p>
          </div>
        </>
      )
    } else if (payType === 'card') {
      return (
        <>
          <div className="receiptList">
            <span>결제카드</span>
            <p>카드이름</p>
          </div>
          <div className="receiptList">
            <span>승인번호</span>
            <p>11235489584</p>
          </div>
        </>
      )
    } else {
      return (
        <div className="receiptList">
          <span>주문번호</span>
          <p>325165465498</p>
        </div>
      )
    }
  }

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
      <div className="resultText">
        <div className="title">
          <span>결제가 완료</span>되었습니다
        </div>
        <div className="subTitle">
          결제 내역은 마이페이지 &gt; 내지갑에서<br/>
          확인하실 수 있습니다.<br/>
          확인 버튼을 누르시면 메인화면으로 이동합니다.
        </div>
      </div>
      <div className="receiptBoard">
        <div className="receiptList">
          <span>결제금액</span>
          <p>{Utility.addComma(33000)} 원(부가세포함)</p>
        </div>
        <div className="receiptList">
          <span>상품명</span>
          <p>구매한 상품이름-------------</p>
        </div>
        <div className="receiptList">
          <span>결제수단</span>
          <p className="point">KB국민은행</p>
        </div>
        <CreateTypeResult />
      </div>
      <SubmitBtn text="확인" />
    </section>
  )
}

export default ChargeResult