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
  const [eventCouponCnt, setEventCouponCnt] = useState(0)
  const [summaryList, setSummaryList] = useState({
    attendanceDays: 0,
    totalExp: 0,
    dalCnt: 0
  })
  const [statusList, setStatusList] = useState([])
  const [dateList, setDateList] = useState({})
  const [authCheckYn, setAuthCheckYn] = useState('') //본인인증 할지말지 체크여부

  const [itemNo, setItemNo] = useState(0) //당첨된 아이템
  const [imageUrl, setImageUrl] = useState('')
  const [itemWinMsg, setItemWinMsg] = useState('')

  const [winPhone, setWinPhone] = useState(0)
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
    eventCouponCnt,
    summaryList,
    statusList,
    dateList,
    authCheckYn,
    popGifticon,
    winIdx,
    itemNo,
    imageUrl,
    itemWinMsg,
    winPhone,
    ios,
    rouletteInfo,
    start
  }

  const eventAttendAction = {
    setTab,
    setPopRoulette,
    setCouponCnt,
    setEventCouponCnt,
    setSummaryList,
    setStatusList,
    setDateList,
    setAuthCheckYn,
    setPopGifticon,
    setWinIdx,
    setImageUrl,
    setItemWinMsg,
    setItemNo,
    setWinPhone,
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
