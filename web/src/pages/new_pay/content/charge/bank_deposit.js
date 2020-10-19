/**
 * @route /pay/bank
 * @file /pay/content/charge/bank_deposit.js
 * @brief 무통장 입금(계좌이체) 신청 페이지
 */

import React, {useEffect, useContext, useState, useRef} from 'react'
import styled from 'styled-components'
import {useHistory, useLocation} from 'react-router-dom'

//context
import {Context} from 'context'
import {COLOR_MAIN} from 'context/color'
import Api from 'context/api'
import qs from 'query-string'

//layout
import Header from 'components/ui/new_header'

//static
import icoNotice from '../../static/ic_notice.svg'
import icoDown from '../../static/arrow_down_g.svg'

export default () => {
  const location = useLocation()
  const history = useHistory()
  const {prdtNm, prdtPrice, itemNo, webview, event, itemAmt} = location.state
  const context = useContext(Context)

  //state
  //현금영수증 코드 (n: 안함, i : 소득공제, b: 지출증빙)
  const [receiptCode, setReceiptCode] = useState('n')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [iValType, setIvalType] = useState('social')
  const [receiptPhone, setReceiptPhone] = useState('')
  const [receiptSocial, setReceiptSocial] = useState('')
  const [receiptBiz, setReceiptBiz] = useState('')

  const iValTypeHandle = (e) => {
    setIvalType(e.target.value)
  }

  const clickDepositButton = () => {
    const rgEx = /(01[0123456789])(\d{4}|\d{3})\d{4}$/g
    if (name.length < 2) {
      return context.action.alert({
        msg: `이름은 필수입력 값입니다.`
      })
    }
    if (!phone) {
      return context.action.alert({
        msg: `핸드폰 번호는 필수입력 값입니다.`
      })
    }
    if (!rgEx.test(phone)) {
      return context.action.alert({
        msg: `올바른 핸드폰 번호가 아닙니다.`
      })
    }
    if (receiptCode === 'i' && iValType === 'social' && receiptSocial.length < 13) {
      return context.action.alert({
        msg: `현금영수증 발급을 위하여 \n 주민번호를 입력해주세요.`
      })
    }
    if (receiptCode === 'i' && iValType === 'phone' && !receiptPhone) {
      return context.action.alert({
        msg: `현금영수증 발급을 위하여 \n 휴대폰번호를 입력해주세요.`
      })
    }
    if (receiptCode === 'b' && receiptBiz.length < 10) {
      return context.action.alert({
        msg: `현금영수증 발급을 위하여 \n 사업자번호를 입력해주세요.`
      })
    }
    getDepositInfo()
  }

  const getDepositInfo = async () => {
    const {result, data, message} = await Api.pay_coocon({
      data: {
        Prdtnm: prdtNm,
        Prdtprice: prdtPrice,
        rcptNm: name,
        phoneNo: phone,
        itemNo: itemNo,
        itemAmt: itemAmt,
        receiptCode: receiptCode,
        receiptPhone: receiptPhone,
        receiptSocial: receiptSocial,
        receiptBiz: receiptBiz
      }
    })

    if (result === 'success') {
      history.push({
        pathname: '/pay/bank_wait',
        state: {
          itemPrice: data.Prdtprice,
          name: data.rcptNm,
          bankNo: data.accountNo,
          phone: data.phoneNo,
          webview: webview,
          event: event
        }
      })
    } else {
      context.action.alert({
        msg: message
      })
    }
  }

  const inputHandle = (e) => {
    const {name, value} = e.target
    const nmValue = value.replace(/[^0-9]/g, '')
    switch (name) {
      case 'name':
        setName(value)
        break
      case 'phone':
        if (value.toString().length < 15) setPhone(nmValue)
        break
      case 'receiptSocial':
        if (value.toString().length < 14) setReceiptSocial(nmValue)
        break
      case 'receiptPhone':
        if (value.toString().length < 15) setReceiptPhone(nmValue)
        break
      case 'receiptBiz':
        if (value.toString().length < 11) setReceiptBiz(nmValue)
        break

      default:
        break
    }
  }

  useEffect(() => {
    setReceiptSocial('')
    setReceiptPhone('')
    setReceiptBiz('')
  }, [receiptCode, iValType])

  return (
    <>
      {webview !== 'new' && <Header title="무통장 입금(계좌이체)" />}
      <Content className={webview ? 'new' : ''}>
        <div className="input-wrap">
          <label>입금금액</label>
          <p>
            {Number(prdtPrice).toLocaleString()}원<span>(부가세포함)</span>
          </p>
        </div>
        <div className="input-wrap">
          <label>입금은행</label>
          <p>국민은행</p>
        </div>
        <div className="input-wrap">
          <label>입금자명</label>
          <input type="text" id="name" name="name" value={name} onChange={inputHandle} placeholder="입금자명을 입력해주세요" />
        </div>
        <div className="input-wrap">
          <label>휴대폰 번호</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={phone}
            onChange={inputHandle}
            placeholder="휴대폰 번호를 입력해주세요"
          />
        </div>

        <h5 className="sub-title">현금영수증</h5>
        <div className="receipt-btn-wrap">
          <button className={receiptCode === 'n' ? 'on' : ''} onClick={() => setReceiptCode('n')}>
            신청안함
          </button>
          <button className={receiptCode === 'i' ? 'on' : ''} onClick={() => setReceiptCode('i')}>
            소득공제용
          </button>
          <button className={receiptCode === 'b' ? 'on' : ''} onClick={() => setReceiptCode('b')}>
            지출증빙용
          </button>
        </div>

        <div className="receipt">
          {receiptCode === 'i' && (
            <div className="item">
              <select onChange={iValTypeHandle}>
                <option value="social">주민번호</option>
                <option value="phone">휴대폰번호</option>
              </select>
              {iValType === 'social' && (
                <input type="tel" id={iValType} name="receiptSocial" value={receiptSocial} onChange={inputHandle} />
              )}
              {iValType === 'phone' && (
                <input type="tel" id={iValType} name="receiptPhone" value={receiptPhone} onChange={inputHandle} />
              )}
            </div>
          )}
          {receiptCode === 'b' && (
            <div className="item">
              <label htmlFor="receiptBiz">사업자번호</label>
              <input type="tel" id="receiptBiz" name="receiptBiz" value={receiptBiz} onChange={inputHandle} />
            </div>
          )}
        </div>

        <div className="btn-wrap">
          <button onClick={clickDepositButton}>입금계좌 받기</button>
        </div>

        <div className="info-wrap">
          <h5>
            달 충전 안내
            <span>
              <strong>결제 문의</strong>1522-0251
            </span>
          </h5>
          <p>충전한 달의 유효기간은 구매일로부터 5년입니다.</p>
          <p>달 보유/구매/선물 내역은 내지갑에서 확인할 수 있습니다.</p>
          <p>미성년자가 결제할 경우 법정대리인이 동의하지 아니하면 본인 또는 법정대리인은 계약을 취소할 수 있습니다.</p>
          <p>사용하지 아니한 달은 7일 이내에 청약철회 등 환불을 할 수 있습니다.</p>
        </div>
      </Content>
    </>
  )
}
const Content = styled.div`
  .input-wrap {
    position: relative;
    margin-top: 4px;
    label {
      display: block;
      position: absolute;
      left: 15px;
      top: 15px;
      font-size: 12px;
      color: #000;
      z-index: 1;
    }
    input {
      width: 100%;
      height: 44px;
      padding: 0 10px 0 92px;
      background: #fff;
      border: 1px solid #e0e0e0;
      border-radius: 12px;
      font-weight: bold;
      color: #000;
    }
    input:focus {
      border: 1px solid #000;
    }
    input::placeholder {
      font-size: 14px;
      color: #bdbdbd;
    }
    p {
      width: 100%;
      height: 44px;
      line-height: 42px;
      padding: 0 10px 0 92px;
      background: #fff;
      border: 1px solid #e0e0e0;
      border-radius: 12px;
      font-size: 16px;
      font-weight: bold;
      color: #000;
      span {
        font-weight: normal;
      }
    }
  }
  .receipt {
    padding-top: 8px;
    .item {
      display: flex;

      select {
        width: 32.8%;
        height: 44px;
        border-radius: 12px;
        background: #fff url(${icoDown}) no-repeat right 6px center;
        border: 1px solid #e0e0e0;
        text-indent: 8px;
        color: #000;
        font-size: 14px;
      }

      label {
        display: inline-block;
        width: 32.8%;
        border-radius: 12px;
        border: 1px solid #e0e0e0;
        text-indent: 8px;
        background: #fff;
        line-height: 42px;
        color: #000;
        font-size: 14px;
      }

      input {
        width: 65.7%;
        margin-left: auto;
        height: 44px;
        padding: 0 12px;
        color: #000;
        font-size: 16px;
        font-weight: bold;
        border-radius: 12px;
        background: #fff;
        border: 1px solid #e0e0e0;
      }
    }
  }

  min-height: calc(100vh - 40px);
  padding: 6px 16px;
  background: #eeeeee;
  padding-bottom: 30px;
  &.new {
    min-height: 100%;
  }

  .sub-title {
    padding-top: 15px;
    font-size: 16px;
    font-weight: 900;
    color: #000;
  }

  .receipt-btn-wrap {
    display: flex;
    padding-top: 8px;
    button {
      position: relative;
      width: 33.7%;
      height: 44px;
      margin-left: -1px;
      border: 1px solid #e0e0e0;
      background: #f5f5f5;
      font-size: 14px;
      color: #bdbdbd;
      font-weight: bold;
    }
    button:first-child {
      margin-left: 0;
      border-top-left-radius: 12px;
      border-bottom-left-radius: 12px;
    }
    button:last-child {
      border-top-right-radius: 12px;
      border-bottom-right-radius: 12px;
    }
    button.on {
      border: 1px solid #632beb;
      color: #632beb;
      background: #fff;
      z-index: 2;
    }
  }

  .btn-wrap {
    padding-top: 32px;
    button {
      width: 100%;
      height: 44px;
      border-radius: 12px;
      color: #fff;
      font-size: 18px;
      font-weight: bold;
      background: #632beb;
    }
    button:disabled {
      background: #757575;
    }
  }

  .info-wrap {
    margin-top: 22px;
    h5 {
      display: flex;
      margin-bottom: 8px;
      padding-left: 16px;
      background: url(${icoNotice}) no-repeat left center;
      color: #424242;
      font-size: 12px;
      font-weight: bold;
      span {
        display: inline-block;
        margin-left: auto;
        color: ${COLOR_MAIN};
        font-weight: 800;
        strong {
          padding-right: 4px;
          color: #000;
        }
      }
    }
    p {
      position: relative;
      padding-left: 16px;
      color: #757575;
      font-size: 12px;
      line-height: 20px;
      &::before {
        position: absolute;
        left: 6px;
        top: 9px;
        width: 2px;
        height: 2px;
        background: #757575;
        content: '';
      }
    }
  }
`
