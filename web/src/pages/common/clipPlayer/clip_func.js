import React from 'react'
//context
import {Hybrid} from 'context/hybrid'
// etc
import Utility from 'components/lib/utility'

export const clipJoin = (data, context) => {
  if (Utility.getCookie('listen_room_no') === undefined || Utility.getCookie('listen_room_no') === 'null') {
    alert('1')
    clipExit(context)
    alert('6')
    Hybrid('ClipPlayerJoin', data)
    alert('7')
  } else {
    context.action.confirm({
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
  alert('2')
  Hybrid('ClipPlayerEnd')
  alert('3')
  Utility.setCookie('clip-player-info', '', -1)
  context.action.updateClipState(null)
  context.action.updateClipPlayerState(null)
  context.action.updateClipState(null)
  context.action.updatePlayer(false)
  alert('4')
  alert('5')
}

export const updateClipInfo = (data) => {
  Hybrid('ClipUpdateInfo', data)
}
