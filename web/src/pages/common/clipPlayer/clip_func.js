import React from 'react'
//context
import {Hybrid, NewHybrid} from 'context/hybrid'
// etc
import Utility from 'components/lib/utility'
import {OS_TYPE} from 'context/config.js'
import Api from 'context/api'
import {
  setGlobalCtxClipPlayerState,
  setGlobalCtxClipState,
  setGlobalCtxMessage,
  setGlobalCtxPlayer
} from "../../../redux/actions/globalCtx";

export const clipJoin = (data, dispatch, globalState, webview, isPush) => {
  let totalData = {
    playing: data,
    playListData: {
      url: '',
      isPush: isPush === 'push'
    }
  }

  let playListData = JSON.parse(localStorage.getItem('clipPlayListInfo'))
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
        currentType = 'clip/main/top3/list?'
      } else {
        currentType = 'clip/main/pop/list?'
      }
    } else if (playListData.hasOwnProperty('memNo')) {
      if (playListData.hasOwnProperty('slctType')) {
        currentType = 'clip/listen/list?'
      } else {
        currentType = 'clip/upload/list?'
      }
    } else if (playListData.hasOwnProperty('recDate')) {
      currentType = 'clip/recommend/list?'
    } else if (playListData.hasOwnProperty('rankType')) {
      if(playListData.hasOwnProperty('callType')) {
        currentType = 'clip/rank/combine/list?'
      }else {
        currentType = 'clip/rank?'
      }
    } else {
      currentType = 'clip/list?'
    }

    url = currentType + url
    totalData = {
      ...totalData,
      playListData: {url: encodeURIComponent(url), isPush: isPush === 'push'}
    }
  }

  if (Utility.getCookie('listen_room_no') === undefined || Utility.getCookie('listen_room_no') === 'null') {
    // alert(webview)
    if (webview === 'new') {
      let prevClipNo = localStorage.getItem('play_clip_no')
      if (prevClipNo === data.clipNo) {
        return Hybrid('CloseLayerPopup')
      } else {
        return Hybrid('ClipPlayerJoin', totalData)
      }
    } else {
      if (sessionStorage.getItem('listening') === 'Y') {
        return dispatch(setGlobalCtxMessage({type: "alert",msg: '클립 재생 중 입니다.'}))
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
      return dispatch(setGlobalCtxMessage({type: "alert",msg: '방송 종료 후 청취 가능합니다. \n다시 시도해주세요.'}))
    } else {
      return dispatch(setGlobalCtxMessage({type: "confirm",
        msg: '현재 청취 중인 방송방이 있습니다.\n클립을 재생하시겠습니까?',
        callback: () => {
          clipExit(dispatch)
          sessionStorage.removeItem('room_no')
          Utility.setCookie('listen_room_no', null)
          Hybrid('ExitRoom', '')
          dispatch(setGlobalCtxPlayer(false))
          clipJoin(data, dispatch, globalState)
        }
      }))
    }
  }
}

export const clipExit = (dispatch) => {

  Utility.setCookie('clip-player-info', '', -1)
  Hybrid('ClipPlayerEnd')
  dispatch(setGlobalCtxClipState(null))
  dispatch(setGlobalCtxClipPlayerState(null))
  dispatch(setGlobalCtxPlayer(false))
}
export const clipReg = (type, dispatch, globalState) => {
  if (!globalState.token.isLogin) return (window.location.href = '/login')
  const text = type === 'upload' ? '업로드' : '녹음'
  if (Utility.getCookie('listen_room_no') === undefined || Utility.getCookie('listen_room_no') === 'null') {
    if (Utility.getCookie('clip-player-info')) {
      dispatch(setGlobalCtxMessage({type: "confirm",
        msg: `현재 재생 중인 클립이 있습니다.\n클립을 ${text}하시겠습니까?`,
        callback: () => {
          clipExit(dispatch)
          if (type === 'upload') {
            Hybrid('ClipUploadJoin')
          } else {
            Hybrid('EnterClipRecord')
          }
        }
      }))

    } else {
      if (type === 'upload') {
        Hybrid('ClipUploadJoin')
      } else {
        Hybrid('EnterClipRecord')
      }
    }
  } else {
    dispatch(setGlobalCtxMessage({type: "confirm",
      msg: `현재 청취 중인 방송방이 있습니다.\n클립을 ${text}하시겠습니까?`,
      callback: () => {
        sessionStorage.removeItem('room_no')
        Utility.setCookie('listen_room_no', null)
        Hybrid('ExitRoom', '')
        dispatch(setGlobalCtxPlayer(false))

        if (type === 'upload') {
          Hybrid('ClipUploadJoin')
        } else {
          Hybrid('EnterClipRecord')
        }
      }
    }))

  }
}

export const updateClipInfo = (data) => {
  Hybrid('ClipUpdateInfo', data)
}

export async function clipJoinApi(clipNum, dispatch, globalState) {
  const {result, data, message, code} = await Api.postClipPlay({
    clipNo: clipNum
  })
  if (result === 'success') {
    clipJoin(data, dispatch, globalState)
  } else {
    if (code === '-99') {
      dispatch(setGlobalCtxMessage({type: "alert",
        msg: message
      }))
    } else {
      dispatch(setGlobalCtxMessage({type: "alert",
        msg: message
      }))
    }
  }
}
