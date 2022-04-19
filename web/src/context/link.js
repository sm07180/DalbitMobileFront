/**
 * @title 스토어분기처리
 * @param {context} object            //context
 */

import {OS_TYPE} from 'context/config.js'

export const StoreLink = async (context, history) => {
  if (!context.token.isLogin) {
    history.push('/login')
    return
  }

  if (context.customHeader['os'] === OS_TYPE['IOS']) {
    if(context.customHeader['appBuild'] && parseInt(context.customHeader['appBuild']) > 196){
      // webkit.messageHandlers.openInApp.postMessage('')
      history.push('/store')
    }else{
      context.action.alert({
        msg: '현재 앱 내 결제에 문제가 있어 작업중입니다\n도움이 필요하시면 1:1문의를 이용해 주세요.'
      })
    }
  } else {
    history.push('/store')
  }
}
