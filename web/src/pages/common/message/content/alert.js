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
  //makeContents
  const makeContents = () => {
    if (context.message.visible) {
    }
  }

  //---------------------------------------------------------------------
  return (
    <Alert>
      <p>{context.message.msg}</p>
      <button {...confirm}>확인</button>
    </Alert>
  )
}
//---------------------------------------------------------------------

const Alert = styled.section`
  padding: 20px 30px;
  background: #fff;
  border: 1px solid #111;
`
