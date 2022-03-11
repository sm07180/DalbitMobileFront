import React from 'react'
//context
import {Hybrid, NewHybrid} from 'context/hybrid'
// etc
import Utility from 'components/lib/utility'
import {OS_TYPE} from 'context/config.js'
import Api from 'context/api'

export const clipJoin = (data, context, webview, isPush) => {
  let passAppbuild = false
  if (
    (context.customHeader['os'] === OS_TYPE['IOS'] && context.customHeader['appBuild'] >= 284) ||
    (context.customHeader['os'] === OS_TYPE['Android'] && context.customHeader['appBuild'] >= 52)
  ) {
    passAppbuild = true
  }
  let totalData = null
  if (passAppbuild) {
    totalData = {
      playing: data,
      playListData: {
        url: '',
        isPush: isPush === 'push' ? true : false
      }
    }
  } else {
    totalData = {
      playing: data,
      playListData: {
        param: '',
        type: '',
        isPush: isPush === 'push' ? true : false
      }
    }
  }

  let playListData = JSON.parse(sessionStorage.getItem('clipPlayListInfo'))
  let url = ''
  let currentType = ''
  if (playListData) {
    Object.keys(playListData).forEach((key, idx) => {
      if (idx === 0) {
        url = url + `${key}=${playListData[key]}`
      } else {
        url = url + `&${key}=${playListData[key]}`
      }
    })
    if (playListData.hasOwnProperty('listCnt')) {
      if (playListData.hasOwnProperty('subjectType')) {
        currentType = passAppbuild ? 'clip/main/top3/list?' : 'top3'
      } else {
        currentType = passAppbuild ? 'clip/main/pop/list?' : 'pop'
      }
    } else if (playListData.hasOwnProperty('memNo')) {
      if (playListData.hasOwnProperty('slctType')) {
        currentType = passAppbuild ? 'clip/listen/list?' : 'listen'
      } else {
        currentType = passAppbuild ? 'clip/upload/list?' : 'upload'
      }
    } else if (playListData.hasOwnProperty('recDate')) {
      currentType = 'clip/recommend/list?'
    } else if (playListData.hasOwnProperty('rankType')) {
      currentType = 'clip/rank?'
    } else {
      currentType = passAppbuild ? 'clip/list?' : 'list'
    }

    if (passAppbuild) {
      url = currentType + url
      totalData = {
        ...totalData,
        playListData: {url: encodeURIComponent(url), isPush: isPush === 'push' ? true : false}
      }
    } else {
      totalData = {
        ...totalData,
        playListData: {type: currentType, param: encodeURIComponent(url), isPush: isPush === 'push' ? true : false}
      }
    }

    console.log(totalData)
  }

  if (
    (context.customHeader['os'] === OS_TYPE['IOS'] && context.customHeader['appBuild'] < 207) ||
    (context.customHeader['os'] === OS_TYPE['Android'] && context.customHeader['appBuild'] < 39)
  ) {
    totalData = {...data}
  }

  console.log('totalData', totalData)

  if (Utility.getCookie('listen_room_no') === undefined || Utility.getCookie('listen_room_no') === 'null') {
    // alert(webview)
    if (webview === 'new') {
      let prevClipNo = localStorage.getItem('play_clip_no')
      if (prevClipNo === data.clipNo) {
        return Hybrid('CloseLayerPopup')
      } else {
        if (context.customHeader['os'] === OS_TYPE['IOS']) {
          return Hybrid('ClipPlayerJoin', totalData)
        } else {
          // return NewHybrid('ClipPlay', webview, data)
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
      if (context.customHeader['os'] === OS_TYPE['IOS']) {
        Hybrid('ClipPlayerJoin', totalData)
        // if (timer) {
        //   clearTimeout(timer)
        // }
        // timer = setTimeout(function () {
        //   return Hybrid('ClipPlayerJoin', totalData)
        // }, 400)
      } else {
        return Hybrid('ClipPlayerJoin', totalData)
      }
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
}

export const clipExit = (context) => {
  Utility.setCookie('clip-player-info', '', -1)
  Hybrid('ClipPlayerEnd')
  context.action.updateClipState(null)
  context.action.updateClipPlayerState(null)
  context.action.updatePlayer(false)
}
export const clipReg = (type, context) => {
  if (!context.token.isLogin) return (window.location.href = '/login')
  const text = type === 'upload' ? '업로드' : '녹음'
  if (Utility.getCookie('listen_room_no') === undefined || Utility.getCookie('listen_room_no') === 'null') {
    if (Utility.getCookie('clip-player-info')) {
      context.action.confirm({
        msg: `현재 재생 중인 클립이 있습니다.\n클립을 ${text}하시겠습니까?`,
        callback: () => {
          clipExit(context)
          if (type === 'upload') {
            Hybrid('ClipUploadJoin')
          } else {
            Hybrid('EnterClipRecord')
          }
        }
      })
    } else {
      if (type === 'upload') {
        Hybrid('ClipUploadJoin')
      } else {
        Hybrid('EnterClipRecord')
      }
    }
  } else {
    context.action.confirm({
      msg: `현재 청취 중인 방송방이 있습니다.\n클립을 ${text}하시겠습니까?`,
      callback: () => {
        sessionStorage.removeItem('room_no')
        Utility.setCookie('listen_room_no', null)
        Hybrid('ExitRoom', '')
        context.action.updatePlayer(false)
        if (type === 'upload') {
          Hybrid('ClipUploadJoin')
        } else {
          Hybrid('EnterClipRecord')
        }
      }
    })
  }
}

export const updateClipInfo = (data) => {
  Hybrid('ClipUpdateInfo', data)
}

export async function clipJoinApi(clipNum, context) {
  const {result, data, message, code} = await Api.postClipPlay({
    clipNo: clipNum
  })
  if (result === 'success') {
    clipJoin(data, context)
  } else {
    if (code === '-99') {
      context.action.alert({
        msg: message
      })
    } else {
      context.action.alert({
        msg: message
      })
    }
  }
}
