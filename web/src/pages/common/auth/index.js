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
        const {authToken, memNo} = mode.loginSuccess
        //Update
        context.action.updateToken(mode.loginSuccess)
        const _href = window.location.href
        //redirect
        if (props.history) {
          context.action.updatePopupVisible(false)
          context.action.updateGnbVisible(false)
          /**
           * @native 전달
           */
          //앱에서호출되는 로그인팝업
          if (_href.indexOf('/login') !== -1) {
            Hybrid('GetLoginTokenNewWin', mode.loginSuccess)
            alert('test')
            // Utility.setCookie('native-player-info', 'GetLoginTokenNewWin', 100)
          } else {
            //일반적인 로그인성공
            Hybrid('GetLoginToken', mode.loginSuccess)
          }
        }
        break
      default:
        break
    }
  }

  //---------------------------------------------------------------------
  return (
    <React.Fragment>
      <Content {...props} update={update} />
    </React.Fragment>
  )
}
