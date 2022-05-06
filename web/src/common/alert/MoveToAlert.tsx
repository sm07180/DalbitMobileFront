import React, {useContext, useEffect} from "react"
import { useHistory, useLocation } from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxAlertStatus, setGlobalCtxMoveToAlert} from "../../redux/actions/globalCtx";

const MoveToAlert = ()=>{
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const history = useHistory();
  const location = useLocation();
  useEffect(()=>{
    if(!globalState.moveToAlert.alertStatus.status){
      return;
    }
    if(globalState.moveToAlert.dest === location.pathname){
      // 초기화 처리
      dispatch(setGlobalCtxMoveToAlert({alertStatus:{status:false}, state:"ready", dest:""}));
      setTimeout(()=>{
        // 시점문제로 setTimeout...
        dispatch(setGlobalCtxAlertStatus({
          status: true,
          content: globalState.moveToAlert.alertStatus.content,
          callback: globalState.moveToAlert.alertStatus.callback,
          cancelCallback: globalState.moveToAlert.alertStatus.cancelCallback,
        }))
      }, 300)
    }else{
      dispatch(setGlobalCtxMoveToAlert({...globalState.moveToAlert, state:'moved'}));
      history.replace(globalState.moveToAlert.dest);
    }
  }, [globalState.moveToAlert])

  return <></>;
}

export default MoveToAlert
