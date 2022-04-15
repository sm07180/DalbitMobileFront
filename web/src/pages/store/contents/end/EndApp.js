import qs from "query-string";
import React, {useContext, useEffect, useState} from "react";
import {useHistory, useLocation} from "react-router-dom";
import {Context} from "context";
import {Hybrid} from "context/hybrid";
import Utility from "components/lib/utility";
import {setStateHeaderVisible} from "redux/actions/payStore";
import {useDispatch, useSelector} from "react-redux";

// PG사 취소 후 콜백 페이지
export default function EndApp() {
  const context = useContext(Context)
  const history = useHistory();
  const location = useLocation();
  const {cancelType} = qs.parse(location.search);
  const dispatch = useDispatch();
  const payStoreRdx = useSelector(({payStore})=> payStore);

  const {result, message, orderId, returnType, webview} = location.state || {result:"", message:"", orderId:"", returnType:"", webview:''};
  //창 닫기
  const closeWindow = () =>{
    if (cancelType === 'room') {
      return Hybrid('ClosePayPopup')
    } else {
      // PG사 취소 후 params 에 여러 값을 달고 오므로 스토어 페이지로 redirect
      window.location.replace("/store");
    }
  }

  //결제 트래킹
  const payTracking = () =>{
    try {
      Utility.addAdsData('Buy_moon');
      // Utility.addAdsData('Purchase');
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    dispatch(setStateHeaderVisible(false));
    //fixme testcode
    alert("EndApp.js log >> ["+JSON.stringify(location)+"]");
    if(location.state){
      alert("EndApp.js log >> ["+JSON.stringify(location.state)+"]");
    }

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
          if(webview === 'new'){
            alert(1)
            history.replace("/");
            setTimeout(()=>{
              Hybrid('CloseLayerPopup');
              Hybrid('ClosePayPopup');
            },50)
          }else{
            alert(2)
            history.replace("/");
            // history.push({pathname: "/"});
          }
          return;
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
