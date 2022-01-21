let week = [
  "일요일",
  "월요일",
  "화요일",
  "수요일",
  "목요일",
  "금요일",
  "토요일",
];
export function dateFormat(value: string, Separator?: string) {
  let date = value.slice(0, 8);
  date = [date.slice(0, 4), date.slice(4, 6), date.slice(6)].join(
    Separator || "."
  );
  // let time = strFormatFromServer.slice(8)
  // time = [time.slice(0, 2), time.slice(2, 4), time.slice(4)].join(':')
  return `${date}`;
}

export function dateTimeFormat(
  value: string,
  Separtor?: string,
  timeSepartor?: string
) {
  let date = value.slice(0, 8);
  date = [date.slice(0, 4), date.slice(4, 6), date.slice(6)].join(
    Separtor || "."
  );
  let time = value.slice(8);
  time = [time.slice(0, 2), time.slice(2, 4), time.slice(4)].join(
    timeSepartor || ":"
  );
  return `${date} ${time}`;
}
export function TimeFormat(
  value: string,
  Separtor?: string,
  timeSepartor?: string
) {
  let time = value.slice(8);
  time = [time.slice(0, 2), time.slice(2, 4), time.slice(4)].join(
    timeSepartor || ":"
  );
  return ` ${time}`;
}

export function convertDateFormat(value: Date, Separator?: string) {
  const year = value.getFullYear();
  let month: string | number = value.getMonth() + 1;
  let day: string | number = value.getDate();
  if (month < 10) {
    month = "0" + month;
  }
  if (day < 10) {
    day = "0" + day;
  }
  Separator = Separator || ".";
  return year + Separator + month + Separator + day;
}

//only Timechecker
export function settingAlarmTime(num) {
  const alarmTime = num;
  const today = Math.floor(new Date().getTime() / 1000);
  const betweenTime = (today - alarmTime) / 60;

  if (betweenTime < 1) return "방금전";
  if (betweenTime < 60) {
    return `${Math.floor(betweenTime)}분전`;
  }
  const betweenTimeHour = Math.floor(betweenTime / 60);
  if (betweenTimeHour < 24) {
    return `${betweenTimeHour}시간전`;
  }

  const betweenTimeDay = Math.floor(betweenTime / 60 / 24);
  if (betweenTimeDay < 365) {
    return `${betweenTimeDay}일전`;
  }
}

export function calcAge(birth: string) {
  let date = new Date();
  let year = date.getFullYear();
  let month: string | number = date.getMonth() + 1;
  var day: string | number = date.getDate();

  if (month < 10) month = "0" + month;
  if (day < 10) day = "0" + day;
  // let monthDay = Number(month) + Number(day)
  birth = birth.replace("-", "").replace("-", "");
  let birthdayy = birth.substr(0, 4);
  let birthdaymd = birth.substr(4, 4);
  const age = year - Number(birthdayy);
  return age;
}

// number K 표시
export function printNumber(value: number) {
  if (value === undefined) {
    return 0;
  } else if (value > 9999 && value < 100000) {
    return Math.floor((value / 1000.0) * 10) / 10 + "K";
  } else if (value >= 100000) {
    return Math.floor(value / 1000) + "K";
  } else {
    return value.toLocaleString();
  }
}

export function leadingZeros(data, num) {
  let zero = "";
  data = data.toString();
  if (data.length < num) {
    for (var i = 0; i < num - data.length; i++) {
      zero += "0";
    }
  }
  return zero + data;
}

// email 형식 check
export function emailInpection(email: string) {
  const regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

  return regExp.test(email);
}

export function stringTimeFormatConvertor(strTime: string) {
  const year = strTime.slice(0, 4);
  const month = strTime.slice(4, 6);
  const day = strTime.slice(6, 8);
  const hour = strTime.slice(8, 10);
  const min = strTime.slice(10, 12);
  const sec = strTime.slice(12, 14);
  return `${year}-${month}-${day} ${hour}:${min}:${sec}`;
}

export function secToDateConvertor(totalSec: number) {
  let hour: string | number = Math.floor(totalSec / 3600);
  totalSec -= 3600 * hour;
  let min: string | number = Math.floor(totalSec / 60);
  totalSec -= 60 * min;
  let sec: string | number = totalSec;

  hour = hour > 9 ? hour : `0${hour}`;
  min = min > 9 ? min : `0${min}`;
  sec = sec > 9 ? sec : `0${sec}`;
  return `${hour}:${min}:${sec}`;
}
export function secToDateConvertorMinute(totalSec: number) {
  let min: string | number = Math.floor(totalSec / 60);
  totalSec -= 60 * min;
  let sec: string | number = totalSec;

  min = min > 9 ? min : `0${min}`;
  sec = sec > 9 ? sec : `0${sec}`;
  return `${min}:${sec}`;
}
export function addComma(x: number) {
  if (x === undefined || x === null) return 0;
  try {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  } catch {
    return 0;
  }
}

