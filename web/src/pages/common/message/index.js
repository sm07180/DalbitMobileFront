/**
 *
 */
import React, {useContext} from 'react'
import styled from 'styled-components'
//context
import {Context} from 'context'
//components
import Utility from 'components/lib/utility'
import Alert from './content/alert'
import Confirm from './content/confirm'

export default props => {
  //---------------------------------------------------------------------
  //context
  const context = useContext(Context)
  /**
   * @brief 로그인,이벤트처리핸들러
   */

  //makeContents
  const makeContents = visible => {
    /**
     * @visible true
     */
    switch (visible) {
      case true:
        if (context.message.type === 'alert') return <Alert />
        if (context.message.type === 'confirm') return <Confirm />
        break
      case false:
        break
    }
  }
  //---------------------------------------------------------------------
  return <React.Fragment>{context.message.visible && <Message>{makeContents(context.message.visible)}</Message>}</React.Fragment>
}
//---------------------------------------------------------------------
const Message = styled.section`
  display: flex;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.7);
  z-index: 120;
`
