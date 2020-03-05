/**
 * @title     : React ---> iOS,Android 로 function전달
 * @example   : 사용법
 * @ios       : webkit.messageHandlers.GetLoginToken.postMessage(res.data) -> Hybrid('GetLoginToken', res.data)
 * @android   : window.android.GetLoginToken(JSON.stringify(res.data)) -> Hybrid('GetLoginToken', res.data)
 * @todo      : context.customHeader.os 를 1,2를 체크해서 복합적으로 구현
 *
 */
import {osName, browserName} from 'react-device-detect'
import Api from 'context/api'
//---------------------------------------------------------------------
/**
 *
 * @param string  func          //*function 이름 (Method)55
 * @param any     info          //*data (string or object )
 *
 */
export const isHybrid = () => {
  const customHeader = Api.customHeader
  //하이브리드앱 아닐경우 예외처리
  alert(customHeader)
  if (customHeader.os === 1 || customHeader.os === 2 || customHeader.os === '1' || customHeader.os === '2') {
    const element = document.getElementById('customHeader')
    alert(element.value)
    if (element !== null && element.value.trim() !== '' && element.value !== undefined) {
      const _temp = JSON.parse(element.value)
      alert(_temp)
    }
    return true
  }
  return false
}
export const Hybrid = (func, info) => {
  const customHeader = Api.customHeader
  //하이브리드앱 아닐경우 예외처리
  // if (customHeader.os !== '1' && customHeader.os !== '2') {
  //   console.log(`하이브리드앱이 아님!! osName: ${osName} , browserName: ${browserName}`)
  //   return
  // }
  switch (osName) {
    case 'Windows':
      //console.log('Windows버젼입니다')
      break
    case 'iOS':
      if (webkit === null || webkit === undefined) return
      if (info === '' || info === null || info === undefined) {
        //IOS는 string으로라도 넣어주어야함
        webkit.messageHandlers[func].postMessage('')
      } else {
        webkit.messageHandlers[func].postMessage(info)
      }
      break
    case 'Android':
      if (window.android[func] === null || window.android[func] === undefined) return
      if (info === '' || info === null || info === undefined) {
        window.android[func]()
      } else {
        window.android[func](JSON.stringify(info))
      }
      break
    default:
      break
  }
}
