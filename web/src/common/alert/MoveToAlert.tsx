import React, {useContext, useEffect} from "react"
import { useHistory, useLocation } from "react-router-dom";
import {GlobalContext} from "../../context";

const MoveToAlert = ()=>{
  const { globalState, globalAction } = useContext(GlobalContext);
  const history = useHistory();
  const location = useLocation();
  useEffect(()=>{
    if(!globalState.moveToAlert.alertStatus.status){
      return;
    }
    if(globalState.moveToAlert.dest === location.pathname){
      // 초기화 처리
      globalAction.setMoveToAlert({alertStatus:{status:false}, state:"ready", dest:""});
      setTimeout(()=>{
        // 시점문제로 setTimeout...
        globalAction.setAlertStatus({
          status: true,
          content: globalState.moveToAlert.alertStatus.content,
          callback: globalState.moveToAlert.alertStatus.callback,
          cancelCallback: globalState.moveToAlert.alertStatus.cancelCallback,
        });
      }, 300)
    }else{
      globalAction.setMoveToAlert({...globalState.moveToAlert, state:'moved'})
      history.replace(globalState.moveToAlert.dest);
    }
  }, [globalState.moveToAlert])

  return <></>;
}

export default MoveToAlert
