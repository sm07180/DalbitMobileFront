export default class UtilityCommon{
  static eventDateCheck = (date) => {
    let curDate = new Date();
    let year = curDate.getFullYear();
    let month = curDate.getMonth() + 1 < 10 ? `0${curDate.getMonth() + 1}` : curDate.getMonth() + 1;
    let day = curDate.getDate() < 10 ? `0${curDate.getDate()}` : curDate.getDate();

    let nowDate = `${year}${month}${day}`;
    return nowDate >= date;

  }
}