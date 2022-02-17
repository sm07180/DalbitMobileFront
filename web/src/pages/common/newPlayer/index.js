/**
 *
 * @code context.action.updateMediaPlayerStatus(true)
 */
import React, {useState} from 'react'
//context
import {Hybrid} from 'context/hybrid'
// etc
import Content from './content'
import Utility from 'components/lib/utility'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxPlayer} from "redux/actions/globalCtx";

export default (props) => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  //useState
  const [visible, setVisible] = useState(true)

  //---------------------------------------------------------------------
  function update(mode) {
    switch (true) {
      case mode.playerClose !== undefined: //--------------------------Player 종료
        sessionStorage.removeItem('room_no')
        Utility.setCookie('listen_room_no', null)
        Hybrid('ExitRoom', '')
        dispatch(setGlobalCtxPlayer(false));
        break
      case mode.playerNavigator !== undefined: //----------------------방송방으로 이동
        // let roomNo = sessionStorage.getItem('room_no')
        // async function commonJoin() {
        //   const res = await Api.broad_join_vw({data: {roomNo}})
        //   const {code, result, data} = res

        //   if (code === '-3') {
        //     context.action.alert({
        //       msg: '종료된 방송입니다.',
        //       callback: () => {
        //         sessionStorage.removeItem('room_no')
        //         Utility.setCookie('listen_room_no', null)
        //         context.action.updatePlayer(false)
        //         setTimeout(() => {
        //           window.location.href = '/'
        //         }, 100)
        //       }
        //     })
        //   } else {
        //     Hybrid('EnterRoom', '')
        //   }
        // }
        // commonJoin()
        if (Utility.getCookie('listen_room_no')) Hybrid('EnterRoom', '')
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
      {globalState.nativePlayer && globalState.player && visible && <Content {...props} update={update}/>}
      {/* <Content {...props} update={update} /> */}
    </React.Fragment>
  )
}
