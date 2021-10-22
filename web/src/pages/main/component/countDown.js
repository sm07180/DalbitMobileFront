import React, {useState, useEffect} from 'react'

import moment from 'moment'
moment.locale('ko')

export default (props) => {
  const [hours, setHours] = useState()
  const [minutes, setMinutes] = useState()
  const [seconds, setSeconds] = useState()
  useEffect(() => {
    const interval = setInterval(() => {
      const {timeTillDate, timeFormat} = props
      const then = moment(timeTillDate, timeFormat).format('HHmmss')
      const now = moment().format('HHmmss')
      const hours = then.substring(0, 2) - now.substring(0, 2)
      const minutes = then.substring(2, 4) - now.substring(2, 4)
      const seconds = then.substring(4, 6) - now.substring(4, 6)

      setHours(hours)
      setMinutes(minutes)
      setSeconds(seconds)
      console.log(hours, minutes, seconds)
    }, 1000)
    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [hours, minutes, seconds])

  return (
    <div className="realTimer-wrap">
      <span className="realTime">
        마감까지 {hours < 10 ? `0${hours}` : hours} : {minutes < 10 ? `0${minutes}` : minutes} :{' '}
        {seconds < 10 ? `0${seconds}` : seconds} 남았습니다.
      </span>
    </div>
  )
}
