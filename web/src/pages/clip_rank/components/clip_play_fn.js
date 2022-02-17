import React from 'react'
import Api from 'context/api'
import {OS_TYPE} from 'context/config'
import {clipJoin} from 'pages/common/clipPlayer/clip_func'
import {setGlobalCtxMessage, setGlobalCtxUpdatePopup} from "redux/actions/globalCtx";

export async function ClipPlay(clipNum, dispatch, globalState, history) {
  if (JSON.parse(Api.customHeader)['os'] === OS_TYPE['Desktop']) {
    if (globalState.token.isLogin === false) {
      globalState.action.alert({
        msg: '해당 서비스를 위해<br/>로그인을 해주세요.',
        callback: () => {
          history.push('/login')
        }
      })
    } else {
      dispatch(setGlobalCtxUpdatePopup({popup:['APPDOWN', 'appDownAlrt', 4]}));
    }
  } else {
    const {result, data, message, code} = await Api.postClipPlay({
      clipNo: clipNum
    })
    if (result === 'success') {
      if (
        (globalState.customHeader['os'] === OS_TYPE['IOS'] && globalState.customHeader['appBuild'] < 284) ||
        (globalState.customHeader['os'] === OS_TYPE['Android'] && globalState.customHeader['appBuild'] < 52)
      ) {
        localStorage.removeItem('clipPlayListInfo')
      }
      clipJoin(data, dispatch, globalState)
    } else {
      if (code === '-99') {
        dispatch(setGlobalCtxMessage({
          type:"alert",
          msg: message,
          callback: () => {
            history.push('/login')
          }
        }))
      } else {
        dispatch(setGlobalCtxMessage({
          type:"alert",
          msg: message,
        }))
      }
    }
  }
}
