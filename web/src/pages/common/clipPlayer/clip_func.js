import React from 'react'
//context
import {Hybrid} from 'context/hybrid'
// etc
import Utility from 'components/lib/utility'

export const clipJoin = (data, context) => {
  //방송방 쿠키 있으면 삭제 후 조인
  if (Utility.setCookie('listen_room_no')) {
    sessionStorage.removeItem('room_no')
    Utility.setCookie('listen_room_no', null)
    Hybrid('ExitRoom', '')
    context.action.updatePlayer(false)
  }
  Hybrid('ClipPlayerJoin', data)
  context.action.updateClipState(true)
  context.action.updateClipPlayerState('playing')
  context.action.updateClipPlayerInfo({
    bgImg: data.bgImg.url,
    title: data.title,
    nickname: data.nickName
  })
}

export const clipExit = (context) => {
  Hybrid('ClipPlayerEnd')
  Utility.setCookie('clip-player-info', '', -1)
  context.action.updateClipState(null)
  context.action.updateClipPlayerState(null)
  context.action.updateClipState(null)
}
