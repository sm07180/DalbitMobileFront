import React, { useState, useContext, useRef, useEffect } from 'react'
import { Context } from 'context'
//import { Link } from 'react-router-dom'

import './payment.scss'
import BackBtn from '../static/ic_back.svg'

import SelectBoxWrap from '../component/select'
import SuccessPopup from './charge-success-popup'

import _ from 'lodash'
import Api from 'context/api'
import Utility from 'components/lib/utility'
import Message from 'pages/common/message'
import qs from 'query-string'
import { stringify } from 'querystring'

const list = [
  { value: 1, text: '주민번호' },
  { value: 2, text: '핸드폰번호' }
]
const chargeData = [
  { id: 0, type: '신용카드 결제', fetch: 'pay_card' },
  { id: 1, type: '휴대폰 결제', fetch: 'pay_phone' },
  { id: 2, type: '무통장 입금(계좌이체)', fetch: 'pay_virtual' },
  { id: 3, type: '페이레터', fetch: 'pay_letter' }
]
let payType = ''
// let paymentPriceAddVat = 0
export default props => {
  const context = useContext(Context)

  const formTag = useRef()

  const [payMathod, setPayMathod] = useState(-1)
  const [status, setStatus] = useState('n')
  const [receipt, setReceipt] = useState(1)
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [receiptInput, setReceiptInput] = useState('')
  const [confirm, setConfirm] = useState(false)
  const [confirmData, setConfirmData] = useState(false)
  const [validation, setValidation] = useState(false)

  const { webview } = qs.parse(location.search)

  let paymentName = '달 10'
  let paymentPrice = 1100
  let payItemNo = 'A1817'
  let pageCode = '2'

  if (props.location.state) {
    paymentName = props.location.state.paymentName
    paymentPrice = props.location.state.paymentPrice
    payItemNo = props.location.state.itemNo
    pageCode = '1'
  } else if (webview === 'new') {
    const { name, price, itemNo } = qs.parse(location.search)
    paymentName = name
    paymentPrice = price
    payItemNo = itemNo
    pageCode = '2'
  }
  // const paymentPriceAddVat = paymentPrice / 10 + paymentPrice
  const paymentPriceAddVat = paymentPrice

  const handleEvent = value => {
    setReceipt(value)
  }

  const handleChange = event => {
    const target = event.target

    switch (target.name) {
      case 'name':
        setName(target.value)
        break
      case 'phone':
        setPhone(target.value.replace('-', ''))
        break
      case 'receipt':
        setReceiptInput(target.value.replace('-', ''))
        break
      default:
        break
    }
  }

  const chargeClick = async () => {
    const rgEx = /(01[0123456789])(\d{4}|\d{3})\d{4}$/g

    if (status !== 'n') {
      if (status == 'i') {
        if (receipt === 1) {
          if (receiptInput == '')
            return context.action.alert({
              msg: '현금영수증 발급을 위하여 \n 주민번호를 입력해주세요.'
            })
        } else {
          if (receiptInput == '')
            return context.action.alert({
              msg: '현금영수증 발급을 위하여 \n 휴대폰번호를 입력해주세요.'
            })
          if (!rgEx.test(receiptInput))
            return context.action.alert({
              msg: '현금영수증 발급을 위한 \n 휴대폰번호가 올바르지 않습니다.'
            })
        }
      }

      if (status == 'b') {
        if (receiptInput == '')
          return context.action.alert({
            msg: '현금영수증 발급을 위하여 \n 사업자번호를 입력해주세요.'
          })
      }
    } else {
      if (!name) {
        context.action.alert({
          msg: '이름은 필수입력 값입니다.'
        })
        return
      }
      if (!phone) {
        context.action.alert({
          msg: '핸드폰 번호는 필수입력 값입니다.'
        })
        return
      }
      if (!rgEx.test(phone)) {
        return context.action.alert({
          msg: '올바른 핸드폰 번호가 아닙니다.'
        })
      }
    }

    if (name && phone && receipt) {
      const res = await Api.pay_coocon({
        data: {
          Prdtnm: paymentName,
          Prdtprice: paymentPrice,
          rcptNm: name,
          phoneNo: phone,
          itemNo: payItemNo,
          receiptCode: status,
          receiptPhone: status === 'i' && receipt === 2 ? receiptInput : '',
          receiptSocial: status === 'i' && receipt === 1 ? receiptInput : '',
          receiptBiz: status === 'b' ? receiptInput : ''
        }
      })

      if (res.result === 'success') {
        props.history.push({
          pathname:
            location.pathname === '/charge_test'
              ? '/charge_test/waitPayment'
              : '/charge/waitPayment',
          state: {
            ...res.data,
            pageCode: pageCode
          }
        })
      } else {
        context.action.alert({
          msg: res.message
        })
      }
    }
  }

  async function payFetch(event) {
    payType = chargeData[payMathod].fetch
    const obj = {
      data: {
        Prdtnm: paymentName,
        Prdtprice: paymentPrice,
        itemNo: payItemNo,
        pageCode: pageCode,
        pgCode: 'cashbee'
      }
    }
    const res = await Api[payType]({ ...obj })

    if (res.result == 'success' && _.hasIn(res, 'data')) {
      if (res.data.hasOwnProperty('mobileUrl'))
        return (window.location.href = res.data.mobileUrl)

      const { current } = formTag
      let ft = current

      const makeHiddenInput = (key, value) => {
        const input = document.createElement('input')
        input.setAttribute('type', 'hidden')
        input.setAttribute('name', key)
        input.setAttribute('id', key)
        input.setAttribute('value', value)
        return input
      }

      Object.keys(res.data).forEach(key => {
        ft.append(makeHiddenInput(key, res.data[key]))
      })

      MCASH_PAYMENT(ft)
      ft.innerHTML = ''
    } else {
      context.action.alert({
        msg: res.message
      })
    }
  }

  const tempFunc = () => {
    if (status === 'n') {
      return <div></div>
    } else if (status === 'i') {
      return (
        <div className="receipt__sub">
          <label className="receipt__label">
            <SelectBoxWrap
              boxList={list}
              onChangeEvent={handleEvent}
              inlineStyling={{ fontSize: '14px', minWidth: '105px' }}
            />
          </label>
          <input
            className="receipt__input"
            type="tel"
            name="receipt"
            value={receiptInput}
            onChange={handleChange}
          />
        </div>
      )
    } else {
      return (
        <div className="receipt__sub">
          <label className="receipt__label">사업자 번호</label>
          <input
            className="receipt__input"
            name="receipt"
            value={receiptInput}
            onChange={handleChange}
          />
        </div>
      )
    }
  }

  const validationCheck = () => {
    if (name === null || name === '') {
      setValidation(false)
      return
    }

    if (phone === null || phone === '' || phone.toString().length < 9) {
      setValidation(false)
      return
    }

    if (status !== 'n') {
      if (receiptInput === '') {
        setValidation(false)
        return
      }
    }

    if (status === 'i') {
      if (receipt === 1 && (receiptInput.length < 13 || receiptInput === '')) {
        setValidation(false)
        return
      }
      if (receipt === 2 && (receiptInput.length < 8 || receiptInput === '')) {
        setValidation(false)
        return
      }
    }

    if (status === 'b') {
      if (receiptInput.length < 10) {
        setValidation(false)
        return
      }
    }

    setValidation(true)
  }

  useEffect(() => {
    validationCheck()
  }, [name, phone, status, receiptInput])

  useEffect(() => {}, [])

  return (
    <div className={`${webview === 'new' && 'webview'}`}>
      <form
        ref={formTag}
        name="payForm"
        acceptCharset="euc-kr"
        id="payForm"
      ></form>
      {confirm ? (
        <SuccessPopup detail={confirmData} />
      ) : (
        <>
          <div className="header">
            <img
              className="header__button--back"
              src={BackBtn}
              onClick={() => props.history.goBack()}
            />
            <h1 className="header__title">달 충전하기 TEST</h1>
          </div>

          <div className="content">
            <div className="buyList">
              <h2 className="charge__title">구매 내역</h2>

              <div className="buyList__box">
                <div className="buyList__label">결제상품</div>
                <div className="buyList__value">{paymentName}</div>
                <div className="buyList__label">결제금액</div>
                <div className="buyList__value">
                  <span className="buyList__value--point">
                    {Utility.addComma(paymentPrice)}
                  </span>{' '}
                  원
                </div>
              </div>
            </div>

            <div className="payMathod">
              <h2 className="charge__title">결제 수단</h2>

              <div className="payMathod__box">
                {chargeData.map((item, index) => {
                  return (
                    <button
                      key={index}
                      className={`payMathod__button ${
                        payMathod === item.id ? 'payMathod__button--forced' : ''
                      }`}
                      onClick={() => setPayMathod(item.id)}
                    >
                      {item.type}
                    </button>
                  )
                })}
              </div>
            </div>
            {payMathod === 2 && (
              <React.Fragment>
                <div className="depositInfo">
                  <h2 className="charge__title">무통장 입금 정보</h2>

                  <div className="depositInfo__box">
                    <div className="depositInfo__label">입금정보</div>
                    <div className="depositInfo__value">
                      <span className="depositInfo__value--point">
                        {Utility.addComma(paymentPriceAddVat)} 원
                      </span>{' '}
                      (부가세 포함)
                    </div>

                    <div className="depositInfo__label">입금은행</div>
                    <div className="depositInfo__value">국민은행</div>

                    <div className="depositInfo__label">입금자명</div>
                    <div className="depositInfo__value">
                      <input
                        type="text"
                        name="name"
                        value={name}
                        onChange={handleChange}
                        className="depositInfo__input"
                      ></input>
                    </div>

                    <div className="depositInfo__label">휴대폰번호</div>
                    <div className="depositInfo__value">
                      <input
                        type="tel"
                        name="phone"
                        value={phone}
                        onChange={handleChange}
                        maxLength={11}
                        className="depositInfo__input"
                      ></input>
                    </div>
                  </div>
                </div>

                <div className="receipt">
                  <h2 className="charge__title">현금영수증</h2>

                  <div
                    className={`receipt__box ${status === 'n' &&
                      'receipt__button--forced'}`}
                  >
                    <button
                      className={`receipt__button ${status === 'n' &&
                        'receipt__button--forced'}`}
                      onClick={() => setStatus('n')}
                    >
                      선택안함
                    </button>
                    <button
                      className={`receipt__button ${status === 'i' &&
                        'receipt__button--forced'}`}
                      onClick={() => setStatus('i')}
                    >
                      소득공제용
                    </button>
                    <button
                      className={`receipt__button ${status === 'b' &&
                        'receipt__button--forced'}`}
                      onClick={() => setStatus('b')}
                    >
                      지출증빙용
                    </button>
                  </div>

                  {tempFunc()}
                </div>
              </React.Fragment>
            )}

            <div className="notice">
              <p className="notice__title">
                <span className="notice__title--icon">!</span> 달 충전 안내
              </p>

              <ul>
                <li className="notice__text">
                  ∙ 충전한 달의 유효기간은 구매일로부터 5년입니다.
                </li>
                <li className="notice__text">
                  ∙ 달 보유/구매/선물 내역은 내지갑에서 확인할 수 있습니다.
                </li>
                <li className="notice__text">
                  ∙ 미성년자가 결제할 경우 법정대리인이 동의하지 아니하면 본인
                  또는 법정대리인은 계약을 취소할 수 있습니다.
                </li>
                <li className="notice__text">
                  ∙ 사용하지 아니한 달은 7일 이내에 청약철회 등 환불을 할 수
                  있습니다.
                </li>
              </ul>
            </div>

            <div className="inquiry">
              <span className="inquriy__title">결제 문의</span>
              <span className="inquiry__number">1522-0251</span>
            </div>
            {payMathod === 2 ? (
              <button
                className={`chargeButton ${
                  validation === true ? 'chargeButton--active' : ''
                }`}
                onClick={chargeClick}
              >
                입금계좌 받기
              </button>
            ) : (
              <button
                className={`chargeButton ${payMathod != -1 &&
                  'chargeButton--active'}`}
                onClick={payFetch}
              >
                충전하기
              </button>
            )}
          </div>
          <Message />
        </>
      )}
    </div>
  )
}
