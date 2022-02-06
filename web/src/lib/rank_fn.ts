export function convertMonday() {
  let today = new Date();

  const day = today.getDay();
  let calcNum = 0;

  if (day === 0) {
    calcNum = -6;
  } else if (day === 1) {
    calcNum = 0;
  } else {
    calcNum = 1 - day;
  }

  today.setDate(today.getDate() + calcNum);

  return today;
}

export function convertDateTimeForamt(value, Separator) {
  value = new Date(value);

  const year = value.getFullYear();
  let month = value.getMonth() + 1;
  let day = value.getDate();
  if (month < 10) {
    month = "0" + month;
  }
  if (day < 10) {
    day = "0" + day;
  }
  Separator = Separator || ".";

  let hours = value.getHours();

  if (hours === 0) hours = "00";

  return year + Separator + month + Separator + day + " " + hours + ":00:00";
}

export function convertMonth() {
  let today = new Date();

  const year = today.getFullYear();
  const month = today.getMonth() + 1;

  if (month < 10) {
    return new Date(`${year}-0${month}-01`);
  } else {
    return new Date(`${year}-${month}-01`);
  }
}

export function changeDate(some: string, dateType: number, currentDate: Date) {
  let day1 = new Date(currentDate);
  let year = day1.getFullYear();
  let month: number | string = day1.getMonth() + 1;
  let date = day1.getDate();

  let handle;
  if (some === "back") {
    switch (dateType) {
      case 1:
        handle = new Date(day1.setDate(day1.getDate() - 1));
        break;
      case 2:
        handle = new Date(day1.setDate(day1.getDate() - 7));
        break;
      case 3:
        if (month === 1) {
          handle = new Date(`${year - 1}-12-01`);
        } else {
          month -= 1;
          if (month < 10) {
            month = "0" + month;
          }
          handle = new Date(`${year}-${month}-01`);
        }
        break;
      case 4:
        console.log(year - 1);
        handle = new Date(`${year - 1}-01-01`);
        break;
    }
  } else {
    switch (dateType) {
      case 1:
        handle = new Date(day1.setDate(day1.getDate() + 1));
        break;
      case 2:
        handle = new Date(day1.setDate(day1.getDate() + 7));
        break;
      case 3:
        if (month === 12) {
          handle = new Date(`${year + 1}-01-01`);
        } else {
          month += 1;
          if (month < 10) {
            month = "0" + month;
          }
          handle = new Date(`${year}-${month}-01`);
        }
        break;
      case 4:
        handle = new Date(`${year + 1}-01-01`);
        break;
    }
  }

  return handle;
}

export function convertDateToText(dateType: number, currentDate: Date, convertType: number) {
  const formDt = new Date(currentDate);
  let formYear = formDt.getFullYear();
  let formMonth = formDt.getMonth() + 1;
  let formDate = formDt.getDate();

  const cDate = new Date();
  let year = cDate.getFullYear();
  let month = cDate.getMonth() + 1;
  let date = cDate.getDate();

  if (convertType === 0) {
    if (dateType === 1) {
      if (year === formYear && month === formMonth && formDate === date) {
        return true;
      }
    } else if (dateType === 2) {
      const currentWeek = convertMonday();
      year = currentWeek.getFullYear();
      month = currentWeek.getMonth() + 1;
      date = currentWeek.getDate();
      if (year === formYear && month === formMonth && formDate === date) {
        return true;
      }
    } else if (dateType === 3) {
      if (year === formYear && month === formMonth) {
        return true;
      }
    } else {
      if (year === formYear) {
        return true;
      }
    }
    return "";
  } else if (convertType === 1) {
    const dayAgo = new Date(new Date().setDate(new Date().getDate() - 1));
    const agoyear = dayAgo.getFullYear();
    const agomonth = dayAgo.getMonth() + 1;
    const agoday = dayAgo.getDate();
    if (dateType === 1) {
      if (year === formYear && month === formMonth && formDate === date) {
        return {
          header: "오늘 실시간",
          date: "실시간 집계 중입니다.",
        };
      } else if (agoyear === formYear && agomonth === formMonth && formDate === agoday) {
        return {
          header: "어제",
          date: "",
        };
      } else {
        return {
          header: `${formYear}.${formMonth}.${formDate}`,
          date: `${formYear}.${formMonth}.${formDate}`,
        };
      }
    } else if (dateType === 2) {
      const currentWeek = convertMonday();
      year = currentWeek.getFullYear();
      month = currentWeek.getMonth() + 1;
      date = currentWeek.getDate();

      const week = convertMonday();
      const weekAgo = new Date(week.setDate(week.getDate() - 7));
      let wYear = weekAgo.getFullYear();
      let wMonth = weekAgo.getMonth() + 1;
      let wDate = weekAgo.getDate();

      if (year === formYear && month === formMonth && formDate === date) {
        return {
          header: "이번주 실시간",
          date: "실시간 집계 중입니다.",
        };
      } else if (formYear === wYear && formMonth === wMonth && formDate === wDate) {
        return {
          header: "지난주",
          date: "",
        };
      } else {
        const a = new Date(formDt.getTime());
        const b = new Date(a.setDate(a.getDate() + 6));
        const rangeMonth = b.getMonth() + 1;
        const rangeDate = b.getDate();
        return {
          header: `${formYear}.${formMonth}. ${Math.ceil(formDate / 7)}주`,
          date: "time",
        };
      }
    } else if (dateType === 3) {
      if (year === formYear && month === formMonth) {
        return {
          header: "이번달 실시간",
          date: "실시간 집계 중입니다.",
        };
      } else if (year === formYear && month - 1 === formMonth) {
        return {
          header: "지난달",
          date: "",
        };
      } else {
        return {
          header: `${formYear}.${formMonth}`,
          date: `${formYear}.${formMonth}`,
        };
      }
    } else {
      if (year === formYear) {
        return {
          header: `${formYear}년 실시간`,
          date: "",
        };
      } else {
        return {
          header: `${formYear}년`,
          date: "",
        };
      }
    }
  }
}

