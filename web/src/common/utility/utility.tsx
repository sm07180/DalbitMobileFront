import moment from "moment";

export default class Utility {
  static birthToAmericanAge = (birth) => {
    // age: YYYYMMDD
    const birthYear = parseInt(birth.substring(0, 4));
    const birthMonthAndDay = parseInt(birth.substring(4));
    const nowYear = parseInt(moment().format('YYYY'));
    const nowMonthAndDay = parseInt(moment().format('MMDD'));
    const yearDiff = nowYear - birthYear;
    const monthAndDayDiff = nowMonthAndDay - birthMonthAndDay;

    return monthAndDayDiff >= 0 ? yearDiff : yearDiff -1;
  }

  // 초를 xx시간 xx분으로
  static secondToHM = (time) => {
    let hour = 0;
    let min = 0;
    if(time >= 3600) {
      hour = Math.floor(time / 3600);
      time = time % 3600;
    }
    min = Math.floor(time / 60);

    return `${hour}시간 ${min}분`;
  }
}