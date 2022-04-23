import React from 'react'
import Api from 'context/api'
import {OS_TYPE} from 'context/config'
import {clipJoin} from 'pages/common/clipPlayer/clip_func'
import {NewClipPlayerJoin} from "../../../common/audio/clip_func";
import {
  setGlobalCtxClipPlayListTabAdd,
  setGlobalCtxMessage,
  setGlobalCtxUpdatePopup
} from "../../../redux/actions/globalCtx";

export const playClip = ({clipNo, playList, globalState, dispatch, history, playListInfoData}) => {
  if(clipNo) {
    const clipParam = { clipNo: clipNo, globalState, dispatch, history };
    let playListInfo = playListInfoData ? playListInfoData : { type: 'setting' };
    localStorage.setItem("clipPlayListInfo", JSON.stringify(playListInfo));

    dispatch(setGlobalCtxClipPlayListTabAdd(playList));
    sessionStorage.setItem("clipList", JSON.stringify(playList));
    NewClipPlayerJoin(clipParam);
  }
}

export async function ClipPlayFn(clipNum, type, globalState, dispatch, history) {
  if (JSON.parse(Api.customHeader)['os'] === OS_TYPE['Desktop']) {
    dispatch(setGlobalCtxUpdatePopup({popup: ['APPDOWN', 'appDownAlrt', 4]}));
  } else {
    if (globalState.token.isLogin === false) {
      return dispatch(setGlobalCtxMessage({
        type: "alert",
        msg: '해당 서비스를 위해<br/>로그인을 해주세요.',
        callback: () => {
          history.push('/login?redirect=/clip_recommend')
        }
      }))
    }
    const {result, data, message, code} = await Api.postClipPlay({
      clipNo: clipNum
    })
    if (result === 'success') {
      clipJoin(data, dispatch, globalState)
    } else {
      if (code === '-99') {
        dispatch(setGlobalCtxMessage({
          type: "alert",
          msg: message,
          callback: () => {
            history.push('/login?redirect=/clip_recommend');
          }
        }))
      } else {
        dispatch(setGlobalCtxMessage({
          type: "alert",
          msg: message
        }))
      }
    }
  }
}
