/**
 * @file alert.js
 * @brief alert 기능과 가능 확인버튼1개의 레이어팝업
 * @use context.action.alert({})
 * @todo
 * @param {callback} function          //콜백처리받을 함수명(확인하기 클릭시)
 * @param {title} string               //상단제목없으면 노출안됨
 * @param {msg} string(html)           //메시지영역 노출 (html or)
 * @param {remsg}} string(html)           //메시지영역 노출 (html or)
 */
import React, {useRef, useContext, useEffect} from 'react'
import styled from 'styled-components'
//context
import {IMG_SERVER} from 'context/config'
import {Context} from 'context'
//hooks
import useClick from 'components/hooks/useClick'
//components
import Utility from 'components/lib/utility'
import {COLOR_MAIN} from 'context/color'
//
export default (props) => {
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
        if (mode.visible === false) context.action.alert({visible: false})
        if (context.message.visible === false) context.action.alert({visible: false})
        break
      case mode.callback !== undefined: //---------------------콜백처리
        //콜백
        if (mode.callback === 'confirm' && context.message.callback !== undefined) {
          context.message.callback()
        }
        context.action.alert({visible: false})
        break
    }
  }

  const btnClose = () => {
    if (context.message.btnCloseCallback !== undefined) {
      context.message.btnCloseCallback()
    }
    context.action.alert({visible: false})
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
    <Alert>
      <div className="wrap-message">
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
      <div className="wrap-btn">
        <button
          ref={refBtn}
          className="confirm"
          {...confirm}
          onKeyPress={(event) => {
            console.log(event)
          }}>
          {context.message.buttonMsg ? context.message.buttonMsg : '확인'}
        </button>
      </div>
    </Alert>
  )
}
//---------------------------------------------------------------------
const Alert = styled.section`
  position: relative;
  width: 100%;
  max-width: 328px;
  margin: 0px 16px;
  padding: 16px;
  border-radius: 20px;
  background: #fff;
  box-sizing: border-box;
  .wrap-message {
    width: 100%;
  }

  /* 타이틀 */
  h1 {
    display: block;
    text-align: center;
    font-size: 18px;
    padding-bottom: 12px;
    border-bottom: 1px solid #e0e0e0;
    color: #000;

    &.mobile {
      font-size: 14px;
      font-weight: bold;
      padding-bottom: 10px;
    }
  }
  /* 메시지 */
  .msg {
    font-size: 16px;
    padding: 16px 10px 0;
    min-height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.4;
    letter-spacing: -0.5px;
    word-break: keep-all;
    text-align: center;
    transform: skew(-0.03deg);
    color: #000;

    &.mobile {
      font-size: 13px;
      padding: 10px 0 0 0;
      text-align: left;
    }
  }

  .remsg {
    display: block;
    font-size: 22px;
    color: #632beb;
    line-height: 26px;
    text-align: center;
    margin-bottom: 8px;
  }

  .wrap-btn {
    width: 100%;
    padding-top: 16px;
    text-align: center;
    /* 버튼 */
    button {
      display: inline-block;
      font-size: 18px;
      font-weight: 700;
      width: 100%;
      padding: 10px 0;
      color: #fff;
      border-radius: 30px;
      height: 48px;
      border-radius: 10px;
      background-color: ${COLOR_MAIN};
    }
  }
  .btnClose {
    display: inline-block;
    position: absolute;
    top: -40px;
    right: 0px;
    img {
      width: 32px;
      height: 32px;
    }
  }
`
