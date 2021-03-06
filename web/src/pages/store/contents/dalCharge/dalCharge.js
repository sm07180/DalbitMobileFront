import React, {useEffect, useMemo, useRef, useState} from 'react'
import {useHistory, useLocation} from "react-router-dom";

import Api from 'context/api'
import Utility from 'components/lib/utility'

import Header from 'components/ui/header/Header'
import CntTitle from '../../../../components/ui/cntTitle/CntTitle';
import SubmitBtn from 'components/ui/submitBtn/SubmitBtn'
import PopSlide, {closePopup} from 'components/ui/popSlide/PopSlide'
import './dalCharge.scss'
import {useDispatch, useSelector} from "react-redux";
import qs from 'query-string'
import {setSlidePopupOpen} from "redux/actions/common";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

let paymentList = [
  {type: '계좌 간편결제', fetch: 'pay_simple', code: 'simple', bonus: true},
  {type: '무통장(계좌이체)', code: 'coocon', bonus: true},
  {type: '신용/체크카드', fetch: 'pay_card', bonus: true},
  {type: '휴대폰', fetch: 'pay_phone', bonus: false},
  {type: '카카오페이(머니)', fetch: 'pay_km', code: 'kakaomoney', bonus: false},
  {type: '카카오페이(카드)', fetch: 'pay_letter', code: 'kakaopay', bonus: false},
  {type: '페이코', fetch: 'pay_letter', code: 'payco', bonus: false},
  {type: '티머니/캐시비', fetch: 'pay_letter', code: 'tmoney', bonus: false},
  {type: '문화상품권', fetch: 'pay_gm', bonus: false},
  {type: '해피머니상품권', fetch: 'pay_hm', bonus: false}
  // {type: '캐시비', fetch: 'pay_letter', code: 'cashbee'},
  // {type: "스마트문상(게임문화상품권)", fetch: 'pay_gg'},
  // {type: "도서문화상품권", fetch: 'pay_gc'},
]