export function convertSetSpecialDate(value: Date) {
  let month: string | number = value.getMonth() + 1;

  if (month < 10) {
    month = "0" + month;
  }

  return {
    year: value.getFullYear(),
    month: month,
  };
}

export function liveBoxchangeDate(some, dateType, currentDate) {
  let day1 = new Date(currentDate);
  let year = day1.getFullYear();
  let month = day1.getMonth() + 1;
  let date = day1.getDate();

  let hours = day1.getHours();
  let handle;
  if (some === "back") {
    switch (dateType) {
      case 1:
        handle = new Date(day1.setDate(day1.getDate() - 1));
        break;
      case 2:
        handle = new Date(day1.setDate(day1.getDate() - 7));
        break;
      case 3:
        if (month === 1) {
          handle = new Date(`${year - 1}-12-01`);
        } else {
          month -= 1;
          if (month < 10) {
            month = 0 + month;
          }
          handle = new Date(`${year}-${month}-01`);
        }
        break;
      case 4:
        handle = new Date(year - 1);
        break;
      case 5:
        if (hours < 10) {
          handle = new Date(day1.setDate(day1.getDate() - 1));

          handle = new Date(handle.getFullYear(), handle.getMonth(), handle.getDate(), 19, 0, 0);
          // handle = new Date(`${handle2.getFullYear()}-${handle2.getMonth() + 1}-${handle2.getDate()}T19:00:00`)

          // alert(handle)
        } else if (hours >= 10 && hours < 19) {
          handle = new Date(year, month - 1, date, 0, 0, 0);

          // handle = new Date(`${year}-${month}-${date}T00:00:00`)
        } else if (hours >= 19) {
          handle = new Date(year, month - 1, date, 10, 0, 0);
          // handle = new Date(`${year}-${month}-${date}T10:00:00`)
        }
        break;
    }
  } else {
    switch (dateType) {
      case 1:
        handle = new Date(day1.setDate(day1.getDate() + 1));
        break;
      case 2:
        handle = new Date(day1.setDate(day1.getDate() + 7));
        break;
      case 3:
        if (month === 12) {
          handle = new Date(`${year + 1}-01-01`);
        } else {
          month += 1;
          if (month < 10) {
            month = 0 + month;
          }
          handle = new Date(`${year}-${month}-01`);
        }
        break;
      case 4:
        handle = new Date(year + 1);
        break;
      case 5:
        if (hours >= 0 && hours < 10) {
          handle = new Date(year, month - 1, date, 10, 0, 0);
          // handle = new Date(`${year}-${month}-${date}T10:00:00`)
        } else if (hours >= 10 && hours < 19) {
          handle = new Date(year, month - 1, date, 19, 0, 0);
          // handle = new Date(`${year}-${month}-${date}T19:00:00`)
        } else if (hours >= 19) {
          handle = new Date(day1.setDate(day1.getDate() + 1));
          handle = new Date(handle.getFullYear(), handle.getMonth(), handle.getDate(), 0, 0, 0);
          // handle = new Date(`${handle.getFullYear()}-${handle.getMonth() + 1}-${handle.getDate()}T00:00:00`)
        }
        break;
    }
  }

  return handle;
}

export const dateTimeConvert = (currentDate: Date) => {
  const hours = currentDate.getHours();

  if (hours < 10) {
    currentDate.setHours(0, 0, 0);
  } else if (hours >= 10 && hours < 19) {
    currentDate.setHours(10, 0, 0);
  } else {
    currentDate.setHours(19, 0, 0);
  }

  return currentDate;
};
