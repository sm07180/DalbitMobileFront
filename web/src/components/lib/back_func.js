import React from 'react'
//context
import {Hybrid} from 'context/hybrid'
// etc
import Utility from 'components/lib/utility'

export const backFunc = (context) => {
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

    default:
      break
  }
  setTimeout(() => {
    context.action.updateSetBack(null)
  }, 100)
}
