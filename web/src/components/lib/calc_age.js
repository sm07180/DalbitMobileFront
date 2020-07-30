export default function calcAge(birth) {
  let date = new Date()
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  var day = date.getDate()

  if (month < 10) month = '0' + month
  if (day < 10) day = '0' + day
  // let monthDay = Number(month) + Number(day)
  birth = birth.replace('-', '').replace('-', '')
  let birthdayy = birth.substr(0, 4)
  let birthdaymd = birth.substr(4, 4)
  const age = year - Number(birthdayy)
  return age
}
