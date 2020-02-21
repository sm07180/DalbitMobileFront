/**
 *
 * @param {*} obj https://devm-yeshtml5.dalbitcast.com/
 */

export const MY_DOMAIN = 'https://devm-yeshtml5.dalbitcast.com/' //손완휘차장
/*
https://devm-yeshtml5.dalbitcast.com                //손완휘차장
https://devm-hgkim1118.dalbitcast.com/              //김호겸과장
https://devm-swpark.dalbitcast.com/                 //박송원대리
https://devm-herbione.dalbitcast.com/               //이은비주임
https://devm-nmc2711.dalbitcast.com/                //황상한사원
https://devm-friendship93.dalbitcast.com/           //최우정사원

*/
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
