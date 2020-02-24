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
  return <Message>{makeContents(context.message.visible)}</Message>
}
//---------------------------------------------------------------------
const Message = styled.section`
  display: inline-block;
  position: absolute;
  left: 50%;
  top: 30%;
  transform: translate(-50%, -50%);
  z-index: 80;
`
