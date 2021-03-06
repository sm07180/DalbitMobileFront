import React from 'react'
// etc
import {closePopup} from "components/ui/popSlide/PopSlide";
import {
  setGlobalCtxAlertStatus,
  setGlobalCtxBackFunction,
  setGlobalCtxBackState,
  setGlobalCtxMessage,
  setGlobalCtxMultiViewer
} from "redux/actions/globalCtx";
import {closeLayerPopup} from "components/ui/layerPopup/LayerPopup2";
import {Hybrid} from "context/hybrid";

export const backFunc = ({globalState, dispatch}) => {
  const {backFunction} = globalState;
  const nameLength = backFunction.length;
  const target = backFunction[nameLength-1];
  if(target === undefined) {
    Hybrid('goBack');
  }else {
    switch (target.name) {
      case 'booleanType':
        dispatch(setGlobalCtxBackFunction({name: 'booleanType', value: false}));
        break
      case 'multiViewer':
        dispatch(setGlobalCtxMultiViewer({show: false}))
        break
      case 'event':
      case 'selfauth':
        window.location.href = '/'
        break
      case 'popClose': // 슬라이드 팝업
        closePopup(dispatch)
        break;
      case 'alertClose': // 알럿, 컨펌
        dispatch(setGlobalCtxMessage({type:'alert', visible:false}));
        break;
      case 'commonPop':
        closeLayerPopup(dispatch);
        break;
      case 'callback': // 스와이퍼 사진 팝업, 이미지 편집 에서 사용중
        if (typeof globalState?.backEventCallback === 'function') {
          globalState?.backEventCallback();
        }
        break;
      case 'statusAlert': // common/alert/index
        dispatch(setGlobalCtxAlertStatus({ status: false }));
        globalState.alertStatus.cancelCallback && globalState.alertStatus.cancelCallback();
        break;
      default:
        Hybrid('goBack');
        break
    }
  }

  setTimeout(() => {
    if(nameLength === 1) {
      dispatch(setGlobalCtxBackState(null));
    }
  }, 100)
}
