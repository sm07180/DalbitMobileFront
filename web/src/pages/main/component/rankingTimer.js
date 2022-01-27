import React, {useCallback, useEffect, useState} from 'react'
import moment from 'moment'

export default (props) => {
  const {round, setRoundTitle} = props
  const [rankingCountDownInfo, setRankingCountDownInfo] = useState({
    roundIndex: -1,
    showTimeYn: 'n',
    timerForm: ''
  })

  const toTime = useCallback((num) => {
    try {
      let myNum = parseInt(num, 10)
      let hours = Math.floor(myNum / 3600)
      let minutes = Math.floor((myNum - hours * 3600) / 60)
      let seconds = myNum - hours * 3600 - minutes * 60

      if (hours < 10) {
        hours = '0' + hours
      }
      if (minutes < 10) {
        minutes = '0' + minutes
      }
      if (seconds < 10) {
        seconds = '0' + seconds
      }
      return `${hours} : ${minutes} : ${seconds}`
    } catch (e) {
      return '00:00:00'
    }
  }, [])

  const timerInfo = useCallback(() => {
    const nowTime = moment().format('HHmmss')
    const nowTimeToNumber = parseInt(nowTime)
    let roundIndex = 0
    let showTimeYn = 'n'

    for (let i = 0; i < round.length; i++) {
      if (round[i].start <= nowTimeToNumber) {
        roundIndex = i
        if (round[i].timer <= nowTimeToNumber && nowTimeToNumber <= round[i].end) {
          showTimeYn = 'y'
        }
      }
    }

    return {nowTime, roundIndex, showTimeYn}
  }, [])

  const timerInit = useCallback(() => {
    const {nowTime, roundIndex, showTimeYn} = timerInfo()
    const remainTime = timeDiff(round[roundIndex].end, nowTime)
    const timerForm = toTime(remainTime)
    const roundTitle = `(${round[roundIndex].title})`

    setRoundTitle(roundTitle)
    setRankingCountDownInfo({...rankingCountDownInfo, roundIndex, showTimeYn, timerForm})
  }, [])

  const timeDiff = useCallback((obj1, obj2) => {
    const obj1Hour = obj1.substring(0, 2)
    const obj1Min = obj1.substring(2, 4)
    const obj1Sec = obj1.substring(4, 6)
    const obj2Hour = obj2.substring(0, 2)
    const obj2Min = obj2.substring(2, 4)
    const obj2Sec = obj2.substring(4, 6)

    const hour = obj1Hour * 3600 - obj2Hour * 3600
    const min = obj1Min * 60 - obj2Min * 60
    const sec = obj1Sec - obj2Sec

    return hour + min + sec
  }, [])

  useEffect(() => {
    timerInit()
  }, [])

  useEffect(() => {
    if (rankingCountDownInfo.showTimeYn === 'y') {
      const {roundIndex} = timerInfo()
      const end = round[roundIndex].end
      const rankingInterval = setInterval(() => {
          const nowTime = moment().format('HHmmss')
          const remainTime = timeDiff(end, nowTime)
          const timerForm = toTime(remainTime)
          const {roundIndex, showTimeYn} = timerInfo()
          if (showTimeYn === 'n') {
            clearInterval(rankingInterval)
          }
          setRankingCountDownInfo({...rankingCountDownInfo, /*roundIndex,*/ showTimeYn, timerForm})
      }, 1000)
      return () => {
        if (rankingInterval) {
          clearInterval(rankingInterval)
        }
      }
    }
  }, [rankingCountDownInfo.roundIndex])
  return (
    <>
      {rankingCountDownInfo.showTimeYn === 'y' && (
        <div className="realTimer-wrap">
          <div className="realTime">
            마감까지 <span className="strong">{rankingCountDownInfo.timerForm}</span> 남았습니다.
          </div>
          <span className="sub">실시간 랭킹 1~3위 달성 시 스페셜DJ 가산점 획득!</span>
        </div>
      )}
    </>
  )
}
