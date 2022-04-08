/**
 * @file confirm.js
 * @brief confirm 기능과 가능 확인버튼1개의 레이어팝업
 * @use context.action.confirm({})
 * @todo
 * @param {cancelCallback} function    //캔슬 콜백처리받을 함수명(취소하기 클릭시)
 * @param {callback} function          //콜백처리받을 함수명(확인하기 클릭시)
 * @param {title} string               //상단제목없으면 노출안됨
 * @param {msg} string(html)           //메시지영역 노출 (html or)
 */
import React, {useMemo, useRef, useEffect, useContext} from 'react'
import _ from 'lodash'
//context
import {Context} from 'context'
//hooks
import useClick from 'components/hooks/useClick'
//components
import Utility from 'components/lib/utility'
import {isAndroid} from "context/hybrid";
//
export default (props) => {
  //---------------------------------------------------------------------
  //context
  const context = useContext(Context)
  //useRef
  const refBtn = useRef(null)
  //--hooks
  const confirm = useClick(update, {callback: 'confirm'})
  const cancel = useClick(update, {callback: 'cancel'})
  //--useMemo
  const cancelText = useMemo(() => {
    if (_.hasIn(context.message, 'buttonText.left')) {
      return context.message.buttonText.left
    } else {
      return '취소'
    }
  })
  const confirmText = useMemo(() => {
    if (_.hasIn(context.message, 'buttonText.right')) {
      return context.message.buttonText.right
    } else {
      return '확인'
    }
  })
  //---------------------------------------------------------------------
  //공통함수
  function update(mode) {
    switch (true) {
      case mode.visible !== undefined: //----------------------팝업닫기
        sessionStorage.removeItem('room_active')
        if (mode.visible === false) context.action.alert({visible: false})
        break
      case mode.callback !== undefined: //---------------------콜백처리
        //콜백
        context.action.alert({visible: false})
        if (mode.callback === 'confirm' && context.message.callback !== undefined) {
          context.message.callback()
        }
        //캔슬콜백(취소)
        if (mode.callback === 'cancel' && context.message.cancelCallback !== undefined) {
          context.message.cancelCallback()
        }

        break
    }
  }

  const btnClose = () => {
    sessionStorage.removeItem('room_active')
    context.action.alert({visible: false})
  }
  //useEffect
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    refBtn.current.focus()
    if(isAndroid()) {
      context.action.updateSetBack(true)
      context.action.updateBackFunction({name: 'alertClose'})
    }
    return () => {
      document.body.style.overflow = ''
      if(isAndroid()) {
        if(context.backFunction.name.length === 1) {
          context.action.updateSetBack(null)
        }
        context.action.updateBackFunction({name: ''})
      }
    }
  }, [])
  //---------------------------------------------------------------------
  return (
    <div className='popLayer' id="confirmPop">
      <div className="popContent">
        {context.message.title && <h1 dangerouslySetInnerHTML={{__html: Utility.nl2br(context.message.title)}}></h1>}
        <p className="msg" dangerouslySetInnerHTML={{__html: Utility.nl2br(context.message.msg)}}></p>
        {context.message.subMsg && (
          <div className="subMsg" dangerouslySetInnerHTML={{__html: Utility.nl2br(context.message.subMsg)}}></div>
        )}

        {context.message.remsg && (
          <b className="remsg" dangerouslySetInnerHTML={{__html: Utility.nl2br(context.message.remsg)}}></b>
        )}
      </div>
      <div className="popBtnWrap">
        <button ref={refBtn} className="cancelBtn" {...cancel}>
          {cancelText}
        </button>
        <button className="submitBtn" {...confirm}>
          {confirmText}
        </button>
      </div>
    </div>
  )
}