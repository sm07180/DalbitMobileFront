import React from 'react'
//context
import {Hybrid, NewHybrid} from 'context/hybrid'
// etc
import Utility from 'components/lib/utility'
import {OS_TYPE} from 'context/config.js'
import Api from 'context/api'

export const clipJoin = (data, context, webview) => {
  // console.log('1' + sessionStorage.getItem('listening'))

  let totalData = {playing: data.clipNo}

  const fetchPlayList = async () => {
    const {result, data, message} = await Api.getPlayList({
      params: {
        sortType: 0,
        records: 100
      }
    })
    if (result === 'success') {
      const playListClipNo = data.list.map((item) => {
        return item.clipNo
      })
      totalData = {...totalData, list: playListClipNo}
      console.log(totalData)

      if (Utility.getCookie('listen_room_no') === undefined || Utility.getCookie('listen_room_no') === 'null') {
        if (webview === 'new') {
          let prevClipNo = JSON.parse(Utility.getCookie('clip-player-info'))
          prevClipNo = prevClipNo.clipNo
          if (prevClipNo === data.clipNo) {
            return Hybrid('CloseLayerPopup')
          } else {
            if (context.customHeader['os'] === OS_TYPE['IOS']) {
              return Hybrid('ClipPlayerJoin', totalData)
            } else {
              // return NewHybrid('ClipPlay', webview, totalData)
              return Hybrid('ClipPlayerJoin', totalData)
            }
          }
        } else {
          if (sessionStorage.getItem('listening') === 'Y') {
            return context.action.alert({msg: '클립 재생 중 입니다.'})
          }
          sessionStorage.setItem('listening', 'Y')
          let prevClipNo
          if (Utility.getCookie('clip-player-info')) {
            prevClipNo = JSON.parse(Utility.getCookie('clip-player-info'))
            prevClipNo = prevClipNo.clipNo
            // console.log(prevClipNo, data.clipNo)
            if (prevClipNo === data.clipNo) {
              // console.log('같은곡')
              sessionStorage.setItem('listening', 'N')
            } else {
              // console.log('틀린곡')
              sessionStorage.setItem('listening', 'Y')
            }
            // console.log('2' + sessionStorage.getItem('listening'))
          }

          return Hybrid('ClipPlayerJoin', totalData)
        }
      } else {
        if (webview === 'new') {
          return context.action.alert({msg: '방송 종료 후 청취 가능합니다. \n다시 시도해주세요.'})
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
    } else {
      context.action.alert({msg: message})
    }
  }

  fetchPlayList()
}

export const clipExit = (context) => {
  Utility.setCookie('clip-player-info', '', -1)
  Hybrid('ClipPlayerEnd')
  context.action.updateClipState(null)
  context.action.updateClipPlayerState(null)
  context.action.updatePlayer(false)
}

export const updateClipInfo = (data) => {
  Hybrid('ClipUpdateInfo', totalData)
}
