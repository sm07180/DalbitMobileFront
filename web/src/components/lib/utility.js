/**
 *  @example
 * import Utility ,{addComma} from 'components/lib/utility'
 *
 */

//---------------------------------------------------------------------
import {isHybrid, Hybrid, isAndroid} from 'context/hybrid'
import {clipJoinApi} from 'pages/common/clipPlayer/clip_func'
import Api from 'context/api'
import moment from 'moment'

export default class Utility {
  /**
   * @brief 언어설정
   * @code Utility.locale() example 'ko'
   *
   */
  static locale = () => {
    return (navigator.language || navigator.userLanguage).substr(0, 2)
  }
  /**
   * @brief nl2br
   *
   */
  static nl2br = (text) => {
    if (text && text !== '') {
      return text.replace(/(?:\r\n|\r|\n)/g, '<br />')
    }
  }
  /**
   * @brief 쿠키설정 path=/;domain=dalbitcast.com
   * @param string    c_name            //*쿠키의 key(키)
   * @param string    value             //*쿠키의 value(값)
   * @param string    exdays            //*유효기간
   *
   */
  static setCookie = (c_name, value, exdays) => {
    const exdate = new Date()
    if (exdays !== null) {
      exdate.setDate(exdate.getDate() + Number(exdays))
    }

    const encodedValue = encodeURIComponent(value)
    const c_value = encodedValue + (exdays == null ? '' : '; expires=' + exdate.toUTCString())
    document.cookie = c_name + '=' + c_value + '; path=/; secure; domain=.dalbitlive.com'
  }

  /**
   * @brief 쿠키가져오기
   * @param string    c_name            //*쿠키의 key(키)
   */
  static getCookie = (c_name) => {
    const splited = document.cookie.split(';')
    const cookies = {}
    splited.forEach((bundle) => {
      const [key, value] = bundle.split('=')
      cookies[key.trim()] = value
    })

    if (cookies[c_name]) {
      return decodeURIComponent(cookies[c_name])
    }

    return
  }

