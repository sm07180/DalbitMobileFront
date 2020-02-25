/**
 *
 */
import React, {useContext} from 'react'
import styled from 'styled-components'
//context
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
  const confirm = useClick(update, {visible: false})
  //---------------------------------------------------------------------
  //공통함수
  function update(mode) {
    switch (true) {
      case mode.visible !== undefined:
        //팝업닫기
        if (mode.visible === false) context.action.alert({visible: false})
        //콜백
        if (context.message.callback !== undefined) {
          context.message.callback()
        }
        break
    }
  }
  //---------------------------------------------------------------------
  return (
    <Alert>
      <div className="wrap-message">
        <h1 dangerouslySetInnerHTML={{__html: Utility.nl2br(context.message.title)}}></h1>
        <p className="msg" dangerouslySetInnerHTML={{__html: Utility.nl2br(context.message.msg)}}></p>
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
  min-width: 300px;
  max-width: 400px;
  padding: 5px;
  border-radius: 10px;
  background: #fff;
  border: 1px solid #ccc;
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
    margin-bottom: 30px;
    text-align: center;
    font-weight: normal;
  }
  /* 메시지 */
  .msg {
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
