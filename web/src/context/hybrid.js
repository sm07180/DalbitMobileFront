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
/**
 *
 * @brief 하이브리드앱 여부체크확인
 *
 */
export const isHybrid = () => {
  const customHeader = JSON.parse(Api.customHeader)
  if (customHeader['os'] === '1' || customHeader['os'] === '2') {
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
    case '1': {
      if (window.android[func] === null || window.android[func] === undefined || typeof window.android[func] !== 'function')
        return
      if (info === '' || info === null || info === undefined) {
        window.android[func]()
      } else {
        window.android[func](JSON.stringify(info))
      }
      break
    }
    // IOS
    case '2': {
      if (webkit === null || webkit === undefined) return
      if (info === '' || info === null || info === undefined) {
        //IOS는 string으로라도 넣어주어야함
        webkit.messageHandlers[func].postMessage('')
      } else {
        webkit.messageHandlers[func].postMessage(info)
      }
      break
    }
    default:
      break
  }
}
