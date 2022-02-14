/**
 * @file layerPop.js
 * @brief layerPop 기능과 가능 확인버튼1개의 레이어팝업
 * @use context.action.layerPop({})
 * @todo
 * @param {callback} function          //콜백처리받을 함수명(확인하기 클릭시)
 * @param {title} string               //상단제목없으면 노출안됨
 * @param {msg} string(html)           //메시지영역 노출 (html or)
 * @param {remsg}} string(html)           //메시지영역 노출 (html or)
 */
import React, {useRef, useContext, useEffect} from 'react'
//context
import {Context} from 'context'
//hooks
import useClick from 'components/hooks/useClick'
//components
import Utility from 'components/lib/utility'
//
const LayerPop = (props) => {
  //---------------------------------------------------------------------
  //context
  const context = useContext(Context)
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
        if (mode.visible === false) context.action.layerPop({visible: false})
        if (context.message.visible === false) context.action.layerPop({visible: false})
        break
      case mode.callback !== undefined: //---------------------콜백처리
        //콜백
        if (mode.callback === 'confirm' && context.message.callback !== undefined) {
          context.message.callback()
        }
        context.action.layerPop({visible: false})
        break
    }
  }
  //useEffect
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    refBtn.current.focus()
    return () => {
      document.body.style.overflow = ''
    }
  }, [])
  //---------------------------------------------------------------------
  return (
    <>
      <div className="popLayer" id='layerPop'>
        <div className="popContent">
          {/* 타이틀 */}
          {__NODE_ENV === 'dev' && context.message.title && context.message.className !== 'mobile' && (
            <h1
              className={`title ${context.message.className ? context.message.className : ''}`}
              dangerouslySetInnerHTML={{__html: Utility.nl2br(context.message.title)}}></h1>
          )}
          {context.message.className === 'mobile' && (
            <h1
              className={`${context.message.className ? context.message.className : ''}`}
              dangerouslySetInnerHTML={{__html: Utility.nl2br(context.message.title)}}></h1>
          )}
          {/* 메시지 */}
          {context.message.msg && (
            <div
              className={`msg ${context.message.className ? context.message.className : ''}`}
              dangerouslySetInnerHTML={{__html: Utility.nl2br(context.message.msg)}}></div>
          )}
          {/* 강조 되묻기 */}
          {context.message.remsg && (
            <b
              className={`remsg ${context.message.className ? context.message.className : ''}`}
              dangerouslySetInnerHTML={{__html: Utility.nl2br(context.message.remsg)}}></b>
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
          {context.message.buttonMsg ? context.message.buttonMsg : '확인'}
        </button>
      </div>
    </>
  )
}

export default LayerPop