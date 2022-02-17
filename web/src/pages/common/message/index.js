/**
 *
 */
import React from 'react'
import styled from 'styled-components'
//context
//components
import Alert from './content/Alert'
import AlertNoClose from './content/alert_no_close'
import Confirm from './content/confirm'
import ConfirmAdmin from './content/confirm_admin'
import Toast from './content/toast'
import {useDispatch, useSelector} from "react-redux";

export default (props) => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const {type, visible} = globalState.message
  /**
   * @brief 로그인,이벤트처리핸들러
   */

    //makeContents
  const makeContents = (visible) => {
      /**
       * @visible true
       */
      switch (visible) {
      case true:
        if (type === 'alert')
          return (
            <Message>
              <Alert />
            </Message>
          )
        if (type === 'alert_no_close')
          return (
            <Message>
              <AlertNoClose />
            </Message>
          )
        if (type === 'confirm')
          return (
            <Message>
              <Confirm />
            </Message>
          )
        if (type === 'confirm_admin')
          return (
            <Message>
              <ConfirmAdmin />
            </Message>
          )
        if (type === 'toast') return <Toast />

      case false:
        break
    }
  }
  //---------------------------------------------------------------------
  return <React.Fragment>{visible && makeContents(visible)}</React.Fragment>
}
//---------------------------------------------------------------------
const Message = styled.section`
  display: flex;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.7);
  z-index: 120;
`
