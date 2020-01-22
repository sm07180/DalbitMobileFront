/**
 * @title React ---> iOS,Android 로 function전달
 * @example 사용법
 * @ios webkit.messageHandlers.GetLoginToken.postMessage(res.data)
 * @android window.android.GetLoginToken(JSON.stringify(res.data))
 *
 */
import React, {useEffect, useState} from 'react'
import {osName, browserName} from 'react-device-detect'
//---------------------------------------------------------------------

export const Hybrid = (func, info) => {
  switch (osName) {
    case 'Windows':
      alert('windows')
      break
    case 'iOS':
      webkit.messageHandlers[func].postMessage(info)
      break
    case 'Android':
      console.log(info)
      window.android[func](JSON.stringify(info))
      break
    default:
      break
  }
}