// Rank DateConverter..
export function convertMonday() {
  let today = new Date();

  const day = today.getDay();
  let calcNum = 0;

  if (day === 0) {
    calcNum = 1;
  } else if (day === 1) {
    calcNum = 0;
  } else {
    calcNum = 1 - day;
  }

  today.setDate(today.getDate() + calcNum);

  return today;
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
//년월일
export function dateFormatter(num, type = "") {
  if (!num) return "";
  var formatNum = "";
  // 공백제거
  num = num.replace(/\s/gi, "");
  num = num.substr(0, 8);
  try {
    if (num.length == 8) {
      if (type == "dot") {
        formatNum = num.replace(/(\d{4})(\d{2})(\d{2})/, "$1.$2.$3");
      } else if (type === "slash") {
        // yy/mm/dd
        formatNum = num.slice(2).replace(/(\d{2})(\d{2})(\d{2})/, "$1/$2/$3");
      } else {
        formatNum = num.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");
      }
    }
  } catch (e) {
    formatNum = num;
    console.log(e);
  }
  return formatNum;
}
//년월일
export function dateFormatterKor(num, type) {
  if (!num) return "";
  var formatNum = "";
  // 공백제거
  num = num.replace(/\s/gi, "");
  num = num.substr(0, 8);
  try {
    if (num.length == 8) {
      if (type == "dot") {
        formatNum = num.replace(/(\d{4})(\d{2})(\d{2})/, "$1.$2.$3");
      } else {
        formatNum = num.replace(/(\d{4})(\d{2})(\d{2})/, "$1년 $2월$3일");
      }
    }
  } catch (e) {
    formatNum = num;
    console.log(e);
  }
  return formatNum;
}

export function calcDate(sDate, diff) {
  if (sDate === null || diff === null) return "";

  sDate.setDate(sDate.getDate() + diff);
  return sDate;
}
// 월일 요일
export function dateFormatterKorDay(num) {
  if (!num) return "";
  var formatNum = "";
  let formatDay = "";

  let year = num.substring(0, 4);
  let month = num.substring(4, 6);
  let day = num.substring(6, 8);

  month = parseInt(month) - 1;

  if (month < 10) {
    month = "0" + month;
  }

  formatDay = week[new Date(year, month, day).getDay()];

  // 공백제거
  num = num.replace(/\s/gi, "");
  num = num.substr(0, 8);
  try {
    formatNum = num.replace(/(\d{4})(\d{2})(\d{2})/, "$2월 $3일 ");
  } catch (e) {
    formatNum = num;
    console.log(e);
  }
  return formatNum + formatDay;
}

// 시간과 분 string으로 입력
// ex) 1324 -> 오후 1:24
export function makeHourMinute(date: string) {
  let hourText = "오전";
  let hour = Number(date.slice(0, 2));
  const minute = date.slice(2, 4);
  if (hour === 0) {
    hour = 12;
  }
  if (hour > 12) {
    hourText = "오후";
    hour = hour - 12;
  }
  return `${hourText} ${hour}:${minute}`;
}

export function dateConvertString(value: Date, format: string) {
  let years = value.getFullYear();
  let month: number | string = value.getMonth() + 1;
  let date: number | string = value.getDate();

  switch (format) {
    case "YYYYMMDD":
      if (month < 10) {
        month = "0" + month;
      }

      if (date < 10) {
        date = "0" + date;
      }

      return `${years}${month}${date}`;
    case "YYYY.MM.DD":
      if (month < 10) {
        month = "0" + month;
      }

      if (date < 10) {
        date = "0" + date;
      }

      return `${years}.${month}.${date}`;
  }
}

/**
 * refer to: https://levelup.gitconnected.com/debounce-in-javascript-improve-your-applications-performance-5b01855e086
 */
export const debounceFn = (callback: Function, delay: number) => {
  let timeout: number | any ;

  return (...args: any[]) => {
    const later = () => {
      clearTimeout(timeout);
      callback(...args); // ..args is an event
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, delay);
  };
};

export const getWindowBottom = () => {
  const windowHeight =
    "innerHeight" in window
      ? window.innerHeight
      : document.documentElement.offsetHeight;
  const body = document.body;
  const html = document.documentElement;
  const docHeight = Math.max(
    body.scrollHeight,
    body.offsetHeight,
    html.clientHeight,
    html.scrollHeight,
    html.offsetHeight
  );
  const windowBottom = windowHeight + window.pageYOffset;
  const diff = 300;

  return windowBottom >= docHeight - diff;
};

export const contactRemoveUnique = (
  original: Array<any>,
  newArray: Array<any>,
  keyName: string
) => {
  if (
    original === undefined ||
    original === null ||
    !Array.isArray(original) ||
    original.length < 1
  ) {
    return newArray;
  } else if (
    newArray === undefined ||
    newArray === null ||
    !Array.isArray(newArray) ||
    newArray.length < 1
  ) {
    return original;
  } else {
    let originalObj = {};
    let newObj = {};

    original.forEach((v) => {
      originalObj[v[keyName]] = v;
    });

    newArray.forEach((v) => {
      newObj[v[keyName]] = v;
    });

    console.log(originalObj);

    let Unique = Object.entries(originalObj)
      .filter((key: any) => {
        if (newObj[key]) {
          return false;
        } else {
          return true;
        }
      })
      .map((v) => {
        return v[1];
      });

    let uniqueArray = Unique.concat(newArray);
    return uniqueArray;
  }
};

export const nl2br = (text: any) => {
  if (text && text !== "") {
    return text.replace(/(?:\r\n|\r|\n)/g, "<br />");
  }
};
