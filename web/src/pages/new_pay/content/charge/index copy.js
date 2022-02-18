/**
 * @route /pay/charge
 * @file /pay/content/charge/index
 * @brief 달 충전 페이지에서 충전 아이템 클릭 후 결제하기로 넘어갔을때 나오는 결제 페이지
 *        무통장 입금 - coocoon (로컬에서 테스트 가능)
 *        모빌리언스 - 카드, 휴대폰, 문화상품권, 해피머니 (dev2에서 테스트 가능)
 *        페이레터 - 카카오페이, 페이코, 티머니, 캐시비  (dev-스테이지서버 에서만 테스트 가능)
 * @date_20200728 스마트문상, 도서문화상품권 숨김처리
 */

import React, { useContext, useEffect, useRef, useState, useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import moment from 'moment'

//context
import { Context } from 'context'
import { OS_TYPE } from 'context/config.js'
import { COLOR_MAIN } from 'context/color'
import Api from 'context/api'
import qs from 'query-string'
import Utility from 'components/lib/utility'
//layout
import Header from 'components/ui/new_header'
import BankTimePopup from './bank_time_pop'
import LayerPopupWrap from '../../../main/component/layer_popup_wrap.js'

//static
import icoNotice from '../../static/ic_notice.svg'
import icoMore from '../../static/icn_more_xs_gr.svg'
import { Hybrid } from "context/hybrid";

const icoPlus = 'https://image.dalbitlive.com/svg/ico_add.svg'
const icoMinus = 'https://image.dalbitlive.com/svg/ico_minus.svg'

//방송방 내 결제에서는 헤더 보이지 않기, 취소 처리 등 다름

export default (props) => {
  const history = useHistory()

  //context
  const context = useContext(Context)
  const customHeader = JSON.parse(Api.customHeader)
  //state
  const [selectedPay, setSelectedPay] = useState({ type: '', fetch: '' })
  const [moreState, setMoreState] = useState(false)
  const [bankPop, setBankPop] = useState(false)
  const [popupData, setPopupData] = useState([])
  //ref
  const formTag = useRef(null)

  //결제 data 셋팅
  const { name, price, itemNo, webview, event } = qs.parse(location.search)
  const dalVal = Number(name.split(" ")[1]);

  const [totalQuantity, setTotalQuantity] = useState(1)
  const [totalPrice, setTOtalPrice] = useState(price)
  let bankFormData = {
    prdtNm: name,
    prdtPrice: totalPrice * totalQuantity,
    itemNo: itemNo,
    webview: webview,
    event: event,
    itemAmt: totalQuantity
  }

  let pageCode = webview === 'new' ? '2' : '1'
  if (event === '3') pageCode = '3'
  let payMethod

  // if (__NODE_ENV === 'dev' || context.token.memNo === '51594275686446') {
  payMethod = [
    { type: '계좌 간편결제', fetch: 'pay_simple', code: 'simple' },
    { type: '무통장 입금(계좌이체)', code: 'coocon' },
    { type: '카드 결제', fetch: 'pay_card' },
    { type: '휴대폰 결제', fetch: 'pay_phone' },
    { type: '카카오페이(머니)', fetch: 'pay_km', code: 'kakaomoney' },
    { type: '카카오페이(카드)', fetch: 'pay_letter', code: 'kakaopay' },
    { type: '페이코', fetch: 'pay_letter', code: 'payco' },
    { type: '문화상품권', fetch: 'pay_gm' },
    { type: '티머니/캐시비', fetch: 'pay_letter', code: 'tmoney' },
    { type: '해피머니상품권', fetch: 'pay_hm' }
    // {type: '캐시비', fetch: 'pay_letter', code: 'cashbee'},
    // { type: "스마트문상(게임문화상품권)", fetch: 'pay_gg' },
    // { type: "도서문화상품권", fetch: 'pay_gc' },
  ]
  // }

  async function payFetch(ciData) {
    const { type, fetch, code } = selectedPay

    // if (type === '카카오페이' || type === '페이코') {
    //   return context.action.alert({
    //     msg: `결제대행사 장애가 발생하여 일시적으로 결제가 불가능합니다.
    //     잠시 다른 결제수단을 이용 부탁드립니다.`
    //   })
    // }

    if (customHeader['os'] === OS_TYPE['Android'] && customHeader['appBuild'] < 20 && fetch === 'pay_letter') {
      return context.action.confirm({
        msg: `해당 결제수단은 앱 업데이트 후 이용 가능합니다. 업데이트 받으시겠습니까?`,
        callback: () => {
          window.location.href = 'market://details?id=kr.co.inforexseoul.radioproject'
        }
      })
    }

    if (code === 'coocon') {
      let hour = new Date().getHours()
      let min = new Date().getMinutes()
      let sec = new Date().getSeconds()
      if (hour < 10) {
        hour = '0' + hour
      }
      if (min < 10) {
        min = '0' + min
      }
      if (sec < 10) {
        sec = '0' + sec
      }

      const time = String(hour) + String(min) + String(sec)

      if ((time >= '000000' && time <= '001000') || (time >= '235000' && time <= '235959')) {
        bankFormData = {
          prdtNm: name,
          prdtPrice: totalPrice * totalQuantity,
          itemNo: itemNo,
          webview: webview,
          event: event,
          itemAmt: totalQuantity
        }
        return setBankPop(true)
      } else {
        return history.push({
          pathname: '/pay/bank',
          state: {
            prdtNm: name,
            prdtPrice: totalPrice * totalQuantity,
            itemNo: itemNo,
            webview: webview,
            event: event,
            itemAmt: totalQuantity
          }
        })
      }
    }

    const { result, data, message } = await Api[fetch]({
      data: {
        Prdtnm: name,
        Prdtprice: totalPrice * totalQuantity,
        itemNo: itemNo,
        pageCode: pageCode,
        pgCode: code,
        itemAmt: totalQuantity,
        ci: ciData,
      }
    })
    // console.log(name, totalPrice * totalQuantity, itemNo, pageCode, code, totalQuantity)

    if (result === 'success') {
      sessionStorage.setItem('buy_item_data', totalPrice * totalQuantity);

      if (data.hasOwnProperty('mobileUrl') || data.hasOwnProperty('url')) {
        return (window.location.href = data.mobileUrl ? data.mobileUrl : data.url);
      } else if (data.hasOwnProperty('next_redirect_mobile_url')) {
        return (window.location.href = data.next_redirect_mobile_url)
      }

      let payForm = formTag.current
      const makeHiddenInput = (key, value) => {
        const input = document.createElement('input')
        input.setAttribute('type', 'hidden')
        input.setAttribute('name', key)
        input.setAttribute('id', key)
        input.setAttribute('value', value)
        return input
      }
      Object.keys(data).forEach((key) => {
        payForm.append(makeHiddenInput(key, data[key]))
      })
      MCASH_PAYMENT(payForm)
      payForm.innerHTML = ''
    } else {
      context.action.alert({
        msg: message
      })
    }
  }

  async function fetchMainPopupData(arg) {
    const res = await Api.getBanner({
      params: {
        position: arg
      }
    })
    const { result, data, message } = res
    if (result === 'success') {
      if (data) {
        // 딤 팝업
        setPopupData(
          data.filter((v) => {
            if (Utility.getCookie('popup_notice_' + `${v.idx}`) === undefined) {
              return v
            } else {
              return false
            }
          })
        )
      }
    } else {
      context.action.alert({
        msg: message,
        callback: () => {
          context.action.alert({ visible: false })
        }
      })
    }
  }

  const bonusDal = useMemo(() => {
    if(Number(price) * totalQuantity >= 1100000) {
      return Math.floor(dalVal * totalQuantity * 0.05);
    }
    return null;
    /*if ((Number(price) * totalQuantity) > 100000) {
      return Math.floor(dalVal * totalQuantity * 0.1);
    } else if ((Number(price) * totalQuantity) > 30000) {
      return Math.floor(dalVal * totalQuantity * 0.05);
    } else {
      return null;
    }*/

  }, [price, totalQuantity, (Number(price) * totalQuantity)])

  const isBonusDalYn = useMemo(() => {
    return Number(price) * totalQuantity >= 1100000;
    /*if ((Number(price) * totalQuantity) > 30000) {
      return true;
    } else {
      return false;
    }*/
  }, [price, totalQuantity, (Number(price) * totalQuantity)])

  const makeDisabled = (type) => {
    switch (type) {
      case '페이코':
        if (Number(totalPrice) * totalQuantity > 100000) return true
      case '티머니':
        if (Number(totalPrice) * totalQuantity > 500000) return true
      case '캐시비':
        if (Number(totalPrice) * totalQuantity > 500000) return true
      case '휴대폰 결제':
        if (Number(totalPrice) * totalQuantity > 1000000) return true
      default:
        return false
        break
    }
  }

  const createMethodBtn = (type) => {
    let currentPayMethod = []
    if (type === 'more') {
      currentPayMethod = payMethod.slice(3)
    } else {
      currentPayMethod = payMethod.slice(0, 3)
    }
    return payMethod.map((item, idx) => {
      const { type } = item
      const disabledState = makeDisabled(type)
      return (
        <button
          key={idx}
          className={type === selectedPay.type ? 'on' : ''}
          onClick={() => setSelectedPay(item)}
          disabled={disabledState}>
          {type}
        </button>
      )
    })
  }

  const quantityCalc = (type) => {
    if (type === 'plus') {
      if (totalQuantity === 10) {
        return context.action.toast({ msg: '최대 10개까지 구매 가능합니다.' })
      }
      setTotalQuantity(totalQuantity + 1)
    } else if (type === 'minus') {
      if (totalQuantity === 1) {
        return context.action.toast({ msg: '최소 1개부터 구매 가능합니다.' })
      }
      setTotalQuantity(totalQuantity - 1)
    }
  }

  const phoneCallWrap = () => {
    if (customHeader.os === OS_TYPE['Android']) {
      return (
        <span
          onClick={() => {
            Hybrid('openCall', `tel:1522-0251`)
          }}>
          1522-0251
        </span>
      )
    } else if (customHeader.os === OS_TYPE['IOS']) {
      return (
        <span
          onClick={() => {
            Hybrid('openUrl', `tel:1522-0251`)
          }}>
          1522-0251
        </span>
      )
    } else {
      return (
        <span
          onClick={() => {
            window.location.href = `tel:1522-0251`
          }}>
          1522-0251
        </span>
      )
    }
  }

  const setPopupCookie = () => {
    const exdate = new Date();
    exdate.setDate(exdate.getDate() + 1);
    exdate.setHours(0);
    exdate.setMinutes(0);
    exdate.setSeconds(0);

    const encodedValue = encodeURIComponent("y");
    const c_value = encodedValue + "; expires=" + exdate.toUTCString();
    document.cookie =
      "simpleCheck" +
      "=" +
      c_value +
      "; path=/; secure; domain=.dalbitlive.com";
  };

  const simplePayCheck = () => {
    async function fetchSelfAuth() {
      const res = await Api.self_auth_check({})
      if (res.result === 'success') {
        const ciValue = res.data.ci;
        if (ciValue === null || ciValue === false || ciValue === "testuser" || ciValue === "admin" || ciValue.length < 10) {
          history.push(`/selfauth?event=/store`)
        } else {
          if (Utility.getCookie("simpleCheck") === "y" || res.data.isSimplePay) {
            payFetch(res.data.ci);
          } else {
            context.action.alert({
              msg:
                `
              <div style="font-size: 16px; text-align: left;">
            ★ 필수 : 인증 정보를 확인해 주세요.
            ---------------------------------------------
            회원 이름 : <span style='color: #632beb; font-weight: bold;'>${res.data.memName}</span>
            연락처 : <span style='color: #632beb; font-weight: bold;'>${res.data.phoneNo.replace(
                  /(\d{3})(\d{4})(\d{4})/,
                  "$1-$2-$3"
                )}</span>
            ---------------------------------------------
            - 안전한 계좌 정보 등록을 위해
              한 번 더 본인인증을 해주셔야 합니다.
            - (중요) 추가 인증 시에는 반드시
              위의 회원정보와 일치해야 합니다.
              ※ 추가 인증은 딱 1회만 진행됩니다.
              </div>
            `
              ,
              callback: () => {
                setPopupCookie();
                payFetch(res.data.ci);
              }
            })
          }
        }
      } else {
        history.push(`/selfauth?event=/store`)
      }
    }
    fetchSelfAuth()
  }

  useEffect(() => {
    if (selectedPay.code === "simple") {
      simplePayCheck();
    } else {
      if (selectedPay.type) payFetch()
    }
  }, [selectedPay])

  useEffect(() => {
    fetchMainPopupData(12)
  }, [])

  return (
    <>
      {webview !== 'new' && <Header title="달 충전" />}
      <Content className={webview}>
        <h2>구매 내역</h2>
        <div className="field">
          <label>결제상품</label>
          <p>
            <img src="https://image.dalbitlive.com/svg/moon_yellow_s.svg" alt="달 아이콘" className="dalIcon" />
            {dalVal}
          </p>
        </div>

        {isBonusDalYn && (
          <div className="field">
            <label>추가지급</label>
            <p>
              <img src="https://image.dalbitlive.com/svg/moon_yellow_s.svg" alt="달 아이콘" className="dalIcon" />{bonusDal}
            </p>
          </div>
        )}

        <div className="field">
          <label>상품수량</label>
          <p className="quantity">
            <button className="minus" onClick={() => quantityCalc('minus')}>
              -
            </button>
            <span>{totalQuantity}</span>
            <button className="plus" onClick={() => quantityCalc('plus')}>
              +
            </button>
          </p>
        </div>

        <div className="field">
          <label>결제금액</label>
          <p>
            <strong>{(Number(totalPrice) * totalQuantity).toLocaleString()} 원</strong>
          </p>
        </div>

        <h2 className="more-tab">
          결제 수단
          {/* <button
            onClick={() => {
              setMoreState(!moreState)
            }}>
            {moreState ? '결제수단 간략 보기' : '결제수단 전체 보기'}
          </button> */}
        </h2>
        <div className="select-item">{createMethodBtn()}</div>
        {/* <div className="more-wrap">
          <div className={`select-item more ${moreState}`}>{createMethodBtn('more')}</div>
          <div className={`select-item more true`}>{createMethodBtn('more')}</div>
        </div> */}

        <div className="info-wrap">
          <h5>
            달 충전 안내
            <span>
              <strong>결제 문의</strong>{phoneCallWrap()}
            </span>
          </h5>
          <p>충전한 달의 유효기간은 구매일로부터 5년입니다.</p>
          <p>달 보유/구매/선물 내역은 내지갑에서 확인할 수 있습니다.</p>
          <p>미성년자가 결제할 경우 법정대리인이 동의하지 아니하면 본인 또는 법정대리인은 계약을 취소할 수 있습니다.</p>
          <p>사용하지 아니한 달은 7일 이내에 청약철회 등 환불을 할 수 있습니다.</p>
          <p>깐부 게임에 참여중인 회원은 1만원 이상 달 구매 시 받은 구슬을 사용했을 경우 달 환불이 불가합니다.</p>
        </div>

        <form ref={formTag} name="payForm" acceptCharset="euc-kr" id="payForm"></form>
        {bankPop && <BankTimePopup setBankPop={setBankPop} bankFormData={bankFormData} />}
        {popupData.length > 0 && <LayerPopupWrap data={popupData} setData={setPopupData} />}
      </Content>
    </>
  )
}

const Content = styled.div`
  min-height: calc(100vh - 40px);
  padding: 0 16px;
  background: #eeeeee;
  padding-bottom: 30px;
  &.new {
    min-height: 100%;
  }

  h2 {
    padding: 15px 0 4px 0;
    font-size: 16px;
    font-weight: 600;
    color: #000;

    &.more-tab {
      display: flex;
      margin: 2px 0 4px 0;

      button {
        margin-left: auto;
        font-size: 12px;
        line-height: 20px;
        color: rgb(66, 66, 66);
        border-bottom: 1px solid rgb(66, 66, 66);
        &:after {
          display: inline-block;
          width: 6px;
          height: 16px;
          margin-top: 2px;
          margin-left: 3px;
          background: url(${icoMore}) no-repeat center;
          vertical-align: top;
          content: '';
        }
      }
    }
  }

  .field {
    display: flex;
    align-items: center;
    height: 44px;
    margin-top: 4px;
    padding: 0 16px;
    border-radius: 12px;
    border: solid 1px #e0e0e0;
    background-color: #ffffff;

    label {
      font-size: 14px;
      font-weight: bold;
      color: #000;
    }
    p {
      display: flex;
      color: #632beb;
      margin-left: auto;
      font-size: 18px;
      font-weight: bold;
      strong {
        font-size: 18px;
      }
      img {
        margin-top: 2px;
        margin-right: 4px;
      }
      &.quantity {
        span {
          color: #000;
          display: inline-block;
          width: 50px;
          font-size: 18px;
          font-weight: bold;
          text-align: center;
        }
      }
      button {
        width: 24px;
        height: 24px;
        text-indent: -9999px;
        border-radius: 3px;
        &.plus {
          background: #632beb url(${icoPlus}) no-repeat center;
        }
        &.minus {
          background: #632beb url(${icoMinus}) no-repeat center;
        }
      }
    }
  }

  .select-item {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    button {
      display: flex;
      justify-content: center;
      align-items: center;
      width: calc(50% - 2px);
      height: 44px;
      margin-bottom: 4px;
      background: #ffffff;
      border-radius: 12px;
      border: 1px solid #e0e0e0;
      font-size: 14px;
      font-weight: bold;

      &.on {
        border-color: ${COLOR_MAIN};
        color: ${COLOR_MAIN};
      }
      &:disabled {
        color: #9e9e9e;
        background: #f5f5f5;
      }
    }
    
    button:nth-child(1) {
      width: 100%;
    }
    button:nth-child(-n + 2) {
      width: 100%;
    }
    button:nth-child(1) {
      &::after {
        content: '';
        margin-left: 6px;
        width: 15px;
        height: 15px;
        background: url('https://image.dalbitlive.com/mypage/210218/ic_new_item@2x.png') no-repeat center / 15px;
      }
    }
    
    &.more {
      overflow: hidden;
      height: 144px;
      transition: height 0.3s ease-in-out;
    }
    &.more button:nth-child(1) {
      width: calc(50% - 2px);
    }
    &.more.false {
      height: 0px;
    }
    &.more.true {
      height: 144px;
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