  //* 배열이나 문자열 중복제거  [1,3,2,4,3,1,5,6,2,1] =>[1,3,2,4,5,6]  ,  '11411' =>'14'
  static removeOverlap = (data) => {
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
  static suffleArray = (array) => {
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
    return array.filter((ele) => ele !== element)
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
  static phoneAddHypen = (string) => {
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
  static addComma = (x) => {
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
  static secondsToTime = (seconds) => {
    const hour = parseInt(seconds / 3600)
    const min = parseInt((seconds % 3600) / 60)
    return `${hour}시간 ${hour}분`
  }
  //분 포맷으로 변경
  static minuteToTime = (seconds) => {
    const min = parseInt(seconds % 3600)
    return ` ${min}분`
  }
  //한자리 숫자 앞에 0으로 채우기
  //data : 채울 값 //num : 총 몇자리 수까지 표현?
  //Utility.leadingZeros(7,2) => 07
  static leadingZeros = (data, num) => {
    let zero = ''
    data = data.toString()
    if (data.length < num) {
      for (var i = 0; i < num - data.length; i++) {
        zero += '0'
      }
    }
    return zero + data
  }
  //문자열 시간 넣으면 앞에서부터 8자리로 잘라 YYYY-MM-DD 포맷으로 반환
  static dateFormatter(num, type) {
    if (!num) return ''
    var formatNum = ''
    // 공백제거
    num = num.replace(/\s/gi, '')
    num = num.substr(0, 8)
    try {
      if (num.length == 8) {
        if (type == 'dot') {
          formatNum = num.replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3')
        } else if (type === 'slash') {
          // yy/mm/dd
          formatNum = num.slice(2).replace(/(\d{2})(\d{2})(\d{2})/, '$1/$2/$3')
        } else {
          formatNum = num.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')
        }
      }
    } catch (e) {
      formatNum = num
      console.log(e)
    }
    return formatNum
  }
  //년월일
  static dateFormatterKor(num, type) {
    if (!num) return ''
    var formatNum = ''
    // 공백제거
    num = num.replace(/\s/gi, '')
    num = num.substr(0, 8)
    try {
      if (num.length == 8) {
        if (type == 'dot') {
          formatNum = num.replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3')
        } else {
          formatNum = num.replace(/(\d{4})(\d{2})(\d{2})/, '$1년 $2월$3일')
        }
      }
    } catch (e) {
      formatNum = num
      console.log(e)
    }
    return formatNum
  }

  static settingAlarmTime(num) {
    const alarmTime = num
    const today = Math.floor(new Date().getTime() / 1000)
    const betweenTime = (today - alarmTime) / 60

    if (betweenTime < 1) return '방금전'
    if (betweenTime < 60) {
      return `${Math.floor(betweenTime)}분전`
    }
    const betweenTimeHour = Math.floor(betweenTime / 60)
    if (betweenTimeHour < 24) {
      return `${betweenTimeHour}시간전`
    }

    const betweenTimeDay = Math.floor(betweenTime / 60 / 24)
    if (betweenTimeDay < 365) {
      return `${betweenTimeDay}일전`
    }
  }

  static timeFormat = (strFormatFromServer) => {
    let date = strFormatFromServer.slice(0, 8)
    date = [date.slice(0, 4), date.slice(4, 6), date.slice(6)].join('.')
    let time = strFormatFromServer.slice(8)
    time = [time.slice(0, 2), time.slice(2, 4), time.slice(4)].join(':')
    return `${date} ${time}`
  }

  /**
   * 숫자 K형으로 문자 변환
   * @param number
   * @returns {*}
   */
  static printNumber(number) {
    if (number === undefined) {
      return 0
    } else if (number > 9999 && number < 100000) {
      return Math.floor((number / 1000.0) * 10) / 10 + 'K'
    } else if (number >= 100000) {
      return Math.floor(number / 1000) + 'K'
    } else {
      return number.toLocaleString()
    }
  }

  /**
   * 랜덤 숫자 인트형으로 가져 오기
   * @param min
   * @param max
   * @returns {*}
   */
  static getRandomInt = (min, max) => {
    min = Math.ceil(min)
    max = Math.floor(max) + 1
    return Math.floor(Math.random() * (max - min)) + min
  }

  /**
   * 공지사항, faq, 1:1문의 시에 a링크 찾아서 하이브리드 일때 외부 브라우저 실행
   *
   * @param event
   * @returns {boolean}
   */
  static contentClickEvent = (event, context) => {
    if (event.target.closest('A')) {
      const link = event.target.closest('A')
      const clipUrl = /\/clip\/[0-9]*$/
      if (isHybrid()) {
        if (clipUrl.test(link.href)) {
          const clip_no = link.href.substring(link.href.lastIndexOf('/') + 1)
          clipJoinApi(clip_no, context)
        } else if (
          link.href.indexOf('dalbitlive.com') > -1 ||
          (!link.href.startsWith('https://') && !link.href.startsWith('http://'))
        ) {
          window.location.href = link.href
        } else {
          Hybrid('openUrl', link.href)
        }
        event.preventDefault()
        return false
      } else if (clipUrl.test(link.href)) {
        context.action.updatePopup('APPDOWN', 'appDownAlrt', 4)
        event.preventDefault()
        return false
      }
    }
  }

  /**
   * 배열 concat 시 유니키값 지정해여 제외
   * @param original : 원 배열 (Array)
   * @param newArray : concat할 배열 (Array)
   * @param keyName : unique 키 네임 (String)
   * @returns {Array}
   */
  static contactRemoveUnique = (original, newArray, keyName) => {
    if (original === undefined || original === null || !Array.isArray(original) || original.length < 1) {
      return newArray
    } else if (newArray === undefined || newArray === null || !Array.isArray(newArray) || newArray.length < 1) {
      return original
    } else {
      let retArray = original
      let isContains = false
      newArray.forEach((item1) => {
        isContains = false
        original.forEach((item2) => {
          if (item1[keyName] == item2[keyName]) {
            isContains = true
          }
        })
        if (isContains == false) {
          retArray.push(item1)
        }
      })
      return retArray
    }
  }

  /**
   * 배열에서 키값 String(,)으로 반환
   * @param array : 키값 찾을 배열 (Array)
   * @param keyName : unique 키 네임 (String)
   * @returns {string}
   */
  static getUniqueIds = (array, keyName) => {
    if (
      array === undefined ||
      array === null ||
      !Array.isArray(array) ||
      array.length < 1 ||
      keyName === undefined ||
      keyName === null ||
      keyName === ''
    ) {
      return ''
    } else {
      const ids = new Array()
      array.map((item) => {
        array.push(item[keyName])
      })
      return ids.join(',')
    }
  }
  static isHitBottom = (diff = 300) => {
    const windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight
    const body = document.body
    const html = document.documentElement
    const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)
    const windowBottom = windowHeight + window.pageYOffset
    return windowBottom >= docHeight - diff
  }

  /* nowVersion(현재 다운로드된 앱 버전)이 타겟버전 이상이면 successCallback 아니면 failCallback */
  static compareAppVersion = async (targetVersion, successCallback, failCallback) => {
    const res = await Api.verisionCheck()
    const nowVersion = res.data.nowVersion

    const versionArr = nowVersion.split('.')
    const firstPos = parseInt(versionArr[0])
    const secondPos = parseInt(versionArr[1])
    const thirdPos = parseInt(versionArr[2])
    const targetVerArr = targetVersion.split('.')
    const targetFirstPos = parseInt(targetVerArr[0])
    const targetSecondPos = parseInt(targetVerArr[1])
    const targetThirdPos = parseInt(targetVerArr[2])

    if (
      firstPos > targetFirstPos ||
      (firstPos === targetFirstPos && secondPos > targetSecondPos) ||
      (firstPos === targetFirstPos && secondPos === targetSecondPos && thirdPos >= targetThirdPos)
    ) {
      if (typeof successCallback === 'function') successCallback()
    } else {
      if (typeof failCallback === 'function') failCallback()
    }
  }

  // 생년월일 -> 만나이
  static birthToAmericanAge = (birth) => {
    // age: YYYYMMDD
    const birthYear = parseInt(birth.substring(0, 4))
    const birthMonthAndDay = parseInt(birth.substring(4))
    const nowYear = parseInt(moment().format('YYYY'))
    const nowMonthAndDay = parseInt(moment().format('MMDD'))
    const yearDiff = nowYear - birthYear
    const monthAndDayDiff = nowMonthAndDay - birthMonthAndDay

    return monthAndDayDiff >= 0 ? yearDiff : yearDiff - 1
  }

  // 초를 xx시간 xx분으로
  static secondToHM = (time) => {
    let hour = 0
    let min = 0
    if (time >= 3600) {
      hour = Math.floor(time / 3600)
      time = time % 3600
    }
    min = Math.floor(time / 60)

    return `${hour}시간 ${min}분`
  }

  // firebase, adbrix, facebook 이벤트 요청
  static addAdsData = async (cmd, value, aosAppVer, iosAppVer) => {
    const successCallback = () => {
      const firebaseDataArray = [
        { type : "firebase", key : cmd, value },
        { type : "adbrix", key : cmd, value },
        { type : "facebook", key : cmd, value },
      ];
      Hybrid('eventTracking', {service :  firebaseDataArray})
    };
    const failCallback = () => {
      try {
        fbq('track', cmd)
        firebase.analytics().logEvent(cmd)
      } catch (e) {}
    }

    if(isHybrid()) {
      if(typeof aosAppVer === 'undefined' && typeof iosAppVer === 'undefined') {
        successCallback();
      }else {
        const targetVersion = isAndroid() ? aosAppVer : iosAppVer; // 강업 버전
        await Utility.compareAppVersion(targetVersion, successCallback, failCallback);
      }
    }else {
      failCallback();
    }
  }
}
