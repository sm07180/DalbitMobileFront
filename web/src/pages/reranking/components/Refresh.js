import React, {useEffect, useState} from 'react'

const Refresh = (props) => {
  const {period, setPeriod} = props;
  const [refresh, setRefresh] = useState({
    text: "",
    num: 0
  })

  useEffect(() => {
    switch (period) {
      case "time":
        setRefresh({text: "일간 랭킹", num: 1})
        break;
      case "today":
        setRefresh({text: "주간 랭킹", num: 2})
        break;
      case "week":
        setRefresh({text: "월간 랭킹", num: 3})
        break;
      case "month":
        setRefresh({text: "연간 랭킹", num: 4})
        break;
      case "year":
        setRefresh({text: "타임 랭킹", num: 5})
        break;
    }
  }, [period])

  const chartSelect = () => {
    switch (refresh.text) {
      case "일간 랭킹":
        setPeriod("today")
        break;
      case "주간 랭킹":
        setPeriod("week")
        break;
      case "월간 랭킹":
        setPeriod("month")
        break;
      case "연간 랭킹":
        setPeriod("year")
        break;
      case "타임 랭킹":
        setPeriod("time")
        break;
    }
  }

  return (
    <div className='refreshWrap' onClick={chartSelect}>
      <span className='refreshIcon'/>
      <p className='refreshText'><strong>{refresh.text}</strong>이 궁금하다면?</p>
      <span className='refreshNum'><span>{refresh.num}</span>/5</span>
    </div>
  )
}

export default Refresh;
