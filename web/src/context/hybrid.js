/**
 * @title     : React ---> iOS,Android 로 function전달
 * @example   : 사용법
 * @ios       : webkit.messageHandlers.GetLoginToken.postMessage(res.data) -> Hybrid('GetLoginToken', res.data)
 * @android   : window.android.GetLoginToken(JSON.stringify(res.data)) -> Hybrid('GetLoginToken', res.data)
 * @todo      : context.customHeader.os 를 1,2를 체크해서 복합적으로 구현
 * @notice    : isHybrid , Hybrid 수정하지말것!
 *
 */
import Api from 'context/api'
import {OS_TYPE} from 'context/config.js'

/**
 *
 * @brief 하이브리드앱 여부체크확인
 *
 */
export const isHybrid = () => {
  const customHeader = JSON.parse(Api.customHeader)
  if (customHeader['os'] === OS_TYPE['Android'] || customHeader['os'] === OS_TYPE['IOS']) {
    return true
  }
  return false
}

export const isAndroid = () => {
  const customHeader = JSON.parse(Api.customHeader)
  if (customHeader['os'] === OS_TYPE['Android']) {
    return true
  }
  return false
}

/**
 *
 * @param string  func          //*function 이름 (Method)55
 * @param any     info          //*data (string or object )
 *
 */
export const Hybrid = (func, info) => {
  if (!isHybrid()) return

  const customHeader = JSON.parse(Api.customHeader)

  switch (customHeader['os']) {
    // Android
    case OS_TYPE['Android']: {
      if (window.android[func] === null || window.android[func] === undefined || typeof window.android[func] !== 'function')
        return
      if (info === '' || info === null || info === undefined) {
        window.android[func]()
      } else {
        try {
          window.android[func](JSON.stringify(info))
        } catch (e) {
          if (func === 'openUrl') {
            window.android[func]('{"url":"' + info + '"}')
          }
        }
      }
      break
    }
    // IOS
    case OS_TYPE['IOS']: {
      if (webkit === null || webkit === undefined) return
      if (info === '' || info === null || info === undefined) {
        //IOS는 string으로라도 넣어주어야함
        if (webkit.messageHandlers[func]) webkit.messageHandlers[func].postMessage('')
      } else {
        if (webkit.messageHandlers[func]) webkit.messageHandlers[func].postMessage(info)
      }
      break
    }
    default:
      break
  }
}