const DalCharge = () => {
  const history = useHistory();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const location = useLocation();
  const isDesktop = useSelector((state)=> state.common.isDesktop)
  const [selectPayment, setSelectPayment] = useState(-1);
  const formTag = useRef(null);
  const { itemNm, dal, price, itemNo, webview} = qs.parse(location.search);
  const dispatch = useDispatch();
  const commonPopup = useSelector(state => state.popup);

  const [buyItemInfo, setBuyItemInfo] = useState({
    dal: Number(dal),
    itemNo: itemNo,
    itemPrice : Number(price),
    itemAmount : 1,
  });

  const updateDispatch = (event) => {
    const {result, message} = event.detail;
    if (result === "success") {
      history.push({
        pathname: "/pay/receipt",
        state : {
          info : event.detail,
          payType : paymentList[selectPayment].type,
        }
      });
    } else {
      dispatch(setGlobalCtxMessage({type: "alert",
        msg: message,
        callback:()=>{
          history.push("/store");
        }
      }))
    }
  };

  useEffect(() => {
    if (!itemNm) return history.goBack();
    if(selectPayment!==-1){
      document.addEventListener("store-pay", updateDispatch);
    }
    return () => {
      document.removeEventListener("store-pay", updateDispatch);
    };
  }, [selectPayment]);

  const slidePopAction = () => {
    if(commonPopup.slidePopup) {
      closePopup(dispatch);
    }else {
      dispatch(setSlidePopupOpen());
    }
  }

  const onSelectMethod = (index, payment) => {
    setSelectPayment(index);

    if (payment.code === "simple") {  //계좌 간편결제
      Api.self_auth_check().then((response)=>{
        if(response.result === 'success'){
          callPGForm(payment)
        }else{
          slidePopAction();
        }
      });
    }else if(payment.code === "coocon"){  // 무통장(계좌이체)
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
    }else{
      callPGForm(payment);
    }
  }

  const callPGForm = (payment, ciData) => {
    Api[payment.fetch]({
      data: {
        Prdtnm: itemNm,
        Prdtprice: price * buyItemInfo.itemAmount,
        itemNo: itemNo,
        pageCode: webview === 'new' ? '2' : '1',
        pgCode: payment.code,
        itemAmt: buyItemInfo.itemAmount,
        isDesktop: isDesktop,
        ci: ciData,
      }
    }).then((response) => {
      if (response.result === 'success') {
        if (payment.fetch === "pay_simple" || payment.fetch === "pay_letter" || payment.fetch === "pay_km") { //계좌 간편결제, 카카카오페이, 페이코, 티머니/캐시비
          if(isDesktop){
            if (response.data.hasOwnProperty("pcUrl") || response.data.hasOwnProperty("url")) {
              return window.open(
                response.data.pcUrl ? response.data.pcUrl : response.data.url,
                "popup",
                "width = 400, height = 560, top = 100, left = 200, location = no"
              );
            } else if (response.data.hasOwnProperty("next_redirect_pc_url")) {  //카카오페이(머니) 전용
              return window.open(
                response.data.next_redirect_pc_url,
                "popup",
                "width = 500, height = 560, top = 100, left = 200, location = no"
              );
            }
          }else{ //isDesktop === false (모바일)
            if (response.data.hasOwnProperty('mobileUrl') || response.data.hasOwnProperty('url')) {
              return (window.location.href = response.data.mobileUrl ? response.data.mobileUrl : response.data.url);
            } else if (response.data.hasOwnProperty('next_redirect_mobile_url')) {  //카카오페이(머니) 전용
              return (window.location.href = response.data.next_redirect_mobile_url)
            }
          }
        } else {  // 신용/체크카드, 휴대폰, 문화상품권, 해피머니상품권
          let payForm = formTag.current
          const makeHiddenInput = (key, value) => {
            const input = document.createElement('input')
            input.setAttribute('type', 'hidden')
            input.setAttribute('name', key)
            input.setAttribute('id', key)
            input.setAttribute('value', value)
            return input
          }
          Object.keys(response.data).forEach((key) => {
            payForm.append(makeHiddenInput(key, response.data[key]))
          })
          MCASH_PAYMENT(payForm)
          payForm.innerHTML = ''
        }
      } else {
        dispatch(setGlobalCtxMessage({type: "alert",msg: response.message}))
      }
    });
  }

  //상품수량 +,-
  const calcBuyItem = (type) => {
    if(type === '+'){
      if (buyItemInfo.itemAmount === 10) return dispatch(setGlobalCtxMessage({type: "toast", msg: '최대 10개까지 구매 가능합니다.' }))
      setBuyItemInfo({...buyItemInfo, itemAmount: buyItemInfo.itemAmount+1})
    }else if(type === '-'){
      if (buyItemInfo.itemAmount === 1) return dispatch(setGlobalCtxMessage({type: "toast", msg: '최소 1개까지 구매 가능합니다.' }))
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


  const paymentLimit = (type) => {
    switch (type) {
      case "페이코":
        if (price * buyItemInfo.itemAmount > 100000) return true;
        break;
      case "티머니/캐시비":
        if (price * buyItemInfo.itemAmount > 500000) return true;
        break;
      case "휴대폰":
        if (price * buyItemInfo.itemAmount > 1000000) return true;
        break;
      default:
        return false;
    }
  };

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
            <p><span className='totalCnt'>{Utility.addComma((dal * buyItemInfo.itemAmount) + bonusDal)}</span><strong>개</strong></p>
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
              <div key={index} className={`selectItem ${Number(selectPayment) === index ? 'active' : ''} ${paymentLimit(data.type) ? 'disabled' : ''}`}
                   onClick={()=>{onSelectMethod(index, data)}}>{data.type}</div>
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
      {commonPopup.slidePopup &&
      <PopSlide>
        <div className='title'>인증 정보를 확인해주세요!</div>
        <p className='text'>
          안전한 계좌 정보 등록을 위해 한번 더<br/>
          본인인증을 해주셔야 합니다.<br/>
          추가 인증 시에는 반드시 위의 회원정보와 일치해야 합니다.<br/>
          추가 인증은 딱 1회만 진행됩니다.
        </p>
        <SubmitBtn text="다음" onClick={()=>{history.push(`/selfauth?event=/store`)}}/>
      </PopSlide>
      }
    </div>
  )
}

export default DalCharge
