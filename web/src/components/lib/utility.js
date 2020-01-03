/**
 *  @example
 * import Utility ,{addComma} from 'components/lib/utility'
 *

 *
 */

//---------------------------------------------------------------------
//* 범위내에 난수발생
export const randomRange = (n1, n2) => Math.floor(Math.random() * (n2 - n1 + 1) + n1)
//* 3,000,000 3단위수로 ,붙이기
export const addComma = x => {
  try {
    var parts = x.toString().split('.')
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return parts.join('.')
  } catch {
    return 0
  }
}
//---------------------------------------------------------------------
export default class Utility {
  //* localStorage Object형태로 데이타저장
  static appendLocalStorage = (localStorageName, data) => {
    const obj = JSON.parse(localStorage.getItem(localStorageName)) || []
    obj.push(data)
    localStorage.setItem(localStorageName, JSON.stringify(obj))
  }

  static addObjLocalStorage = (localStorageName, key, data) => {
    const obj = JSON.parse(localStorage.getItem(localStorageName)) || {}
    obj[key] = data
    localStorage.setItem(localStorageName, JSON.stringify(obj))
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
  //* 휴대폰번호 010-3456-1234 형태로 "-"추가 3자리 4자리가능
  static phoneAddHypen = string => {
    if (typeof string === 'string' && string !== null && string !== '') return string.replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/, '$1-$2-$3')
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
  // notification localStorage
  // 알림 모두 읽음처리
  static readAllNotification = () => {
    const notices = this.getNotification()
    /**
     *
     */
    notices.forEach(noti => {
      noti.read = true
    })
    localStorage.setItem('notifications', JSON.stringify(notices))
    this.onNotification()
  }
  // 읽기 전용 모두 읽음 처리
  static readReadableNotification = () => {
    const notices = this.getNotification()
    notices.forEach(noti => {
      //   console.log(noti);
      if (noti.read_type !== 'action') noti.read = true
    })
    localStorage.setItem('notifications', JSON.stringify(notices))
    this.onNotification()
  }
  // 행동 읽음처리
  static readActionNotification = phone => {
    const notices = this.getNotification()
    notices.forEach(noti => {
      // console.log(noti);
      if (noti.read_type === 'action' && phone === noti.phone) noti.read = true
    })
    localStorage.setItem('notifications', JSON.stringify(notices))
    this.onNotification()
  }
  // 알림 추가
  static addNotification = notice => {
    const notices = this.getNotification()
    if (notices.key === 'goMain') return
    if (notice === undefined || notice === '') return
    notice.read = false
    notices.push(copyObj(notice))
    localStorage.setItem('notifications', JSON.stringify(notices))
    this.onNotification()
  }
  // notice.read = true된것만체크
  static newNotificationCount = notice => {
    let count = 0
    const notices = this.getNotification()
    notices.forEach(noti => {
      if (noti.read === false) {
        ++count
      }
    })
    return count
  }
  static getNotification = () => {
    return JSON.parse(localStorage.getItem('notifications') || '[]')
  }
  static onNotification = () => {}
}
