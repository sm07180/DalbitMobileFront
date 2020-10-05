import React from 'react'
//context
import {Hybrid, NewHybrid} from 'context/hybrid'
// etc
import Utility from 'components/lib/utility'

export const clipJoin = (data, context, webview) => {
  if (Utility.getCookie('listen_room_no') === undefined || Utility.getCookie('listen_room_no') === 'null') {
    alert(webview)
    if (webview === 'new') {
      alert(Utility.getCookie('clip-player-info'))
      let prevClipNo = JSON.parse(Utility.getCookie('clip-player-info'))
      prevClipNo = prevClipNo.clipNo
      alert(prevClipNo)
      if (prevClipNo === data.clipNo) {
        return Hybrid('CloseLayerPopup')
      } else {
        if (customHeader['os'] === OS_TYPE['IOS']) {
          return Hybrid('ClipPlayerJoin', data)
        } else {
          return NewHybrid('ClipPlay', type, data)
        }
      }
    } else {
      return Hybrid('ClipPlayerJoin', data)
    }
  } else {
    return context.action.confirm({
      msg: '현재 청취 중인 방송방이 있습니다.\n클립을 재생하시겠습니까?',
      callback: () => {
        clipExit(context)
        sessionStorage.removeItem('room_no')
        Utility.setCookie('listen_room_no', null)
        Hybrid('ExitRoom', '')
        context.action.updatePlayer(false)
        clipJoin(data, context)
      }
    })
  }
}

export const clipExit = (context) => {
  Utility.setCookie('clip-player-info', '', -1)
  Hybrid('ClipPlayerEnd')
  context.action.updateClipState(null)
  context.action.updateClipPlayerState(null)
  context.action.updatePlayer(false)
}

export const updateClipInfo = (data) => {
  Hybrid('ClipUpdateInfo', data)
}
