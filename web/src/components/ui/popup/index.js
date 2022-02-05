/**
 *
 */
import React, {useContext} from 'react'
//context
import {Context} from 'context'
//components
import Utility from 'components/lib/utility'
import Alert from './content/alert'
import AlertNoClose from './content/alert_no_close'
import Confirm from './content/confirm'
import ConfirmAdmin from './content/confirm_admin'
import Toast from './content/toast'

import './popup.scss'

const Popup = (props) => {
  //---------------------------------------------------------------------
  //context
  const context = useContext(Context)
  const {type, visible} = context.message
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
            <div id="popup">
              <Alert />
            </div>
          )
        if (type === 'alert_no_close')
          return (
            <div id="popup">
              <AlertNoClose />
            </div>
          )
        if (type === 'confirm')
          return (
            <div id="popup">
              <Confirm />
            </div>
          )
        if (type === 'confirm_admin')
          return (
            <div id="popup">
              <ConfirmAdmin />
            </div>
          )
        if (type === 'toast')
          return (
            <Toast />
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