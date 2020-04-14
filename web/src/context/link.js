/**
 * @title 스토어분기처리
 * @param {context} object            //context
 */

import {OS_TYPE} from 'context/config.js'

export const StoreLink = async context => {
  if (!context.token.isLogin) {
    window.location.href = '/login'
    return
  }

  if (context.customHeader['os'] === OS_TYPE['IOS']) {
    webkit.messageHandlers.openInApp.postMessage('')
  } else {
    window.location.href = '/store'
  }
}
