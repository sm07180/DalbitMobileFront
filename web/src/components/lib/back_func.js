import React from 'react'
// etc
import {closePopup} from "components/ui/popSlide/PopSlide";
import {setCommonPopupOpenData} from "redux/actions/common";
import {
  setGlobalCtxBackFunction, setGlobalCtxBackFunctionEnd,
  setGlobalCtxBackState,
  setGlobalCtxMessage,
  setGlobalCtxMultiViewer
} from "redux/actions/globalCtx";

export const backFunc = ({globalState, dispatch}) => {
  const {backFunction} = globalState;
  const nameLength = backFunction.length;
  switch (backFunction[nameLength-1]) {
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
      dispatch(setCommonPopupOpenData({...backFunction.popupData}))
      break;
    case 'callback': // 스와이퍼 사진 팝업, 이미지 편집 에서 사용중
      if (typeof globalState?.backEventCallback === 'function') {
        globalState?.backEventCallback();
        dispatch(setGlobalCtxBackFunctionEnd(''));
      }
      break;
    default:
      break
  }
  setTimeout(() => {
    if(nameLength === 1) {
      dispatch(setGlobalCtxBackState(null));
    }
  }, 100)
}
