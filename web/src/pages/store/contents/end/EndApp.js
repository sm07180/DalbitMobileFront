import qs from "query-string";
import React, {useContext, useEffect, useState} from "react";
import {useHistory, useLocation} from "react-router-dom";
import {Hybrid} from "context/hybrid";
import Utility from "components/lib/utility";
import {setStateHeaderVisible, getReceipt} from "redux/actions/payStore";
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

// PG사 취소 후 콜백 페이지
export default function EndApp() {
  const history = useHistory();
  const location = useLocation();
  const {cancelType} = qs.parse(location.search);
  const dispatch = useDispatch();
  const payStoreRdx = useSelector(({payStore})=> payStore);

  const {result, message, orderId, returnType} = location.state || {result:"", message:"", orderId:"", returnType:""};
  //창 닫기
  const closeWindow = () =>{
    if (cancelType === 'room') {
      Hybrid('CloseLayerPopup');
      Hybrid('ClosePayPopup');
      history.replace("/store");
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
    if (cancelType !== undefined) {
      closeWindow();
    } else {
      if (result === 'success') {
        payTracking();
        // if (returnType === 'room') {
        //   dispatch(setGlobalCtxMessage({type:'alert',
        //     msg: `결제가 완료되었습니다. \n 충전 내역은 '마이페이지 >\n 내 지갑'에서 확인해주세요.`,
        //     callback: () => {
        //       Hybrid('CloseLayerPopup')
        //       Hybrid('ClosePayPopup')
        //     }
        //   })
        // } else {  // returnType === 'store'
        //   sessionStorage.setItem('orderId', orderId);
        //   history.replace("/");
        // }
        dispatch(getReceipt({orderId:orderId, returnType: returnType}));
        // sessionStorage.setItem('orderId', orderId);
        // history.replace("/");
      } else {  // result !== 'success'

        dispatch(setGlobalCtxMessage({type:'alert',
          msg: message, callback: () => {
            Hybrid('CloseLayerPopup');
            Hybrid('ClosePayPopup');
            history.replace("/store");
          }
        }));
      }
    }
  }, [])

  return <></>
}
