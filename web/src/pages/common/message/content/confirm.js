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
import styled from 'styled-components'
import _ from 'lodash'
//context
import {IMG_SERVER} from 'context/config'
import {Context} from 'context'
//hooks
import useClick from 'components/hooks/useClick'
//components
import Utility from 'components/lib/utility'
//
export default props => {
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
        if (mode.visible === false) context.action.alert({visible: false})
        break
      case mode.callback !== undefined: //---------------------콜백처리
        //콜백
        if (mode.callback === 'confirm' && context.message.callback !== undefined) {
          context.message.callback()
        }
        //캔슬콜백(취소)
        if (mode.callback === 'cancel' && context.message.cancelCallback !== undefined) {
          context.message.cancelCallback()
        }
        context.action.alert({visible: false})
        break
    }
  }
  //useEffect
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    refBtn.current.focus()
  }, [])
  //---------------------------------------------------------------------
  return (
    <Alert>
      <Close {...cancel}>
        <img src={`${IMG_SERVER}/images/common/ic_close_m@2x.png`} />
      </Close>
      <div className="wrap-message">
        {context.message.title && <h1 dangerouslySetInnerHTML={{__html: Utility.nl2br(context.message.title)}}></h1>}
        <p className="msg" dangerouslySetInnerHTML={{__html: Utility.nl2br(context.message.msg)}}></p>
      </div>
      <div className="wrap-btn">
        <button ref={refBtn} className="cancel" {...cancel}>
          {cancelText}
        </button>
        <button className="confirm" {...confirm}>
          {confirmText}
        </button>
      </div>
    </Alert>
  )
}
//---------------------------------------------------------------------
const Alert = styled.section`
  position: relative;
  min-width: 300px;
  max-width: 400px;
  padding: 5px;
  border-radius: 10px;
  background: #fff;
  border: 1px solid #ccc;
  box-sizing: border-box;
  .wrap-message {
    width: 100%;
  }
  .wrap-btn {
    display: flex;
    /* margin-top: 20px; */
    text-align: center;
  }
  /* 타이틀 */
  h1 {
    display: block;
    text-align: center;
    font-weight: normal;
  }
  /* 메시지 */
  .msg {
    padding: 38px 20px;
    font-size: 14px;

    line-height: 1.71;
    letter-spacing: -0.35px;
    word-break: break-all;
    text-align: center;
    transform: skew(-0.03deg);
    em {
      font-weight: 600;
      font-style: normal;
      color: #616161;
    }
  }

  /* 버튼 */
  button {
    flex: 1;
    padding: 5px 0;
    color: #fff;
    height: 48px;
    border-radius: 10px;
    background-color: #8555f6;
    /* 취소 */
    &:nth-child(odd) {
      margin-right: 4px;
      border: 1px solid #632beb;
      color: #632beb;
      background: #fff;
    }
    /* 확인 */
    &:nth-child(even) {
      margin-left: 4px;
    }
  }
`
const Close = styled.a`
  display: inline-block;
  position: absolute;
  top: -35px;
  right: 0;
  cursor: pointer;
  img {
    width: 36px;
    height: 36px;
  }
`
