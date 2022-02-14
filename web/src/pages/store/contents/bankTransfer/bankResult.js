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
import {useHistory, useLocation} from "react-router-dom";
import {Hybrid} from "context/hybrid";

const BankResult = () => {
  const location = useLocation()
  const history = useHistory()
  const {itemPrice, name, bankNo, phone, webview, event} = location.state
  const pageCode = webview === 'new' ? '2' : '1'

  const successClick = () => {
    if (pageCode === '2') {
      Hybrid('CloseLayerPopup')
      Hybrid('ClosePayPopup')
    } else {
      if (event === '3') {
        history.push('/event/purchase')
      } else {
        history.push('/')
      }
    }
  }

  const phoneAddHypen = (string) => {
    if (typeof string === 'string' && string !== '')
      return string
        .replace(/[^0-9]/g, '')
        .replace(/(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})/, '$1-$2-$3')
        .replace('--', '-')
  }

    return (
    <section className="bankResult">
      <div className="resultText">
        <div className="title">
          <span>{phoneAddHypen(phone)}</span>(으)로<br />
          가상계좌 정보를 발송했습니다!
        </div>
        <div className="subTitle">
          24시간 내 해당계좌로 입금하시면<br />달 충전이 완료됩니다.
        </div>
      </div>
      <div className="receiptBoard">
        <div className="receiptList">
          <span>입금예정 금액</span>
          <p>{Utility.addComma(itemPrice)} 원(부가세포함)</p>
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
          <p className="point">{bankNo}</p>
        </div>
        <div className="receiptList">
          <span>입금자</span>
          <p>{name}</p>
        </div>
      </div>
      <SubmitBtn text="확인" onClick={successClick}/>
    </section>
  )
}

export default BankResult;