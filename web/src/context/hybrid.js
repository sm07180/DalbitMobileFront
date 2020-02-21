/**
 * @title     : React ---> iOS,Android 로 function전달
 * @example   : 사용법
 * @ios       : webkit.messageHandlers.GetLoginToken.postMessage(res.data) -> Hybrid('GetLoginToken', res.data)
 * @android   : window.android.GetLoginToken(JSON.stringify(res.data)) -> Hybrid('GetLoginToken', res.data)
 * @todo      : context.customHeader.os 를 1,2를 체크해서 복합적으로 구현
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
  //console.log('Native post data = ' + JSON.stringify(info))
  switch (osName) {
    case 'Windows':
      //console.log('Windows버젼입니다')
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
