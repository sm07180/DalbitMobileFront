import React from 'react'
import Api from 'context/api'
import {OS_TYPE} from 'context/config'
import {clipJoin} from 'pages/common/clipPlayer/clip_func'
import {setGlobalCtxMessage, setGlobalCtxUpdatePopup} from "../../../redux/actions/globalCtx";

export async function ClipPlayFn(clipNum, type, globalState, dispatch, history) {
  if (JSON.parse(Api.customHeader)['os'] === OS_TYPE['Desktop']) {
    dispatch(setGlobalCtxUpdatePopup({popup: ['APPDOWN', 'appDownAlrt', 4]}));
  } else {
    if (globalState.token.isLogin === false) {

      return dispatch(setGlobalCtxMessage({
        type: "alert",
        msg: '해당 서비스를 위해<br/>로그인을 해주세요.',
        callback: () => {
          history.push('/login?redirect=/clip_recommend')
        }
      }))
    }
    const {result, data, message, code} = await Api.postClipPlay({
      clipNo: clipNum
    })
    if (result === 'success') {
      if (type === 'dal') {
        localStorage.removeItem('clipPlayListInfo')
      } else {
        const playListInfoData = {
          recDate: globalState.dateState,
          isLogin: true,
          isClick: true
        }
        localStorage.setItem('clipPlayListInfo', JSON.stringify(playListInfoData))
      }

      clipJoin(data, dispatch, globalState)
    } else {
      if (code === '-99') {
        dispatch(setGlobalCtxMessage({
          type: "alert",
          msg: message,
          callback: () => {
            history.push('/login?redirect=/clip_recommend');
          }
        }))
      } else {
        dispatch(setGlobalCtxMessage({
          type: "alert",
          msg: message
        }))
      }
    }
  }
}
