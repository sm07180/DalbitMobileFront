/**
 *  @example
 * import Utility ,{addComma} from 'components/lib/utility'
 *
 */
//---------------------------------------------------------------------
export default class Utility {
  /**
   * @brief nl2br

   * @code Utility.setCookie('custom-header', JSON.stringify(customHeader), '2')
   *
   */
  static nl2br = text => {
    //return <div dangerouslySetInnerHTML={{__html: body}} />
    return text.replace(/(?:\r\n|\r|\n)/g, '<br />')
  }
  /**
   * @brief 쿠키설정
   * @param string    c_name            //*쿠키의 key(키)
   * @param string    value             //*쿠키의 value(값)
   * @param string    exdays            //*유효기간
   * @code Utility.setCookie('custom-header', JSON.stringify(customHeader), '2')
   *
   */
  static setCookie = (c_name, value, exdays) => {
    const exdate = new Date()
    exdate.setDate(exdate.getDate() + exdays)
    const c_value = decodeURIComponent(value) + (exdays == null ? '' : '; expires=' + exdate.toUTCString())
    document.cookie = c_name + '=' + c_value + '; domain=dalbitcast.com'
  }
  /**
   * @brief 쿠키가져오기
   * @param string    c_name            //*쿠키의 key(키)
   * @code console.log(JSON.parse(Utility.getCookie('custom-header')))
   *
   */
  static getCookie = c_name => {
    let i, x, y
    let ARRcookies = document.cookie.split(';')
    for (i = 0; i < ARRcookies.length; i++) {
      x = ARRcookies[i].substr(0, ARRcookies[i].indexOf('='))
      y = ARRcookies[i].substr(ARRcookies[i].indexOf('=') + 1)
      x = x.replace(/^\s+|\s+$/g, '')
      if (x == c_name) {
        return decodeURIComponent(y)
      }
    }
  }
  /**
   * @brief 쿠키 삭제
   * @param string    c_name            //*쿠키의 key(키)
   * @code console.log(JSON.parse(Utility.getCookie('custom-header')))
   *
   */
  static removeCookie = c_name => {
    console.log('removeCookie = ' + c_name)
    //Utility.setCookie(c_name, '', -1)
    document.removeCookie()
  }

  /**
   * @brief 쿠키가져오기
   * @param string    c_name            //*쿠키의 key(키)
   * @code console.log(JSON.parse(Utility.getCookie('custom-header')))
   *
   */
  static getCookie = c_name => {
    let i, x, y
    let ARRcookies = document.cookie.split(';')
    for (i = 0; i < ARRcookies.length; i++) {
      x = ARRcookies[i].substr(0, ARRcookies[i].indexOf('='))
      y = ARRcookies[i].substr(ARRcookies[i].indexOf('=') + 1)
      x = x.replace(/^\s+|\s+$/g, '')
      if (x == c_name) {
        return unescape(y)
      }
    }
  }
  //* make UUID
  static createUUID = () => {
    var dt = new Date().getTime()
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (dt + Math.random() * 16) % 16 | 0
      dt = Math.floor(dt / 16)
      return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16)
    })
    return uuid
  }
  //* 배열이나 문자열 중복제거  [1,3,2,4,3,1,5,6,2,1] =>[1,3,2,4,5,6]  ,  '11411' =>'14'
  static removeOverlap = data => {
    if (typeof data === 'object') return [...new Set(data)]
    if (typeof data === 'string') return [...new Set(data)].join('')
    return data
  }
  //* 난수로 생성된 배열가져오기
  static getSomeArray = (length = 10) => {
    let _temp = []
    for (let i = 0; i < length; i++) _temp.push(randomRange(1, 10))
    return _temp
  }
  //* 배열섞기
  static suffleArray = array => {
    return array.sort(() => 0.5 - Math.random())
  }
  //* 특정배열요소 1개만 지우기
  static removeElementFromArray = (array, element) => {
    const _index = array.indexOf(element)
    if (_index >= 0) array.splice(_index, 1)
    return array
  }
  //* 특정배열요소 모두 지우기
  static removeAllElementFromArray = (array, element) => {
    return array.filter(ele => ele !== element)
  }
  //* 배열내에서 동일한값을 체크해서 object로 묶어줌. {3,9,3,9,7} 이면 matchMap에는 {3=2,9=2,7=1}
  static matchMapFromArray = (array = [1, 3, 3, 7, 3, 3, 1]) => {
    let _map = {}
    for (let idx in array) {
      const num = array[idx]
      _map[num] = _map.hasOwnProperty(num) ? _map[num] + 1 : 1
    }
    return _map
  }
  //* 휴대폰번호 010-3456-1234 형태로 "-"추가 3자리 4자리가능, 전체 11자리를 한꺼번에 입력받아 리턴할 경우 사용.
  static phoneAddHypen = string => {
    if (typeof string === 'string' && string !== null && string !== '')
      return string
        .replace(/[^0-9]/g, '')
        .replace(/(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})/, '$1-$2-$3')
        .replace('--', '-')
  }
  //* 자리수맞추기
  static digitNumber = (n, width) => {
    n = n + ''
    width = width || 2
    return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n
  }
  // 말줄임표 ... 처리
  static makeEllipsis = (str, limit) => {
    return (str = str.length > limit ? str.substr(0, limit) + '...' : str)
  }
  // 3,000,000 3단위수로 ,붙이기
  static addComma = x => {
    if (x === undefined || x === null) return 0
    try {
      var parts = x.toString().split('.')
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      return parts.join('.')
    } catch {
      return 0
    }
  }
  //초 단위 숫자를 시 분 포맷으로 변경
  static secondsToTime = seconds => {
    const hour = parseInt(seconds / 3600)
    const min = parseInt((seconds % 3600) / 60)
    return `${hour}시간 ${hour}분`
  }
}
