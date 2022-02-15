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
  const location = useLocation();
  const {cancelType} = qs.parse(location.search)
  const {result, message, orderId, returnType} = location.state || {result:"", message:"", orderId:"", returnType:""};

  console.log(location);
  console.log(result, message, orderId, returnType);

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
          sessionStorage.setItem('orderId', orderId);
          return history.push({pathname: "/"});
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
