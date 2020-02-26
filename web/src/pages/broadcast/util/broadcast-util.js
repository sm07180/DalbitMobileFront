export default class Util {
  /**
   * @brief date format util
   * @param String 20200101151454
   * @create 최우정 2020.02.25
   */

  // hh:mm:ss
  static format = param => {
    let formatTime = param.toString().substring(8, param.toString().length)
    return formatTime.toString().replace(/\B(?=(\d{2})+(?!\d))/g, ':')
  }
}
