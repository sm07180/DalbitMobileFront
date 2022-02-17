import React from 'react'
//context
import {Hybrid} from 'context/hybrid'
// etc
import Utility from 'components/lib/utility'
import {clipExit} from 'pages/common/clipPlayer/clip_func'
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

export const BeforeLogout = (dispatch, fetch) => {
  if (Utility.getCookie('listen_room_no') === undefined || Utility.getCookie('listen_room_no') === 'null') {
    if (Utility.getCookie('clip-player-info')) {
      dispatch(setGlobalCtxMessage({type:"confirm",
        callback: () => {
          clipExit()
          setTimeout(() => {
            fetch()
          }, 300)
        },
        msg: '청취 중인 클립이 있습니다 \n 로그아웃 하시겠습니까?'
      }))
    } else {
      dispatch(setGlobalCtxMessage({type:"confirm",
        callback: () => {
          fetch()
        },
        msg: '로그아웃 하시겠습니까?'
      }))
    }
  } else {
    dispatch(setGlobalCtxMessage({type:"confirm",
      callback: () => {
        sessionStorage.removeItem('room_no')
        Utility.setCookie('listen_room_no', null)
        Utility.setCookie('listen_room_no', null)
        Hybrid('ExitRoom', '')
        Utility.setCookie('native-player-info', '', -1)
        context.action.updatePlayer(false)
        setTimeout(() => {
          fetch()
        }, 300)
      },
      msg: '청취 중인 방송이 있습니다 \n 로그아웃 하시겠습니까?'
    }))
  }
}
