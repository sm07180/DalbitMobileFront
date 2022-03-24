import qs from "query-string";
import React, {useEffect} from "react";
import {useHistory, useLocation} from "react-router-dom";
import {Hybrid} from "context/hybrid";
import Utility from "components/lib/utility";
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

export default function EndApp() {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const history = useHistory();
  const location = useLocation();
  const {cancelType} = qs.parse(location.search)
  const {result, message, orderId, returnType} = location.state || {
    result: "",
    message: "",
    orderId: "",
    returnType: ""
  };

  //창 닫기
  const closeWindow = () => {
    if (cancelType === 'room') {
      return Hybrid('ClosePayPopup')
    } else {
      history.push({pathname: "/store"})
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
    if (cancelType !== undefined) {
      closeWindow();
    } else {
      if (result === 'success') {
        payTracking();
        if (returnType === 'room') {
          dispatch(setGlobalCtxMessage({
            type: "alert",
            msg: `결제가 완료되었습니다. \n 충전 내역은 '마이페이지 >\n 내 지갑'에서 확인해주세요.`,
            callback: () => {
              Hybrid('CloseLayerPopup')
              Hybrid('ClosePayPopup')
            }
          }))
        } else {  // returnType === 'store'
          sessionStorage.setItem('orderId', orderId);
          return history.push({pathname: "/"});
        }
      } else {  // result !== 'success'
        if (returnType === 'room') {
          dispatch(setGlobalCtxMessage({
            type: "alert",
            msg: message, callback: () => {
              Hybrid('ClosePayPopup')
            }
          }));
        } else if (returnType === 'store') {
          dispatch(setGlobalCtxMessage({
            type: "alert",
            msg: message, callback: () => {
              history.push({pathname: "/store"})
            }
          }));
        } else {
          Hybrid('ClosePayPopup');
          history.push({pathname: "/store"});
        }
      }
    }
  }, [])

  return <></>
}
