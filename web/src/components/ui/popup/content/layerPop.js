/**
 * @file layerPop.js
 * @brief layerPop 기능과 가능 확인버튼1개의 레이어팝업
 * @use dispatch(setGlobalCtxMessage({type:"layerPop",})
 * @todo
 * @param {callback} function          //콜백처리받을 함수명(확인하기 클릭시)
 * @param {title} string               //상단제목없으면 노출안됨
 * @param {msg} string(html)           //메시지영역 노출 (html or)
 * @param {remsg}} string(html)           //메시지영역 노출 (html or)
 */
import React, {useEffect, useRef} from 'react'
//hooks
import useClick from 'components/hooks/useClick'
//components
import Utility from 'components/lib/utility'
import {useDispatch, useSelector} from "react-redux";
import {
  setGlobalCtxBackFunction,
  setGlobalCtxBackFunctionEnd,
  setGlobalCtxBackState,
  setGlobalCtxMessage
} from "redux/actions/globalCtx";
import {isAndroid} from "context/hybrid";
//
const LayerPop = (props) => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  //---------------------------------------------------------------------
  //useRef
  const refBtn = useRef(null)
  //--hooks
  const cancel = useClick(update, {visible: false})
  const confirm = useClick(update, {callback: 'confirm'})
  //---------------------------------------------------------------------
  //공통함수
  function update(mode) {
    switch (true) {
      case mode.visible !== undefined: //---------------------팝업닫기
        //팝업닫기
        if (mode.visible === false) dispatch(setGlobalCtxMessage({type: "layerPop", visible: false}))
        if (globalState.message.visible === false) dispatch(setGlobalCtxMessage({type: "layerPop", visible: false}))
        break
      case mode.callback !== undefined: //---------------------콜백처리
        //콜백
        if (mode.callback === 'confirm' && globalState.message.callback !== undefined) {
          globalState.message.callback()
        }
        dispatch(setGlobalCtxMessage({type: "layerPop", visible: false}))
        break
    }
  }
  //useEffect
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    refBtn.current.focus()
    if(isAndroid()) {
      dispatch(setGlobalCtxBackState(true));
      dispatch(setGlobalCtxBackFunction({name: 'alertClose'}));
    }
    return () => {
      document.body.style.overflow = ''
      if(isAndroid()) {
        dispatch(setGlobalCtxBackFunctionEnd(''));
        if(globalState.backFunction?.name?.length === 1) {
          dispatch(setGlobalCtxBackState(null));
        }
      }
    }
  }, [])
  //---------------------------------------------------------------------
  return (
    <>
      <div className="popLayer" id='layerPop'>
        <div className="popContent">
          {/* 타이틀 */}
          {__NODE_ENV === 'dev' && globalState.message.title && globalState.message.className !== 'mobile' && (
            <h1
              className={`title ${globalState.message.className ? globalState.message.className : ''}`}
              dangerouslySetInnerHTML={{__html: Utility.nl2br(globalState.message.title)}}></h1>
          )}
          {globalState.message.className === 'mobile' && (
            <h1
              className={`${globalState.message.className ? globalState.message.className : ''}`}
              dangerouslySetInnerHTML={{__html: Utility.nl2br(globalState.message.title)}}></h1>
          )}
          {/* 메시지 */}
          {globalState.message.msg && (
            <div
              className={`msg ${globalState.message.className ? globalState.message.className : ''}`}
              dangerouslySetInnerHTML={{__html: Utility.nl2br(globalState.message.msg)}}></div>
          )}
          {/* 강조 되묻기 */}
          {globalState.message.remsg && (
            <b
              className={`remsg ${globalState.message.className ? globalState.message.className : ''}`}
              dangerouslySetInnerHTML={{__html: Utility.nl2br(globalState.message.remsg)}}></b>
          )}
        </div>
      </div>
      <div className="popBtnWrap">
        <button
          ref={refBtn}
          className="submitBtn"
          {...confirm}
          onKeyPress={(event) => {
            console.log(event)
          }}>
          {globalState.message.buttonMsg ? globalState.message.buttonMsg : '확인'}
        </button>
      </div>
    </>
  )
}

export default LayerPop
