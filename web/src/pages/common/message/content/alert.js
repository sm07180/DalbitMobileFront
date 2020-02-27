/**
 * @file alert.js
 * @brief alert 기능과 가능 확인버튼1개의 레이어팝업
 * @use context.action.alert({})
 * @todo
 * @param {callback} function          //콜백처리받을 함수명(확인하기 클릭시)
 * @param {title} string               //상단제목없으면 노출안됨
 * @param {msg} string(html)           //메시지영역 노출 (html or)
 */
import React, {useContext} from 'react'
import styled from 'styled-components'
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
  //---------------------------------------------------------------------
  return (
    <Alert>
      <Close {...cancel}>
        <img src={`${IMG_SERVER}/images/common/ic_close_m@2x.png`} />
      </Close>
      <div className="wrap-message">
        {/* 타이틀 */}
        {context.message.title && <h1 dangerouslySetInnerHTML={{__html: Utility.nl2br(context.message.title)}}></h1>}
        {/* 메시지 */}
        {context.message.msg && <p className="msg" dangerouslySetInnerHTML={{__html: Utility.nl2br(context.message.msg)}}></p>}
      </div>
      <div className="wrap-btn">
        <button className="confirm" {...confirm}>
          확인
        </button>
      </div>
    </Alert>
  )
}
//---------------------------------------------------------------------
const Alert = styled.section`
  position: relative;
  min-width: 300px;
  max-width: 500px;
  padding: 5px;
  border-radius: 10px;
  background: #fff;
  box-sizing: border-box;
  .wrap-message {
    width: 100%;
    padding-top: 20px;
  }
  .wrap-btn {
    width: 100%;
    margin-top: 20px;
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
    padding: 62px 63px;
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.71;
    letter-spacing: -0.35px;
    word-break: break-all;
    text-align: center;
  }

  /* 버튼 */
  button {
    display: inline-block;
    width: 100%;
    padding: 10px 0;
    color: #fff;
    border-radius: 30px;
    height: 48px;
    border-radius: 10px;
    background-color: #8555f6;
  }
`
const Close = styled.a`
  display: inline-block;
  position: absolute;
  top: -35px;
  right: 0;
  img {
    width: 36px;
    height: 36px;
  }
`
