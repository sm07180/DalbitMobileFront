import React, {useState, createContext} from 'react'

import {WIN_TYPE} from './constant'

//Context
const AttendContext = createContext()
const {Provider} = AttendContext
//
const EventAttendProvider = (props) => {
  //state
  const [tab, setTab] = useState('attend') //attend, roulette
  const [popRoulette, setPopRoulette] = useState(false)
  const [popGifticon, setPopGifticon] = useState(false)
  const [winIdx, setWinIdx] = useState(-1)
  const [couponCnt, setCouponCnt] = useState(0)
  const [summaryList, setSummaryList] = useState({
    attendanceDays: 0,
    totalExp: 0,
    dalCnt: 0
  })
  const [statusList, setStatusList] = useState([])
  const [dateList, setDateList] = useState({})
  const [itemNo, setItemNo] = useState(0) //당첨된 아이템

  const [ios, setIos] = useState('')
  const [rouletteInfo, setRouletteInfo] = useState('')
  const [start, setStart] = useState({
    inputEndDate: '00:00'
  })

  //---------------------------------------------------------------------

  const eventAttendState = {
    tab,
    popRoulette,
    couponCnt,
    summaryList,
    statusList,
    dateList,
    popGifticon,
    winIdx,
    itemNo,
    ios,
    rouletteInfo,
    start
  }

  const eventAttendAction = {
    setTab,
    setPopRoulette,
    setCouponCnt,
    setSummaryList,
    setStatusList,
    setDateList,
    setPopGifticon,
    setWinIdx,
    setItemNo,
    setIos,
    setRouletteInfo,
    setStart
  }

  const bundle = {
    eventAttendState,
    eventAttendAction
  }

  //---------------------------------------------------------------------

  return <Provider value={bundle}>{props.children}</Provider>
}
export {AttendContext, EventAttendProvider}
