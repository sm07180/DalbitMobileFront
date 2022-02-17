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
import './exchangeDal.scss'

const dalPrice = [
  {dal: 30,price:50},
  {dal: 120,price:200},
  {dal: 180,price:300},
  {dal: 300,price:500},
  {dal: 600,price:1000},
  {dal: 3000,price:5000},
]

const ExchangeDal = () => {
  const context = useContext(Context);
  const [select, setSelect] = useState(3);

  const [orderPage, setOrderPage] = useState(true);

  // 조회 Api

  // 결재단위 셀렉트
  const onSelectDal = (e) => {
    const {targetIndex} = e.currentTarget.dataset
    
    setSelect(targetIndex)
  }

  return (
    <>
      <div id="exchangeDal">
        <Header title="달 교환" position="sticky" type="back" />
        <section className="myhaveDal">
          <div className="title">내가 보유한 별</div>
          <span className="byeol">{Utility.addComma(12345)}</span>
        </section>
        <section className="storeDalList">
          {dalPrice && dalPrice.map((data,index) => {
            return (
              <div className={`item ${Number(select) === index && 'active'}`} data-target-index={index} onClick={onSelectDal} key={index}>
                <div className="itemIcon"></div>
                <div className="dal">{Utility.addComma(data.dal)}</div>
                <div className="price">{`${Utility.addComma(data.price)} 별`}</div>
              </div>
            )
          })}
          <SubmitBtn text="교환하기" />
        </section>
        <section className="noticeInfo">
          <h3>유의사항</h3>
          <p>달교환은 최소 50별 이상부터 가능합니다.</p>
          <p>별을 달로 교환할 경우 교환달로 아이템 선물이 가능합니다.</p>
          <p>별을 달로 교환할 경우 1exp를 획득할 수 있습니다.</p>
        </section>
      </div>
    </>
  )
}

export default ExchangeDal