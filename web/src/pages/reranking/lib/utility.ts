import moment from "moment/moment";

/**
 *  @example
 * import Utility ,{addComma} from '/lib/utility'
 *
 */

//---------------------------------------------------------------------

export default class Utility {

  static timeCheck = () => {
    // 1회차일 경우, 어제 3회차
    if (moment().hour() < 10) {
      return  moment().subtract(1, 'days').hour(19).minute(0o0).second(0o0).format('YYYY-MM-DD HH:mm:ss');
      // 2회차일 경우, 오늘 1회차
    }  else if (moment().hour() >= 10 && moment().hour() < 19) {
      return  moment().hour(0o0).minute(0o0).second(0o0).format('YYYY-MM-DD HH:mm:ss');
      // 3회차일 경우, 오늘 2회차
    } else {
      return  moment().hour(10).minute(0o0).second(0o0).format('YYYY-MM-DD HH:mm:ss');
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


  // TOP3 랭킹 정보 빈값 넣어주는 함수
  static addEmptyRanker = (list) => {
    let topList = list;
    for (let i = 0; i < 3 - list.length; i++){
      topList = topList.concat({isEmpty: true})
    }
    return topList;
  };



}
