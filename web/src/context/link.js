/**
 * @title 스토어분기처리
 * @param {context} object            //context
 */

import {OS_TYPE} from 'context/config.js'
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

export const StoreLink = async ({history, dispatch, globalState}) => {

  if (!globalState.token.isLogin) {
    history.push('/login')
    return
  }

  if (globalState.customHeader['os'] === OS_TYPE['IOS']) {
    if (globalState.customHeader['appBuild'] && parseInt(globalState.customHeader['appBuild']) > 196) {
      webkit.messageHandlers.openInApp.postMessage('')
    } else {
      dispatch(setGlobalCtxMessage({
        type: "alert",
        msg: '현재 앱 내 결제에 문제가 있어 작업중입니다\n도움이 필요하시면 1:1문의를 이용해 주세요.'
      }))
    }
  } else {
    history.push('/store')
  }
}
