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
  //useState
  const [isSave, setIsSave] = useState(false)
  /**
   * @brief 로그인,이벤트처리핸들러
   */
  function update(mode) {
    switch (true) {
      case mode.loginSuccess !== undefined: //---------------------로그인,정상
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
          } else {
            //일반적인 로그인성공
            Hybrid('GetLoginToken', mode.loginSuccess)
          }
          //쿠키실행
          if (isSave) {
            const {changes} = mode
            const cookie = escape(encodeURIComponent(JSON.stringify(changes)))
            Utility.setCookie('saveLogin', cookie, '100')
          } else {
            Utility.setCookie('saveLogin', '', -1)
          }
        }
        break
      case mode.saveLogin !== undefined: //------------------------로그인유지
        setIsSave(Boolean(mode.saveLogin))
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
