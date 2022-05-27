import moment from "moment/moment";

/**
 *  @example
 * import Utility ,{addComma} from '/lib/utility'
 *
 */

//---------------------------------------------------------------------

export default class Utility {

  //DJ 타임랭킹 조회 parameter 생성
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


  //랭크타입에 따른 조회 parameter 생성, rankType [타임=0, 일간=1, 주간=2, 월간=3, 연간=4]
  static getSearchRankingDate = (rankType) => {
    switch (rankType) {
      case 1:
        return {
          rankingDate: moment().format('YYYY-MM-DD'), //오늘 날짜
          prevRankingDate: moment().subtract(1, 'd').format('YYYY-MM-DD') // 어제 날짜
        };
      case 2:
        return {
          rankingDate: moment().startOf('isoWeek').days(1).format('YYYY-MM-DD'), // 이번주 월요일
          prevRankingDate: moment().startOf('isoWeek').subtract(7, 'd').day(1).format('YYYY-MM-DD') // 지난주 월요일
        };
      case 3:
        return {
          rankingDate: moment().date(1).format('YYYY-MM-DD'), // 이번달 1일
          prevRankingDate: moment().subtract(1, 'months').date(1).format('YYYY-MM-DD') // 지난달 1일
        };
      case 4:
        return {
          rankingDate: moment().month(0).date(1).format('YYYY-MM-DD'), // 이번년 1월 1일
          prevRankingDate: moment().subtract(1, 'y').month(0).date(1).format('YYYY-MM-DD') // 지난년 1월 1일
        };
      default:
        return {
          rankingDate: moment().format('YYYY-MM-DD'), // 오늘 날짜
          prevRankingDate: moment().subtract(1, 'd').format('YYYY-MM-DD') // 어제 날짜
        };
    }
  }

  //slct 코드 (랭킹구분)
  static slctCode = (code) =>{
    switch (code) {
      case "dj":
        return 1;
      case "fan":
        return 2;
      case "cupid":
        return 3;
      case "team":
        return 4;
    }
  }

  //type 코드 (기간구분)
  static typeCode = (code) =>{
    switch (code) {
      case "time":
        return 0;
      case "today":
        return 1;
      case "week":
        return 2;
      case "month":
        return 3;
      case "year":
        return 4;
    }
  }



}
