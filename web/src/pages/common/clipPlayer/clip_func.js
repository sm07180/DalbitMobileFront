import React from 'react'
//context
import {Hybrid, NewHybrid} from 'context/hybrid'
// etc
import Utility from 'components/lib/utility'
import {OS_TYPE} from 'context/config.js'
import Api from 'context/api'

export const clipJoin = (data, context, webview) => {
  if (
    Utility.getCookie('listen_room_no') === undefined ||
    Utility.getCookie('listen_room_no') === 'null' ||
    Utility.getCookie('listen_room_no') === ''
  ) {
    console.log(sessionStorage.getItem('clip_active'))
    if (sessionStorage.getItem('clip_active') === 'N') {
      console.log('중복클릭')
      context.action.alert({
        msg: '클립 재생중입니다.\n 잠시만 기다려주세요.'
      })
      return false
    } else {
      sessionStorage.setItem('clip_active', 'N')
    }

    if (webview === 'new') {
      let prevClipNo = JSON.parse(Utility.getCookie('clip-player-info'))
      prevClipNo = prevClipNo.clipNo
      if (prevClipNo === data.clipNo) {
        return Hybrid('CloseLayerPopup')
      } else {
        if (context.customHeader['os'] === OS_TYPE['IOS']) {
          return Hybrid('ClipPlayerJoin', data)
        } else {
          return Hybrid('ClipPlayerJoin', data)
        }
      }
    } else {
      clipExit(context)
      context.action.alert({visible: false})
      return Hybrid('ClipPlayerJoin', data)
      // if (Utility.getCookie('clip-player-info') !== undefined) {
      //   let prevClipNo = JSON.parse(Utility.getCookie('clip-player-info'))
      //   prevClipNo = prevClipNo.clipNo
      //   if (prevClipNo === data.clipNo) {
      //     context.action.alert({visible: false})
      //     return Hybrid('ClipPlayerJoin', data)
      //   } else {
      //     clipExit(context)
      //     context.action.alert({visible: false})
      //     return Hybrid('ClipPlayerJoin', data)
      //   }
      // } else {
      //   clipExit(context)
      //   context.action.alert({visible: false})
      //   return Hybrid('ClipPlayerJoin', data)
      // }
    }
  } else {
    if (webview === 'new') {
      return context.action.alert({
        msg: '현재 방송 청취 중입니다.'
      })
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
}

export const clipExit = (context) => {
  Utility.setCookie('clip-player-info', '', -1)
  Hybrid('ClipPlayerEnd')
  context.action.updateClipState(null)
  context.action.updateClipPlayerState(null)
  context.action.updatePlayer(false)
  sessionStorage.removeItem('clip_active')
}

export const updateClipInfo = (data) => {
  Hybrid('ClipUpdateInfo', data)
}
