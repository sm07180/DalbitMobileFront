import React from 'react'
//context
// etc
import {closePopup} from "components/ui/popSlide/PopSlide";
import {setCommonPopupOpenData} from "redux/actions/common";

export const backFunc = (dispatch, globalState) => {
  const nameLength = globalState.backFunction.name.length
  switch (globalState.backFunction.name[nameLength-1]) {
    case 'booleanType':
      context.action.updateBackFunction({name: 'booleanType', value: false})
      break
    case 'multiViewer':
      context.action.updateMultiViewer({show: false})
      break
    case 'event':
    case 'selfauth':
      window.location.href = '/'
      break
    case 'popClose': // 슬라이드 팝업
      closePopup(dispatch)
      break;
    case 'alertClose': // 알럿, 컨펌
      context.action.alert({visible: false})
      break;
    case 'commonPop':
      dispatch(setCommonPopupOpenData({...globalState.backFunction.popupData}))
      break;
    default:
      break
  }
  setTimeout(() => {
    if(nameLength === 1) {
      context.action.updateSetBack(null)
    }
  }, 100)
}
