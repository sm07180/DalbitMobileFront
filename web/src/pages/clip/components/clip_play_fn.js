import React from 'react'
import Api from 'context/api'
import {OS_TYPE} from 'context/config'
import {clipJoin} from 'pages/common/clipPlayer/clip_func'

export async function ClipPlayFn(clipNum, type, context, history) {
  if (JSON.parse(Api.customHeader)['os'] === OS_TYPE['Desktop']) {
    context.action.updatePopup('APPDOWN', 'appDownAlrt', 4)
  } else {
    if (context.token.isLogin === false) {
      return context.action.alert({
        msg: '해당 서비스를 위해<br/>로그인을 해주세요.',
        callback: () => {
          history.push('/login?redirect=/clip_recommend')
        }
      })
    }
    const {result, data, message, code} = await Api.postClipPlay({
      clipNo: clipNum
    })
    if (result === 'success') {
/*      if (type === 'dal') {
        localStorage.removeItem('clipPlayListInfo')
      } else {
        const playListInfoData = {
          recDate: context.dateState,
          isLogin: true,
          isClick: true
        }
        localStorage.setItem('clipPlayListInfo', JSON.stringify(playListInfoData))
      }*/

      clipJoin(data, context)
    } else {
      if (code === '-99') {
        context.action.alert({
          msg: message,
          callback: () => {
            history.push('/login?redirect=/clip_recommend');
          }
        })
      } else {
        context.action.alert({
          msg: message
        })
      }
    }
  }
}
