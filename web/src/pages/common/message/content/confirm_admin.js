/**
 * @file confirm.js
 * @brief confirm 기능과 가능 확인버튼1개의 레이어팝업
 * @use context.action.confirm_admin({})
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
import {COLOR_MAIN} from 'context/color'
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
      return '시청자 모드'
    }
  })
  const confirmText = useMemo(() => {
    if (_.hasIn(context.message, 'buttonText.right')) {
      return context.message.buttonText.right
    } else {
      return '관리자 모드'
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
      <button className="btnClose">
        <img src={`${IMG_SERVER}/images/common/ic_close_gray@2x.png`} onClick={btnClose} />
      </button>
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
  width: 320px;
  padding: 16px;
  border-radius: 10px;
  background: #fff;
  /* border: 1px solid #ccc; */
  box-sizing: border-box;
  .wrap-message {
    width: 100%;
  }
  /* 타이틀 */
  h1 {
    display: block;
    text-align: center;
    font-weight: normal;
  }
  /* 메시지 */
  .msg {
    padding: 38px 20px 20px;
    font-size: 16px;
    line-height: 1.4;
    letter-spacing: -0.5px;
    word-break: keep-all;
    text-align: center;
    transform: skew(-0.03deg);

    em {
      font-size: 16px;
      font-weight: 600;
      font-style: normal;
      color: #000;
    }
    strong {
      display: block;
      margin-top: 4px;
      font-size: 22px;
      font-weight: bold;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.5;
      letter-spacing: normal;
      text-align: center;
      color: ${COLOR_MAIN};
    }
  }

  .wrap-btn {
    display: flex;
    /* margin-top: 20px; */
    text-align: center;
    button {
      flex: 1;
      padding: 5px 0;
      color: #fff;
      height: 44px;
      border-radius: 10px;
      background-color: ${COLOR_MAIN};
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
  }
  .btnClose {
    display: inline-block;
    position: absolute;
    top: 2px;
    right: 2px;
    cursor: pointer;
    z-index: 1;
    img {
      width: 40px;
      height: 40px;
    }
    .purpleColor {
      font-size: 22px;
      font-weight: bold;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.5;
      letter-spacing: normal;
      text-align: center;
      color: ${COLOR_MAIN};
    }
  }
`
