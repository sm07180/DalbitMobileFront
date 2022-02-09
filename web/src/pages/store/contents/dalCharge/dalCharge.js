import React, {useEffect, useState, useContext, useMemo, useRef} from 'react'
import {Context} from "context";

import Api from 'context/api'
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
import {useHistory, useLocation} from "react-router-dom";
import {OS_TYPE} from "context/config";


const paymentList = [
  { type: '계좌 간편결제', fetch: 'pay_simple', code: 'simple' },
  { type: '무통장(계좌이체)', code: 'coocon' },
  { type: '신용/체크카드', fetch: 'pay_card' },
  { type: '휴대폰', fetch: 'pay_phone' },
  { type: '카카오페이(머니)', fetch: 'pay_km', code: 'kakaomoney' },
  { type: '카카오페이(카드)', fetch: 'pay_letter', code: 'kakaopay' },
  { type: '페이코', fetch: 'pay_letter', code: 'payco' },
  { type: '티머니/캐시비', fetch: 'pay_letter', code: 'tmoney' },
  { type: '문화상품권', fetch: 'pay_gm' },
  { type: '해피머니상품권', fetch: 'pay_hm' }
  // {type: '캐시비', fetch: 'pay_letter', code: 'cashbee'},
  // { type: "스마트문상(게임문화상품권)", fetch: 'pay_gg' },
  // { type: "도서문화상품권", fetch: 'pay_gc' },
]

const DalCharge = () => {
  const history = useHistory();
  const context = useContext(Context);
  const location = useLocation();
  const [select, setSelect] = useState(-1);
  const [popSlide, setPopSlide] = useState(false);
  const customHeader = JSON.parse(Api.customHeader)
  const formTag = useRef(null);
  const { itemNm, dal, price, itemNo, webview} =location.state

  const [buyItemInfo, setBuyItemInfo] = useState({
    dal: Number(dal),
    itemNo: itemNo,
    itemPrice : Number(price),
    itemAmount : 1,
  });

  const onSelectMethod = (index, payment) => {
    setSelect(index);

    if (customHeader['os'] === OS_TYPE['Android'] && customHeader['appBuild'] < 20 && fetch === 'pay_letter') {
      return context.action.confirm({
        msg: `해당 결제수단은 앱 업데이트 후 이용 가능합니다. 업데이트 받으시겠습니까?`,
        callback: () => {
          window.location.href = 'market://details?id=kr.co.inforexseoul.radioproject'
        }
      })
    }

    if (payment.code === "simple") {
        simplePay();
    }else if(payment.code === "coocon"){
        cooconPay();
    }else{
        etcPay(payment)
    }
  }

  //계좌 간편결제
  const simplePay = () =>{
    Api.self_auth_check().then((response)=>{
      if(response.result === 'success'){
        const ciValue = response.data.ci;
        if (ciValue === null || ciValue === false || ciValue === "testuser" || ciValue === "admin" || ciValue.length < 10) {
          setPopSlide(!popSlide)
        }else{
          if (Utility.getCookie("simpleCheck") === "y" || response.data.isSimplePay) {

          }else{
          }
        }
      }else{
        setPopSlide(!popSlide)
      }
    });
  }

  //무통장 계좌이체
  const cooconPay = () =>{
    history.push({
      pathname: '/pay/bank',
      state: {
        webview: webview,
        prdtNm: itemNm,
        prdtPrice: price * buyItemInfo.itemAmount,
        itemNo: buyItemInfo.itemNo,
        itemAmt: buyItemInfo.itemAmount
      }
    })
  }

  //기타 결제
  const etcPay = async (payment, ciData) =>{
    const { result, data, message } = await Api[payment.fetch]({
      data: {
        Prdtnm: itemNm,
        Prdtprice: price * buyItemInfo.itemAmount,
        itemNo: itemNo,
        pageCode: webview === 'new' ? '2' : '1',
        pgCode: payment.code,
        itemAmt: buyItemInfo.itemAmount,
        ci:ciData
      }
    })

    if (result === 'success') {
      sessionStorage.setItem('buy_item_data', price * buyItemInfo.itemAmount);

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


  //상품수량 +,-
  const calcBuyItem = (type) => {
    if(type === '+'){
      if (buyItemInfo.itemAmount === 10) return context.action.toast({ msg: '최대 10개까지 구매 가능합니다.' })
      setBuyItemInfo({...buyItemInfo, itemAmount: buyItemInfo.itemAmount+1})
    }else if(type === '-'){
      if (buyItemInfo.itemAmount === 1) return context.action.toast({ msg: '최소 1개까지 구매 가능합니다.' })
      setBuyItemInfo({...buyItemInfo, itemAmount: buyItemInfo.itemAmount-1})}
  }

  //보너스달
  const bonusDal = useMemo(() => {
    if(Number(price) * buyItemInfo.itemAmount >= 1100000) {
      return Math.floor(buyItemInfo.dal * buyItemInfo.itemAmount * 0.05);
    }
    return null;
  }, [price, buyItemInfo.itemAmount, (Number(price) * buyItemInfo.itemAmount)])

  //보너스달 지급유무
  const isBonusDalYn = useMemo(() => {
    return Number(price) * buyItemInfo.itemAmount >= 1100000;
  }, [price, buyItemInfo.itemAmount, (Number(price) * buyItemInfo.itemAmount)])


  return (
    <div id="dalCharge">
      <Header title="달 충전하기" position="sticky" type="back" />
      <section className="purchaseInfo">
        <CntTitle title="구매내역" />
        <div className="infoBox">
          <div className="infoList">
            <div className="title">구매상품</div>
            <p>{Utility.addComma(buyItemInfo.dal)} <strong>개</strong></p>
          </div>
          {isBonusDalYn && (
            <div className="infoList">
              <div className="title">추가지급</div>
              <p>{Utility.addComma(bonusDal)} <strong>개</strong></p>
            </div>
          )}
          <div className="infoList">
            <div className="title">상품수량</div>
            <p className="quantity">
              <button className="minus" onClick={()=>calcBuyItem('-')}>-</button>
              <span>{buyItemInfo.itemAmount}</span>
              <button className="plus" onClick={()=>calcBuyItem('+')}>+</button>
            </p>
          </div>
          <div className="infoList">
            <div className="title">총</div>
            <p>{Utility.addComma(dal * buyItemInfo.itemAmount)} <strong>개</strong></p>
          </div>
        </div>
        <div className="infoBox" style={{marginTop:'10px'}}>
          <div className="infoList">
            <div className='title'>결제금액</div>
            <p>{Utility.addComma(price * buyItemInfo.itemAmount)} <strong>원</strong></p>
          </div>
        </div>
      </section>
      <section className="paymentMethod">
        <CntTitle title="결제수단" />
        <div className="selectWrap">
          {paymentList.map((data,index) => {
            return (
              <div className={`selectItem ${Number(select) === index && 'active'}`}
                   onClick={()=>onSelectMethod(index, data)} data-target-index={index} key={index}>{data.type}</div>
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
      <form ref={formTag} name="payForm" acceptCharset="euc-kr" id="payForm"/>
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
          <SubmitBtn text="다음" onClick={()=>{history.push(`/selfauth?event=/pay/store`)}}/>
        </PopSlide>
      }
    </div>
  )
}

export default DalCharge