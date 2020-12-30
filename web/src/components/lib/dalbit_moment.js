const formattingTokens = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|N{1,5}|YYYYYY|YYYYY|YYYY|YY|y{2,4}|yo?|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g

export function convertDateFormat(date, format) {
  const pretreatmentDate = propsDatePretreatment(date)

  const formatArray = format.match(formattingTokens)

  let returnValue = ''

  formatArray?.forEach((v) => {
    returnValue += checkFormatObj[v] ? checkFormatObj[v](pretreatmentDate) : v
  })

  return returnValue
}

function prefendZeros(props) {
  const returnString = props < 10 ? '0' + props : props.toString()

  return returnString
}

// props Date Item return Type Date.
function propsDatePretreatment(props) {
  if (props instanceof Date) {
    return props
  } else {
    if (props.length === 8) {
      return new Date([props.substr(0, 4), props.substr(4, 2), props.substr(6, 2)].join('-'))
    } else if (props.includes('-')) {
      return new Date(props)
    } else if (props.includes('.')) {
      return new Date(props.replaceAll('.', '-'))
    } else {
      throw Error
    }
  }
}

const checkFormatObj = {
  YYYY: function (date) {
    return date.getFullYear().toString()
  },
  yyyy: function (date) {
    return date.getFullYear().toString()
  },
  YY: function (date) {
    return (date.getFullYear() % 100).toString()
  },
  yy: function (date) {
    return (date.getFullYear() % 100).toString()
  },
  MM: function (date) {
    return prefendZeros(date.getMonth() + 1)
  },
  M: function (date) {
    return (date.getMonth() + 1).toString()
  },
  dd: function (date) {
    return prefendZeros(date.getDate()).toString()
  },
  d: function (date) {
    return date.getDate().toString()
  },
  DD: function (date) {
    return prefendZeros(date.getDate()).toString()
  },
  D: function (date) {
    return date.getDate().toString()
  },

  HH: function (date) {
    return prefendZeros(date.getHours())
  },
  H: function (date) {
    return date.getHours().toString()
  },
  hh: function (date) {
    return hourTypeSetting(date)
  },
  h: function (date) {
    return hourTypeSetting(date)
  },
  mm: function (date) {
    return prefendZeros(date.getMinutes())
  },
  m: function (date) {
    return date.getMinutes().toString()
  },

  ss: function (date) {
    return prefendZeros(date.getSeconds())
  },
  s: function (date) {
    return date.getSeconds().toString()
  }
}

function hourTypeSetting(date) {
  const hours = date.getHours()

  if (hours > 12) {
    return prefendZeros(hours - 12)
  } else if (hours < 12) {
    return prefendZeros(hours)
  } else {
    return '12'
  }
}
