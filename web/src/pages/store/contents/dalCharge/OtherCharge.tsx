import {useHistory, useLocation} from "react-router-dom";
import React, {useContext, useEffect, useMemo, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {setSlidePopupOpen} from "../../../../redux/actions/common";
import './dalCharge.scss'
import CntTitle from '../../../../components/ui/cntTitle/CntTitle';
import PopSlide, {closePopup} from 'components/ui/popSlide/PopSlide'
import Api from "../../../../context/api";
import Header from "../../../../components/ui/header/Header";
import Utility from "../../../../components/lib/utility";
import SubmitBtn from "../../../../components/ui/submitBtn/SubmitBtn";
import {Context} from "context";
import qs from 'query-string'
import {PAYMENT_LIST} from "../../../../redux/types/pay/storeType";
import {Hybrid} from "../../../../context/hybrid";
import {setStateHeaderVisible} from "../../../../redux/actions/payStore";

import moment from "moment";

const OtherCharge = ()=>{
  const history = useHistory();
  const context = useContext(Context);
  const location = useLocation();
  const isDesktop = useSelector((state)=> state.common.isDesktop);
  const payStoreRdx = useSelector(({payStore})=> payStore);

  
  const nowDay = moment().format('YYYYMMDD');

  const [selectPayment, setSelectPayment] = useState(-1);
  const formTag = useRef<any>();
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
          payType : PAYMENT_LIST[selectPayment].type,
        }
      });
    } else {
      context.action.alert({
        msg: message,
        callback:()=>{
          history.push("/store");
        }
      })
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
    if(commonPopup.commonPopup) {
      closePopup(dispatch);
    }else {
      dispatch(setSlidePopupOpen({...commonPopup, slidePopup: true}));
    }
  }

  const onSelectMethod = (index, payment) => {
    setSelectPayment(index);

    // 무통장, 간편결제는 헤더가 필요없음
    if(payment.code !== "coocon" && payment.code !== "simple"){
      dispatch(setStateHeaderVisible(true));
    }

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

  const callPGForm = (payment) => {
    Api[payment.fetch]({
      data: {
        Prdtnm: itemNm,
        Prdtprice: price * buyItemInfo.itemAmount,
        itemNo: itemNo,
        pageCode: webview === 'new' ? '2' : '1',
        pgCode: payment.code,
        itemAmt: buyItemInfo.itemAmount,
        isDesktop: isDesktop,
        ci: undefined,
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
            payForm?.append(makeHiddenInput(key, response.data[key]))
          })
          // payForm.CASH_GB.value : CN
          // payment.fetch: pay_card
          // @ts-ignore
          MCASH_PAYMENT(payForm)
          payForm.innerHTML = ''
        }
      } else {
        context.action.alert({msg: response.message})
      }
    });
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

  
  const openBannerUrl = (value) => {
    if(value.includes('notice')) {
      history.push({
        pathname: value,
        state: value.split('/')[2]
      })
    }else {
      history.push(value)
    }
  }

  return (
    <div id="dalCharge">
      {
        !payStoreRdx.stateHeader.visible &&
        <Header title="달 충전하기" position="sticky" type="back" />
      }
      {!moment(nowDay).isAfter(moment('20220428')) &&
        <section className="eventBanner">
          <div className="bannerImg" onClick={() => {openBannerUrl("/notice/661")}}>
            <img src="https://image.dalbitlive.com/store/banner/store_banner-7951.png" alt=""/>
          </div>
          <div className="bannerInfo">
            <p className="bannerText">※ 단, 무통장입금, 계좌이체, 카드결제 방식에 한합니다.</p>
            <p className="bannerText">※ 실제 보너스 지급은 다음날 지급됩니다. (휴일제외)</p>
          </div>
        </section>
      }
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
            <p>
              <span className='totalCnt'>
                {bonusDal ? Utility.addComma((dal * buyItemInfo.itemAmount) + bonusDal) : Utility.addComma((dal * buyItemInfo.itemAmount))}
              </span>
              <strong>개</strong>
            </p>
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
          {PAYMENT_LIST.map((data,index) => {
            return (
              <div key={index} className={`selectItem ${Number(selectPayment) === index ? 'active' : ''} ${paymentLimit(data.type) ? 'disabled' : ''}`}
                   onClick={()=>{onSelectMethod(index, data)}}>{data.type}
                   {(!moment(nowDay).isAfter(moment('20220428')) && data.bonus && price * buyItemInfo.itemAmount > 50000) ?
                      <span className="bonus">10% {index > 1 ? "" : "보너스"}</span>
                      :
                      <></>
                    }
                  </div>
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
      {commonPopup.commonPopup &&
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


export default OtherCharge
