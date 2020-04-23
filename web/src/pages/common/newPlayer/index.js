/**
 *
 * @code context.action.updateMediaPlayerStatus(true)
 */
import React, {useState, useContext} from 'react'
import _ from 'lodash'
//context
import {Context} from 'context'
import {Hybrid} from 'context/hybrid'
// etc
import Content from './content'

export default (props) => {
  //---------------------------------------------------------------------
  //context
  const context = useContext(Context)
  //useState
  const [visible, setVisible] = useState(true)
  //---------------------------------------------------------------------
  function update(mode) {
    switch (true) {
      case mode.playerClose !== undefined: //--------------------------Player 종료
        sessionStorage.removeItem('room_no')
        Hybrid('ExitRoom', '')
        context.action.updatePlayer(false)
        break
      case mode.playerNavigator !== undefined: //----------------------방송방으로 이동
        Hybrid('EnterRoom', '')
        break
      case mode.playerRemove !== undefined: //-------------------------방송방 제거
        setVisible(mode.playerRemove)
        break
      default:
        break
    }
  }
  //
  /**
   * @brief 로그인,이벤트처리핸들러
   */

  //---------------------------------------------------------------------
  return (
    <React.Fragment>
      {/* 미디어 플레이어 */}
      {context.player && visible && <Content {...props} update={update} />}
    </React.Fragment>
  )
}
