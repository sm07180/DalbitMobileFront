import React from 'react'
//context
import {Hybrid} from 'context/hybrid'
// etc
import Utility from 'components/lib/utility'
import {setGlobalCtxBackFunction, setGlobalCtxBackState, setGlobalCtxMultiViewer} from "redux/actions/globalCtx";

export const backFunc = (dispatch, globalState) => {
  switch (globalState.backFunction.name) {
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

    default:
      break
  }
  setTimeout(() => {
    dispatch(setGlobalCtxBackState(null));
  }, 100)
}
