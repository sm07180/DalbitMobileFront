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
import React, {useEffect, useMemo, useRef} from 'react'
import styled from 'styled-components'
import _ from 'lodash'
//context
import {IMG_SERVER} from 'context/config'
//hooks
import useClick from 'components/hooks/useClick'
//components
import Utility from 'components/lib/utility'
import {COLOR_MAIN} from 'context/color'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";
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
      return '시청자 모드'
    }
  })
  const confirmText = useMemo(() => {
    if (_.hasIn(globalState.message, 'buttonText.right')) {
      return globalState.message.buttonText.right
    } else {
      return '관리자 모드'
    }
  })
  //---------------------------------------------------------------------
  //공통함수
  function update(mode) {
    switch (true) {
      case mode.visible !== undefined: //----------------------팝업닫기
        sessionStorage.removeItem('room_active')
        if (mode.visible === false) dispatch(setGlobalCtxMessage({type: "alert", visible: false}))
        break
      case mode.callback !== undefined: //---------------------콜백처리
        //콜백
        dispatch(setGlobalCtxMessage({type: "alert", visible: false}))
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
    sessionStorage.removeItem('room_active')
    dispatch(setGlobalCtxMessage({type: "alert", visible: false}))
  }
  //useEffect
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    refBtn.current.focus()
    return () => {
      document.body.style.overflow = ''
      if(globalState.adminChecker) {
        sessionStorage.removeItem('room_active')
      }
    }
  }, [])
  //---------------------------------------------------------------------
  return (
    <Alert>
      <button className="btnClose">
        <img src={`${IMG_SERVER}/images/api/close_w_l.svg`} onClick={btnClose}/>
      </button>
      <div className="wrap-message">
        {globalState.message.title &&
        <h1 dangerouslySetInnerHTML={{__html: Utility.nl2br(globalState.message.title)}}></h1>}
        <p className="msg" dangerouslySetInnerHTML={{__html: Utility.nl2br(globalState.message.msg)}}></p>
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
  width: 100%;
  max-width: 328px;
  margin: 0px 16px;
  padding: 16px;
  border-radius: 20px;
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
    font-size: 18px;
    padding-bottom: 12px;
    border-bottom: 1px solid #e0e0e0;
    color: #000;
  }
  /* 메시지 */
  .msg {
    font-size: 16px;
    padding: 16px 10px 0;
    min-height: 80px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    line-height: 1.4;
    letter-spacing: -0.5px;
    word-break: keep-all;
    text-align: center;
    transform: skew(-0.03deg);
    color: #000;

    em {
      font-size: 16px;
      font-weight: 600;
      font-style: normal;
      color: #000;
    }
    strong {
      display: block;
      width: 100% !important;
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

  .remsg {
    display: block;
    font-size: 22px;
    color: #FF3C7B;
    line-height: 26px;
    text-align: center;
    margin-bottom: 8px;
  }

  .wrap-btn {
    display: flex;
    padding-top: 16px;
    /* margin-top: 20px; */
    text-align: center;
    button {
      flex: 1;
      padding: 5px 0;
      color: #fff;
      height: 44px;
      border-radius: 12px;
      background-color: ${COLOR_MAIN};
      font-size: 18px;
      font-weight: 700;
      /* 취소 */
      &:nth-child(odd) {
        margin-right: 4px;
        background: #757575;
      }
      /* 확인 */
    }
  }
  .btnClose {
    display: inline-block;
    position: absolute;
    top: -40px;
    right: 0px;

    cursor: pointer;
    z-index: 1;
    img {
      width: 32px;
      height: 32px;
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
