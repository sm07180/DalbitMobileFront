/**
 *
 */
import React, {useEffect, useContext, useState} from 'react'
//context
import {Context} from 'context'
import Api from 'context/api'
import {Hybrid} from 'context/hybrid'
//components
import Utility from 'components/lib/utility'
import Content from './content'

export default props => {
  //---------------------------------------------------------------------
  //context
  const context = useContext(Context)
  /**
   * @brief 로그인,이벤트처리핸들러
   */
  function update(mode) {
    switch (true) {
      case mode.loginSuccess !== undefined: //---------------------로그인,정상
        const {authToken} = mode.loginSuccess
        //Update
        context.action.updateToken(mode.loginSuccess)
        //native 전달
        Hybrid('GetLoginToken', mode.loginSuccess)
        //redirect
        if (props.history) {
          props.history.push('/')
          context.action.updatePopupVisible(false)
          context.action.updateGnbVisible(false)
        }
        break
      default:
        break
    }
  }
  //useEffect
  useEffect(() => {}, [])
  //---------------------------------------------------------------------
  return (
    <React.Fragment>
      <Content {...props} update={update} />
    </React.Fragment>
  )
}
