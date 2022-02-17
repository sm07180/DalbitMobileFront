import React, {useEffect, useState} from 'react'
import Utility from 'components/lib/utility'

// global components
import Header from 'components/ui/header/Header'
import CntTitle from 'components/ui/cntTitle/CntTitle'
import SubmitBtn from 'components/ui/submitBtn/SubmitBtn'
// components
import PopSlide from '../../components/PopSlide'
// contents
// css
import './dalCharge.scss'

const paymentMethod = ['계좌 간편결제','무통장(계좌이체)','신용/체크카드','휴대폰','카카오페이(머니)','카카오페이(카드)','페이코','티머니/캐시비','문화상품권','해피머니상품권']

const DalCharge = () => {
  const [select, setSelect] = useState(3);
  const [popSlide, setPopSlide] = useState(false);

  // 조회 Api

  //-- 동작 함수
  // 결제수단 선택
  const onSelectMethod = (e) => {
    const {targetIndex} = e.currentTarget.dataset

    setSelect(targetIndex)
    if (Number(targetIndex) === 1) {
      setPopSlide(!popSlide)
    }
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
      {popSlide === true &&
        <PopSlide setPopSlide={setPopSlide}>
          <div className='title'>인증 정보를 확인해주세요!</div>
          <div className="infoBox">
            <p className='name'>홍길동</p>
            <p className='phoneNum'>010-111-2222</p>
          </div>
          <p className='text'>
          안전한 계좌 정보 등록을 위해 한번 더<br/>
          본인인증을 해주셔야 합니다.<br/>
          추가 인증 시에는 반드시 위의 회원정보와 일치해야 합니다.<br/>
          추가 인증은 딱 1회만 진행됩니다.
          </p>
          <SubmitBtn text="다음" />
        </PopSlide>
      }
    </div>
  )
}

export default DalCharge
