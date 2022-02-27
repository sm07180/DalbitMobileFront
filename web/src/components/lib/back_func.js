import React from 'react'
//context
// etc
import {closePopup} from "components/ui/popSlide/PopSlide";

export const backFunc = (context, dispatch) => {
  const {backFunction} = context
  switch (backFunction.name) {
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
    default:
      break
  }
  setTimeout(() => {
    context.action.updateSetBack(null)
  }, 100)
}
