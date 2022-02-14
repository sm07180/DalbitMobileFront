import qs from "query-string";
import React, {useContext, useEffect, useState} from "react";
import {useHistory, useLocation} from "react-router-dom";
import {Context} from "context";
import {Hybrid} from "context/hybrid";
import Api from "context/api";
import Utility from "components/lib/utility";

export default function EndApp() {
  const context = useContext(Context)
  const history = useHistory();
  const location = useLocation()
  const {result, message, orderId, cancelType, returnType} = location.state;

  const [receipt, setReceipt] = useState({
    orderId: orderId,
    payWay: "",
    payAmt: "",
    itemAmt: "",
    payCode: "",
  });

  //창 닫기
  const closeWindow = () =>{
    if (cancelType === 'room') {
      return Hybrid('ClosePayPopup')
    } else {
      history.push({pathname:"/store"})
    }
  }

  //결제 트래킹
  const payTracking = () =>{
    try {
      fbq('track', 'Purchase');
      firebase.analytics().logEvent('Purchase');
      kakaoPixel('114527450721661229').purchase();
    } catch (e) {
      console.log(e);
    }
  }

  //결제 정보 가져오기
  const getReciptInfo = async () => {
    await Api.pay_receipt({
      data: {
        orderId: orderId
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
  }

  const payTypeKor = (payWay) => {
    switch (payWay) {
      case 'simple':
        return "계좌 간편결제"
      case 'card':
        return "카드 결제"
      case 'phone':
        return "핸드폰 결제"
      case 'kakaoMoney':
        return "카카오페이 (머니)"
      case 'kakaopay':
        return  '카카오페이(카드)'
      case 'payco':
        return  '페이코'
      case 'tmoney':
        return  '티머니'
      case 'cashbee':
        return  '캐시비'
      case 'GM':
        return '문화상품권'
      case 'HM':
        return  '해피머니상품권'
    }
  }

  useEffect(() => {
    if (cancelType !== undefined) {
      closeWindow();
    } else {
      if (result === 'success') {
        payTracking();
        if (returnType === 'room') {
          context.action.alert({
            msg: `결제가 완료되었습니다. \n 충전 내역은 '마이페이지 >\n 내 지갑'에서 확인해주세요.`,
            callback: () => {
              Hybrid('CloseLayerPopup')
              Hybrid('ClosePayPopup')
            }
          })
        } else {  // returnType === 'store'
          getReciptInfo().then((response) => {
            sessionStorage.setItem('pay_receipt', JSON.stringify(receipt));
            return history.push({pathname: "/"});
          });
        }
      } else {  // result !== 'success'
        if (returnType === 'room') {
          context.action.alert({
            msg: message, callback: () => {
              Hybrid('ClosePayPopup')
            }
          });
        } else if (returnType === 'store') {
          context.action.alert({
            msg: message, callback: () => {
              history.push({pathname: "/store"})
            }
          });
        } else {
          Hybrid('ClosePayPopup');
          history.push({pathname: "/store"});
        }
      }
    }
  }, [])

  return <></>
}
