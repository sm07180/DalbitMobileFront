import React from 'react'
//context
// etc
import {closePopup} from "components/ui/popSlide/PopSlide";

export const backFunc = (context, dispatch) => {
  const {backFunction} = context
  const nameLength = backFunction.name.length
  switch (backFunction.name[nameLength-1]) {
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
    case 'popClose':
      closePopup(dispatch)
      break;
    case 'alertClose':
      context.action.alert({visible: false})
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
