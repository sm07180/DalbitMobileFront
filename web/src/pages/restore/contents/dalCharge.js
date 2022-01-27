import React, {useEffect, useState, useContext} from 'react'
import {Context} from "context";

import Api from 'context/api'
import Utility from 'components/lib/utility'

// global components
import Header from 'components/ui/header/Header'
import CntTitle from 'components/ui/cntTitle/CntTitle'
import BannerSlide from 'components/ui/bannerSlide/BannerSlide'
// components
// contents
// css
import './dalCharge.scss'

const paymentMethod = ['계좌 간편결제','무통장(계좌이체)','신용/체크카드','휴대폰','카카오페이(머니)','카카오페이(카드)','페이코','티머니/캐시비','문화상품권','해피머니상품권']

const DalCharge = () => {
  const context = useContext(Context);
  const [select, setSelect] = useState(3);

  // 조회 Api

  // 결재단위 셀렉트
  const onSelectMethod = (e) => {
    const {targetIndex} = e.currentTarget.dataset
    
    setSelect(targetIndex)
  }

  useEffect(() => {
  },[])

  return (
    <div id="dalCharge">
      <Header title="달 충전하기" position="sticky" type="back" />
      <section className="purchaseInfo">
        <CntTitle title="구매내역" />
        <div className="infoBox">
          <div className="infoList">
            <div className="title">구매상품</div>
            <p>{Utility.addComma(11000)} <strong>개</strong></p>
          </div>
          {true && (
            <div className="infoList">
              <div className="title">추가지급</div>
              <p>{Utility.addComma(500)} <strong>개</strong></p>
            </div>
          )}
          <div className="infoList">
            <div className="title">상품수량</div>
            <p className="quantity">
              <button className="minus">-</button>
              <span>5</span>
              <button className="plus">+</button>
            </p>
          </div>
          <div className="infoList">
            <div className="title">총</div>
            <p>{Utility.addComma(1100000)} <strong>원</strong></p>
          </div>
        </div>
        <div className="infoBox" style={{marginTop:'10px'}}>
          <div className="infoList">
            <div className='title'>결제금액</div>
            <p>{Utility.addComma(1100000)} <strong>원</strong></p>
          </div>
        </div>
      </section>
      <section className="paymentMethod">
        <CntTitle title="결제수단" />
        <div className="selectWrap">
          {paymentMethod.map((data,index) => {
            return (
              <div className={`selectItem ${Number(select) === index && 'active'}`} onClick={onSelectMethod} data-target-index={index} key={index}>{data}</div>
            )
          })}
        </div>
      </section>
      <section className="noticeInfo">
        <h3>유의사항</h3>
        <p>충전한 달의 유효기간은 구매일로부터 5년입니다.</p>
        <p>달 보유/구매/선물 내역은 내지갑에서 확인할 수 있습니다.</p>
        <p>미성년자가 결제할 경우 법정대리인이 동의하지 아니하면 본인 또는 법정대리인은 계약을 취소할 수 있습니다.</p>
        <p>사용하지 아니한 달은 7일 이내에 청약철회 등 환불을 할 수 있습니다.</p>
      </section>
      <section className="bottomInfo">
        결제문의 <span>1522-0251</span>
      </section>
    </div>
  )
}

export default DalCharge