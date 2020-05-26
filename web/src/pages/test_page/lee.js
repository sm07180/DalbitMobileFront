import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import SelectBoxWrap from './component/select'

import './lee.scss'
import BackBtn from './static/ic_back.svg'

export default () => {
  const [status, setStatus] = useState(1)

  const [name, setName] = useState(false)

  const handleChange = event => {
    console.log(event.target)
  }

  const Routing = () => {}

  const tempFunc = () => {
    if (status === 1) {
      return <div></div>
    } else if (status === 2) {
      return (
        <div className="receipt__sub">
          <label className="receipt__label">주민번호</label>{' '}
          <input className="receipt__input">
            {' '}
            <SelectBoxWrap boxList={[{value: 0, text: '주민번호'}]} onChangeEvent={() => console.log('hi')} />
          </input>
        </div>
      )
    } else {
      return (
        <div className="receipt__sub">
          <label className="receipt__label">사업자 번호</label> <input className="receipt__input" value="12341234"></input>
        </div>
      )
    }
  }

  return (
    <>
      <div className="header">
        <img className="header__button--back" src={BackBtn} />
        <h1 className="header__title">달 충전하기</h1>
      </div>

      <div className="content">
        <div className="buyList">
          <h2 className="charge__title">구매 내역</h2>

          <div className="buyList__box">
            <div className="buyList__label">결제상품</div>
            <div className="buyList__value">달 100</div>
            <div className="buyList__label">결제금액</div>
            <div className="buyList__value">
              <span className="buyList__value--point">50,000</span> 원
            </div>
          </div>
        </div>

        <div className="payMathod">
          <h2 className="charge__title">결제 수단</h2>

          <div className="payMathod__box">
            <button className="payMathod__button">신용카드 결제</button>
            <button className="payMathod__button">휴대폰 결제</button>
            <button className="payMathod__button payMathod__button--forced">무통장 입금(계좌이체)</button>
            <button className="payMathod__button">실시간 계좌이체</button>
          </div>
        </div>

        <div className="depositInfo">
          <h2 className="charge__title">무통장 입금 정보</h2>

          <div className="depositInfo__box">
            <div className="depositInfo__label">입금정보</div>
            <div className="depositInfo__value">
              <span className="depositInfo__value--point">55,000 원</span> (부가세 포함)
            </div>

            <div className="depositInfo__label">입금은행</div>
            <div className="depositInfo__value">국민은행</div>

            <div className="depositInfo__label">입금자명</div>
            <div className="depositInfo__value">
              <input type="text" name="name" onChange={handleChange} value="" className="depositInfo__input"></input>
            </div>

            <div className="depositInfo__label">휴대폰번호</div>
            <div className="depositInfo__value">
              <input
                type="text"
                name="phone"
                onChange={() => {
                  setPhone('')
                }}
                value=""
                className="depositInfo__input"></input>
            </div>
          </div>
        </div>

        <div className="receipt">
          <h2 className="charge__title">현금영수증</h2>

          <div className={`receipt__box ${status === 1 && 'receipt__button--forced'}`}>
            <button className={`receipt__button ${status === 1 && 'receipt__button--forced'}`} onClick={() => setStatus(1)}>
              선택안함
            </button>
            <button className={`receipt__button ${status === 2 && 'receipt__button--forced'}`} onClick={() => setStatus(2)}>
              소득공제용
            </button>
            <button className={`receipt__button ${status === 3 && 'receipt__button--forced'}`} onClick={() => setStatus(3)}>
              지출증빙용
            </button>
          </div>

          {tempFunc()}
        </div>

        <div className="notice">
          <p className="notice__title">
            <span className="notice__title--icon">!</span> 달 충전 안내
          </p>

          <ul>
            <li className="notice__text">∙ 충전한 달의 유효기간은 구매일로부터 5년입니다.</li>
            <li className="notice__text">∙ 달 보유/구매/선물 내역은 내지갑에서 확인할 수 있습니다.</li>
            <li className="notice__text">
              ∙ 미성년자가 결제할 경우 법정대리인이 동의하지 아니하면 본인 또는 법정대리인은 계약을 취소할 수 있습니다.
            </li>
            <li className="notice__text">∙ 사용하지 아니한 달은 7일 이내에 청약철회 등 환불을 할 수 있습니다.</li>
          </ul>
        </div>

        <div className="inquiry">
          <span className="inquriy__title">결제 문의</span>
          <span className="inquiry__number">1522-0251</span>
        </div>

        <button className="chargeButton"></button>
      </div>
    </>
  )
}
