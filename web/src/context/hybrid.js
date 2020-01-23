/**
 * @title     : React ---> iOS,Android 로 function전달
 * @example   : 사용법
 * @ios       : webkit.messageHandlers.GetLoginToken.postMessage(res.data) -> Hybrid('GetLoginToken', res.data)
 * @android   : window.android.GetLoginToken(JSON.stringify(res.data)) -> Hybrid('GetLoginToken', res.data)
 *
 */
import React, {useEffect, useState} from 'react'
import {osName, browserName} from 'react-device-detect'
//---------------------------------------------------------------------
/**
 *
 * @param string  func          //*function 이름 (Method)55
 * @param any     info          //*data (string or object )
 *
 */
export const Hybrid = (func, info) => {
  switch (osName) {
    case 'Windows':
      console.log('Windows버젼입니다')
      break
    case 'iOS':
      webkit.messageHandlers[func].postMessage(info)
      break
    case 'Android':
      window.android[func](JSON.stringify(info))
      break
    default:
      break
  }
}
