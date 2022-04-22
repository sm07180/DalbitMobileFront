import React, {useEffect, useState} from 'react';
import SubmitBtn from "components/ui/submitBtn/SubmitBtn";
import './receiptPop.scss'
import {useSelector} from "react-redux";
const ReceiptPop = (props) => {
  const {payOrderId, clearReceipt} = props;
  const payStoreRdx = useSelector(({payStore})=> payStore);

  useEffect(() => {
    payTracking();
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = '';
    }

  }, []);

  //결제 트래킹
  const payTracking = () =>{
    if (window.fbq) {
      // window.fbq("track", "Purchase");
      window.fbq("track", "Buy_moon");
    }
    if (window.firebase) {
      // window.firebase.analytics().logEvent("Purchase");
      window.firebase.analytics().logEvent("Buy_moon");
    }
    /*if (window.kakaoPixel) {
      window.kakaoPixel("114527450721661229").purchase();
    }*/
  }

  return (
    <section className="bankResult">
      <div className="resultText">
        <div className="title">
          결제가 완료 되었습니다.
        </div>
        <div className="subTitle">
          결제 내역은 마이페이지 &gt; 내지갑에서<br/>확인하실 수 있습니다.
        </div>
      </div>
      <div className="receiptBoard">
        <div className="receiptList">
          <span>결제금액</span>
          <p>{payStoreRdx.receipt.payAmt}</p>
        </div>
        <div className="receiptList">
          <span>상품명</span>
          <p>{payStoreRdx.receipt.payCode}</p>
        </div>
        <div className="receiptList">
          <span>결제수단</span>
          <p>{payStoreRdx.receipt.payWay}</p>
        </div>
        <div className="receiptList">
          <span>주문번호</span>
          <p>{payStoreRdx.receipt.orderId}</p>
        </div>
      </div>
      <SubmitBtn text="확인" onClick={() => {
        clearReceipt()
      }}/>
    </section>
  );
};

export default ReceiptPop;
