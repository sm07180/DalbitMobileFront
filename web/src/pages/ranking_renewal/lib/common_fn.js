export function convertDateFormat(value, Separator) {
  const year = value.getFullYear()
  let month = value.getMonth() + 1
  let day = value.getDate()
  if (month < 10) {
    month = '0' + month
  }
  if (day < 10) {
    day = '0' + day
  }
  Separator = Separator || '.'
  return year + Separator + month + Separator + day
}

export function convertSetSpecialDate(value) {
  let month = value.getMonth() + 1

  if (month < 10) {
    month = '0' + month
  }

  return {
    year: value.getFullYear(),
    month: month
  }
}

export function convertDateToText(dateType, currentDate, convertType) {
  const formDt = currentDate
  let formYear = formDt.getFullYear()
  let formMonth = formDt.getMonth() + 1
  let formDate = formDt.getDate()

  const cDate = new Date()
  let year = cDate.getFullYear()
  let month = cDate.getMonth() + 1
  let date = cDate.getDate()

  // if (convertType === 0) {
  //   if (dateType === 1) {
  //     if (year === formYear && month === formMonth && formDate === date) {
  //       return '실시간 집계'
  //     }
  //   } else if (dateType === 2) {
  //     const currentWeek = convertMonday()
  //     year = currentWeek.getFullYear()
  //     month = currentWeek.getMonth() + 1
  //     date = currentWeek.getDate()
  //     if (year === formYear && month === formMonth && formDate === date) {
  //       return '실시간 집계'
  //     }
  //   } else if (dateType === 3) {
  //     if (year === formYear && month === formMonth) {
  //       return '실시간 집계'
  //     }
  //   } else {
  //     if (year === formYear) {
  //       return '실시간 집계'
  //     }
  //   }
  //   return ''
  // }
  if (convertType === 0) {
    if (dateType === 1) {
      if (year === formYear && month === formMonth && formDate === date) {
        return true
      }
    } else if (dateType === 2) {
      const currentWeek = convertMonday()
      year = currentWeek.getFullYear()
      month = currentWeek.getMonth() + 1
      date = currentWeek.getDate()
      if (year === formYear && month === formMonth && formDate === date) {
        return true
      }
    } else if (dateType === 3) {
      if (year === formYear && month === formMonth) {
        return true
      }
    } else {
      return false
    }
    // return ''
    return false
  } else if (convertType === 1) {
    const dayAgo = new Date(new Date().setDate(new Date().getDate() - 1))
    const agoyear = dayAgo.getFullYear()
    const agomonth = dayAgo.getMonth() + 1
    const agoday = dayAgo.getDate()
    if (dateType === 1) {
      if (year === formYear && month === formMonth && formDate === date) {
        return {
          header: '실시간',
          date: '실시간 집계 중입니다.'
        }
      } else if (agoyear === formYear && agomonth === formMonth && formDate === agoday) {
        return {
          header: '어제',
          date: ''
        }
      } else {
        return {
          header: `${formYear}.${formMonth}.${formDate}`,
          date: `${formYear}.${formMonth}.${formDate}`
        }
      }
    } else if (dateType === 2) {
      const currentWeek = convertMonday()
      year = currentWeek.getFullYear()
      month = currentWeek.getMonth() + 1
      date = currentWeek.getDate()

      const week = convertMonday()
      const weekAgo = new Date(week.setDate(week.getDate() - 7))
      let wYear = weekAgo.getFullYear()
      let wMonth = weekAgo.getMonth() + 1
      let wDate = weekAgo.getDate()

      if (year === formYear && month === formMonth && formDate === date) {
        return {
          header: '이번주 실시간',
          date: '실시간 집계 중입니다.'
        }
      } else if (formYear === wYear && formMonth === wMonth && formDate === wDate) {
        return {
          header: '지난주',
          date: ''
        }
      } else {
        const a = new Date(formDt.getTime())
        const b = new Date(a.setDate(a.getDate() + 6))
        const rangeMonth = b.getMonth() + 1
        const rangeDate = b.getDate()
        return {
          header: `${formYear}.${formMonth}. ${Math.ceil(formDate / 7)}주`,
          date: 'time'
        }
      }
    } else if (dateType === 3) {
      if (year === formYear && month === formMonth) {
        return {
          header: '이번달 실시간',
          date: '실시간 집계 중입니다.'
        }
      } else if (year === formYear && month - 1 === formMonth) {
        return {
          header: '지난달',
          date: ''
        }
      } else {
        return {
          header: `${formYear}.${formMonth}`,
          date: `${formYear}.${formMonth}`
        }
      }
    } else {
      return {
        header: `${formYear}년 실시간`,
        date: '실시간 집계 중입니다.'
      }
    }
  }
}

export function convertMonday() {
  let today = new Date()

  const day = today.getDay()
  let calcNum = 0

  if (day === 0) {
    calcNum = 0
  } else if (day === 1) {
    calcNum = 0
  } else {
    calcNum = 1 - day
  }

  today.setDate(today.getDate() + calcNum)

  return today
}

export function convertMonth() {
  let today = new Date()

  const year = today.getFullYear()
  const month = today.getMonth() + 1

  if (month < 10) {
    return new Date(`${year}-0${month}-01`)
  } else {
    return new Date(`${year}-${month}-01`)
  }
}

export function liveBoxchangeDate(some, dateType, currentDate) {
  let day1 = currentDate
  let year = day1.getFullYear()
  let month = day1.getMonth() + 1
  let date = day1.getDate()

  let handle
  if (some === 'back') {
    switch (dateType) {
      case 1:
        handle = new Date(day1.setDate(day1.getDate() - 1))
        break
      case 2:
        handle = new Date(day1.setDate(day1.getDate() - 7))
        break
      case 3:
        if (month === 1) {
          handle = new Date(`${year - 1}-12-01`)
        } else {
          month -= 1
          if (month < 10) {
            month = '0' + month
          }
          handle = new Date(`${year}-${month}-01`)
        }
        break
      case 4:
        break
    }
  } else {
    switch (dateType) {
      case 1:
        handle = new Date(day1.setDate(day1.getDate() + 1))
        break
      case 2:
        handle = new Date(day1.setDate(day1.getDate() + 7))
        break
      case 3:
        if (month === 12) {
          handle = new Date(`${year + 1}-01-01`)
        } else {
          month += 1
          if (month < 10) {
            month = '0' + month
          }
          handle = new Date(`${year}-${month}-01`)
        }
        break
      case 4:
        break
    }
  }

  return handle
}

export function printNumber(value) {
  if (value === undefined) {
    return 0
  } else if (value > 9999 && value < 100000) {
    return Math.floor((value / 1000.0) * 10) / 10 + 'K'
  } else if (value >= 100000) {
    return Math.floor(value / 1000) + 'K'
  } else {
    return value.toLocaleString()
  }
}
