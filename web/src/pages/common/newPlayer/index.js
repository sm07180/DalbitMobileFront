/**
 *
 * @code context.action.updateMediaPlayerStatus(true)
 */
import React, {useMemo, useEffect, useContext} from 'react'
import _ from 'lodash'
//context
import {Context} from 'context'
import {isHybrid, Hybrid} from 'context/hybrid'
// etc
import SignalingHandler from 'components/lib/SignalingHandler'
import Content from './content'
import qs from 'query-string'
const sc = require('context/socketCluster') //socketCluster

export default props => {
  //---------------------------------------------------------------------
  //context

  const context = useContext(Context)

  //---------------------------------------------------------------------
  function update(mode) {
    switch (true) {
      case mode.playerClose !== undefined: //--------------------------Player 종료
        Hybrid('ExitRoom', '')
        context.action.updatePlayer(false)
        break
      case mode.playerNavigator !== undefined: //----------------------방송방으로 이동
        Hybrid('EnterRoom', '')
        break
      default:
        break
    }
  }
  /**
   * @brief 로그인,이벤트처리핸들러
   */

  //---------------------------------------------------------------------
  return (
    <React.Fragment>
      {/* 미디어 플레이어 */}
      {context.player && <Content {...props} update={update} />}
    </React.Fragment>
  )
}
