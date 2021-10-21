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
      const then = moment(timeTillDate, timeFormat)
      const now = moment()
      const countdown = moment(then - now)
      const hours = countdown.hours()
      const minutes = countdown.minutes()
      const seconds = countdown.seconds()

      setHours(hours)
      setMinutes(minutes)
      setSeconds(seconds)
      console.log(now, then, countdown, seconds)
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
        마감까지 {hours} : {minutes} : {seconds} 남았습니다.
      </span>
    </div>
  )
}
