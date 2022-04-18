import React, {useEffect, useState} from 'react';
import Utility from "components/lib/utility";
import Api from 'context/api'
import SubmitBtn from "components/ui/submitBtn/SubmitBtn";
import './receiptPop.scss'

import {useHistory} from "react-router-dom";
import qs from 'query-string'
import {Hybrid, isHybrid} from "context/hybrid";
const ReceiptPop = (props) => {
  const history = useHistory();
  const {payOrderId, clearReceipt} = props;
  const {webview} = qs.parse(location.search);

  console.log(props);
  console.log(payOrderId);

  const [receipt, setReceipt] = useState({
    orderId: payOrderId,
    payWay: "",
    payAmt: "",
    itemAmt: "",
    payCode: "",
  });

  useEffect(() => {
    payTracking();
    getReciptInfo();
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

  //결제 정보 가져오기
  const getReciptInfo = () => {
    Api.pay_receipt({
      data: {
        orderId: payOrderId
      }
    }).then((response) => {
      setReceipt({
        ...receipt,
        orderId: response.data.order_id,
        payWay: payTypeKor(response.data.pay_way),
        payAmt: Utility.addComma(response.data.pay_amt).split('.')[0] + "원 (부가세포함)",
        itemAmt: response.data.item_amt,
        payCode: response.data.pay_code
      })
    });
  };

  const payTypeKor = (payWay) => {
    switch (payWay) {
      case 'simple':
        return "계좌 간편결제"
      case 'kakaoMoney':
        return "카카오페이 (머니)"
      case 'CN':
        return "카드 결제"
      case 'MC':
        return "휴대폰 결제"
      case 'GM':
        return '문화상품권'
      case 'HM':
        return  '해피머니상품권'
      case 'kakaopay':
        return  '카카오페이(카드)'
      case 'payco':
        return  '페이코'
      case 'tmoney':
        return  '티머니'
      case 'cashbee':
        return  '캐시비'
    }
  }

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = '';

      if (webview && webview === 'new' && isHybrid()) {
        Hybrid('CloseLayerPopup')
        Hybrid('ClosePayPopup')
      }else{
        history.push("/")
      }


    }
  }, [])

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
          <p>{receipt.payAmt}</p>
        </div>
        <div className="receiptList">
          <span>상품명</span>
          <p>{receipt.payCode}</p>
        </div>
        <div className="receiptList">
          <span>결제수단</span>
          <p>{receipt.payWay}</p>
        </div>
        <div className="receiptList">
          <span>주문번호</span>
          <p>{receipt.orderId}</p>
        </div>
      </div>
      <SubmitBtn text="확인" onClick={() => {
        // if (webview && webview === 'new' && isHybrid()) {
        //   Hybrid('CloseLayerPopup')
        //   Hybrid('ClosePayPopup')
        // }else{
        //   history.push("/")
        // }
        clearReceipt()
      }}/>
    </section>
  );
};

export default ReceiptPop;
