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
import Api from 'context/api'

export default props => {
  //---------------------------------------------------------------------
  //context
  const context = useContext(Context)
  //useState
  const [visible, setVisible] = useState(true)
  const [RoomNo, setRoomNo] = useState('')
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
          // const commonData = async obj => {
          //   const res = await Api.broad_list()
          //   if (res.result === 'success') {
          //     if (res.data.list.state === '4') {
          //       alert(res.data.list.state, '종료된 방송입니다.')
          //     } else {
          //       Hybrid('EnterRoom', '')
          //     }
          //   }
          let roomNo = sessionStorage.getItem('room_no')

          const res = await Api.broad_join({data: {roomNo}})
          const {code, result, data} = res
  
          if (code === '-3') {
            alert("종료다");
          }
        //   if (code === '-3') {
        //     context.action.alert({
        //     msg: '종료된 방송입니다0.',
        //     callback: () => {
        //       sessionStorage.removeItem('room_no')
        //       setTimeout(() => {
        //         window.location.href ='/'
        //       }, 100);
        //     }
        //   })
        // }else {
        //   Hybrid('EnterRoom', '')
        // }
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
