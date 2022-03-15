import React from 'react'
// etc
import {closePopup} from "components/ui/popSlide/PopSlide";
import {setCommonPopupOpenData} from "redux/actions/common";
import {
  setGlobalCtxBackFunction,
  setGlobalCtxBackState,
  setGlobalCtxMessage,
  setGlobalCtxMultiViewer
} from "redux/actions/globalCtx";

export const backFunc = (dispatch, globalState) => {
  const nameLength = globalState.backFunction.name.length
  switch (globalState.backFunction.name[nameLength-1]) {
    case 'booleanType':
      dispatch(setGlobalCtxBackFunction({name: 'booleanType', value: false}));
      break
    case 'multiViewer':
      dispatch(setGlobalCtxMultiViewer({show: false}));
      break
    case 'event':
    case 'selfauth':
      window.location.href = '/'
      break
    case 'popClose':
      closePopup(dispatch)
      break;
    case 'alertClose':

      dispatch(setGlobalCtxMessage({type: "alert",visible: false}))
      break;
    case 'questionPop':
      dispatch(setCommonPopupOpenData({...globalState.backFunction.popupData, commonPopup: false}))
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
