import React, {useState, useEffect} from 'react'
import Utility ,{addComma} from 'components/lib/utility'

// global components
// components
import DepositInfo from '../components/DepositInfo'
// contents

const Exchange = (props) => {

  return (
    <>
    <section className="doExchange">
      <button className='noticeBtn'>
        <span>환전안내</span>
      </button>
      <div className="amountBox">
        <i className="iconStar"></i>
        <p>보유 별</p>
        <div className='counter active'>
          <input className="num" value={Utility.addComma(33000)} disabled/>
          <span className="unit">개</span>
        </div>
      </div>
      <div className="infoBox">
          {/* {badgeSpecial > 0 && (
            <>
              <p className="special">DJ님은 스페셜 DJ 입니다.</p>
              <p className="special">환전 실수령액이 5% 추가 됩니다.</p>
            </>
          )} */}
          <p>별은 570개 이상이어야 환전 신청이 가능합니다</p>
          <p>별 1개당 KRW 60으로 환전됩니다.</p>
      </div>
      <div className="amountBox apply">
        <i className="iconStar"></i>
        <p>환전 신청 별</p>
        <div className='counter active'>
          <input className='num' placeholder={Utility.addComma(33000)}/>
          <span className='unit'>개</span>
        </div>
      </div>
      <div className="buttonGroup">
        <button>
          환전 계산하기
        </button>
        <button className='exchange'>
          달 교환
        </button>
      </div>
    </section>
    <section className="receiptBoard">
      <div className="receiptList">
        <span>환전 신청 금액</span>
        <p>KRW {Utility.addComma(33000)}</p>
      </div>
      <div className="receiptList">
        <span>원천징수세액</span>
        <p>-{Utility.addComma(5940)}</p>
      </div>
      <div className="receiptList">
        <span>이체 수수료</span>
        <p>-{Utility.addComma(500)}</p>
      </div>
      <div className="receiptList">
        <span>환전 예상 금액</span>
        <p className="point">KRW {Utility.addComma(173560)}</p>
      </div>
    </section>
    <DepositInfo />
    </>
  )
}

export default Exchange