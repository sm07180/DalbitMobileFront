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
        //mypage update
        async function fetchData(obj) {
          const res = await Api.mypage({...obj})
          if (res.result === 'success') {
            context.action.updateMypage(res.data)
          }
        }
        fetchData()

        //redirect
        if (props.history) {
          context.action.updatePopupVisible(false)
          context.action.updateGnbVisible(false)
        }
        break
      default:
        break
    }
  }
  //useEffect
  useEffect(() => {
    console.log(context.token.isLogin)
  }, [])
  //---------------------------------------------------------------------
  return (
    <React.Fragment>
      <Content {...props} update={update} />
    </React.Fragment>
  )
}
