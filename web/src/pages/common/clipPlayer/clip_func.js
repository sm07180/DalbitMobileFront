import React from 'react'
//context
import {Hybrid} from 'context/hybrid'
// etc
import Utility from 'components/lib/utility'

export const clipJoin = (data, context) => {
  // alert(context.player)
  // alert(context.clipState)
  // if (!context.player && context.clipState) {
  //   return context.action.alert({
  //     msg: '현재 청취 중인 클립이 있습니다.'
  //   })
  // }

  if (Utility.getCookie('listen_room_no') === undefined || Utility.getCookie('listen_room_no') === 'null') {
    // clipExit(context)

    Hybrid('ClipPlayerJoin', data)
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
  Hybrid('ClipFloatingControl', 'CLIP_FINISH')
  Utility.setCookie('clip-player-info', '', -1)
  context.action.updateClipState(null)
  context.action.updateClipPlayerState(null)
  context.action.updatePlayer(false)
}

export const updateClipInfo = (data) => {
  Hybrid('ClipUpdateInfo', data)
}
