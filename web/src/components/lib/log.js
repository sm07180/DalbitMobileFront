/**
 *
 * @param {*} obj https://devm-yeshtml5.dalbitcast.com/
 */

export const MY_DOMAIN = 'https://devm-yeshtml5.dalbitcast.com/' //손완휘차장

/**
 * @brief 로그함수
 * @param {} info
 */
export const Log = info => {
  const location = window.location.href

  if (location.indexOf(MY_DOMAIN) !== -1) {
    const _log = JSON.stringify(info, null, 1)
    const _style = 'width:100%;padding:10px;font-size:12px;padding:5px 10px;color:#fff;background:blue;'
    console.log(`%c${_log}`, _style)
    // alert('1')
  }
}
/**
 * @brief table형함수
 * @param {} info
 */
export const Table = info => {
  const location = window.location.href

  if (location.indexOf(MY_DOMAIN) !== -1) {
    const _log = JSON.stringify(info, null, 1)
    const _style = 'width:100%;padding:10px;font-size:12px;padding:5px 10px;color:#fff;background:blue;'
    console.table(info)
    // alert('1')
  }
}
