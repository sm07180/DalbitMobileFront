import React from 'react'
//context
//components
import Alert from './content/alert'
import AlertNoClose from './content/alert_no_close'
import Confirm from './content/confirm'
import ConfirmAdmin from './content/confirm_admin'
import Toast from './content/toast'
import LayerPop from './content/layerPop'

import './popup.scss'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

const Popup = (props) => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const {type, visible} = globalState.message

  const closePopupDim = (e) => {
    const target = e.target;

    if (target.id === "popup") {
      if (globalState.message.btnCloseCallback !== undefined) {
        globalState.message.btnCloseCallback()
      }
      dispatch(setGlobalCtxMessage({type: "layerPop", visible: false}));
    }
  };


  //makeContents
  const makeContents = (visible) => {
    /**
     * @visible true
     */
    switch (visible) {
      case true:
        if (type === 'alert')
          return (
            <div id="popup" onClick={closePopupDim}>
              <Alert />
            </div>
          )
        if (type === 'alert_no_close')
          return (
            <div id="popup" onClick={closePopupDim}>
              <AlertNoClose />
            </div>
          )
        if (type === 'confirm')
          return (
            <div id="popup" onClick={closePopupDim}>
              <Confirm />
            </div>
          )
        if (type === 'confirm_admin')
          return (
            <div id="popup" onClick={closePopupDim}>
              <ConfirmAdmin />
            </div>
          )
        if (type === 'toast')
          return (
            <Toast />
          )
        if (type === 'layerPop')
          return (
            <div id="popup" onClick={closePopupDim}>
              <LayerPop />
            </div>
          )
      case false:
        break
    }
  }
  //---------------------------------------------------------------------
  return (
    <React.Fragment>
      {visible && makeContents(visible)}
    </React.Fragment>
  )
}

export default Popup
