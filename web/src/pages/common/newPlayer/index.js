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

export default props => {
  //---------------------------------------------------------------------
  //context
  const context = useContext(Context)
  //useState
  const [visible, setVisible] = useState(true)
  const [list, setList] = useState([])
  //---------------------------------------------------------------------
  function update(mode) {
    switch (true) {
      case mode.playerClose !== undefined: //--------------------------Player 종료
        sessionStorage.removeItem('room_no')
        Hybrid('ExitRoom', '')
        context.action.updatePlayer(false)
        break
      case mode.playerNavigator !== undefined: //----------------------방송방으로 이동
        //
        if (__NODE_ENV === 'dev') {
          const commonData = async obj => {
            const res = await Api.splash()
            if (res.result === 'success') {
              setList(res.data.roomState)
              alert(res.data)
            }
          }
          commonData()
          // setTimeout(() => {
          //   if (list !== 4) {
          //     alert('방송진입')
          //     setTimeout(() => {
          //       Hybrid('EnterRoom', '')
          //     }, 100)
          //   } else if (list === 4) {
          //     context.action.alert({
          //       callback: () => {},
          //       msg: '종료된 방송입니다^^^^..'
          //     })
          //   }
          // }, 200)
          // rest
        }

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
