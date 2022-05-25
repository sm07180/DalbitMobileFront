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
//hooks
import useClick from 'components/hooks/useClick'
//components
import Utility from 'components/lib/utility'
import {isAndroid} from "context/hybrid";
import {useDispatch, useSelector} from "react-redux";
import {
  setGlobalCtxBackFunction,
  setGlobalCtxBackFunctionEnd,
  setGlobalCtxBackState,
  setGlobalCtxMessage
} from "redux/actions/globalCtx";
//
export default (props) => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  //useRef
  const refBtn = useRef(null)
  //--hooks
  const confirm = useClick(update, {callback: 'confirm'})
  const cancel = useClick(update, {callback: 'cancel'})
  //--useMemo
  const cancelText = useMemo(() => {
    if (_.hasIn(globalState.message, 'buttonText.left')) {
      return globalState.message.buttonText.left
    } else {
      return '취소'
    }
  })
  const confirmText = useMemo(() => {
    if (_.hasIn(globalState.message, 'buttonText.right')) {
      return globalState.message.buttonText.right
    } else {
      return '확인'
    }
  })
  //---------------------------------------------------------------------
  //공통함수
  function update(mode) {
    switch (true) {
      case mode.visible !== undefined: //----------------------팝업닫기
        if (mode.visible === false) dispatch(setGlobalCtxMessage({type:'alert',visible: false}))
        break
      case mode.callback !== undefined: //---------------------콜백처리
        //콜백
        dispatch(setGlobalCtxMessage({type:'alert',visible: false}))
        if (mode.callback === 'confirm' && globalState.message.callback !== undefined) {
          globalState.message.callback()
        }
        //캔슬콜백(취소)
        if (mode.callback === 'cancel' && globalState.message.cancelCallback !== undefined) {
          globalState.message.cancelCallback()
        }

        break
    }
  }

  const btnClose = () => {
    dispatch(setGlobalCtxMessage({type:'alert',visible: false}))
  }
  //useEffect
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    refBtn.current.focus()
    if(isAndroid()) {
      dispatch(setGlobalCtxBackState(true))
      dispatch(setGlobalCtxBackFunction({name: 'alertClose'}))
    }
    return () => {
      document.body.style.overflow = ''
      if(isAndroid()) {
        dispatch(setGlobalCtxBackFunctionEnd(''));
      }
    }
  }, [])
  //---------------------------------------------------------------------
  return (
    <div className='popLayer' id="imgConfirmPop">
      <div className="popContent">
        {/* {globalState.message.title && <h1 className="title" dangerouslySetInnerHTML={{__html: Utility.nl2br(globalState.message.title)}}></h1>} */}
        <div className="imgWrap" dangerouslySetInnerHTML={{__html: Utility.nl2br(globalState.message.msg)}}></div>
        {/* {globalState.message.subMsg && (
          <div className="subMsg" dangerouslySetInnerHTML={{__html: Utility.nl2br(globalState.message.subMsg)}}></div>
        )}

        {globalState.message.remsg && (
          <b className="remsg" dangerouslySetInnerHTML={{__html: Utility.nl2br(globalState.message.remsg)}}></b>
        )} */}
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
