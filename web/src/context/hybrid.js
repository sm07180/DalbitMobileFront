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
//---------------------------------------------------------------------
/**
 *
 * @brief 하이브리드앱 안드로이드/IOS체크
 *
 */
export const osName = () => {
  const customHeader = JSON.parse(Api.customHeader)
  if (customHeader.os + '' === '1' || customHeader.os + '' === '2') {
    const element = document.getElementById('customHeader')
    if (element !== null && element.value.trim() !== '' && element.value !== undefined) {
      const val = JSON.parse(element.value)
      return val.os + ''
    }
  }
  return ''
}
/**
 *
 * @brief 하이브리드앱 여부체크확인
 *
 */
export const isHybrid = () => {
  const customHeader = JSON.parse(Api.customHeader)
  //alert('Api.customHeader = ' + Api.customHeader)
  //하이브리드앱 아닐경우 예외처리
  //alert('customHeader.os = ' + customHeader.os + '')
  if (customHeader.os + '' === '1' || customHeader.os + '' === '2') {
    //<textarea id="customHeader" > 2중체크
    // const element = document.getElementById('customHeader')
    // if (element !== null && element.value.trim() !== '' && element.value !== undefined) {
    //   const val = JSON.parse(element.value)
    //   if (val.os + '' === '1' || val.os + '' === '2') return true
    // } else {
    //   alert('custom noting ')
    // }
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
  const customHeader = JSON.parse(Api.customHeader)
  if (!isHybrid()) return
  //switch (osName()) {
  const os = customHeader.os + ''
  switch (os) {
    case '':
      break
    case '1':
      //alert('안드로이드 푸쉬 = ' + func + ',' + 'data = ' + info)
      if (window.android[func] === null || window.android[func] === undefined) return
      if (info === '' || info === null || info === undefined) {
        window.android[func]()
      } else {
        window.android[func](JSON.stringify(info))
      }
      break
    case '2':
      //alert('IOS 푸쉬 = ' + func + ',' + 'data = ' + info)
      if (webkit === null || webkit === undefined) return
      if (info === '' || info === null || info === undefined) {
        //IOS는 string으로라도 넣어주어야함
        webkit.messageHandlers[func].postMessage('')
      } else {
        webkit.messageHandlers[func].postMessage(info)
      }
      break
    default:
      break
  }
}
