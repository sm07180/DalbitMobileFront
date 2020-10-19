import React, {useState, createContext} from 'react'
//Context
const AttendContext = createContext()
const {Provider} = AttendContext
//
const EventAttendProvider = (props) => {
  //state
  const [tab, setTab] = useState('attend')
  const [popRoulette, setPopRoulette] = useState(false)
  const [couponCnt, setCouponCnt] = useState(-1)
  const [summaryList, setSummaryList] = useState({
    attendanceDays: 0,
    totalExp: 0,
    dalCnt: 0
  })
  const [statusList, setStatusList] = useState([])
  const [dateList, setDateList] = useState({})

  //---------------------------------------------------------------------

  const eventAttendState = {
    tab,
    popRoulette,
    couponCnt,
    summaryList,
    statusList,
    dateList
  }

  const eventAttendAction = {
    setTab,
    setPopRoulette,
    setCouponCnt,
    setSummaryList,
    setStatusList,
    setDateList
  }

  const bundle = {
    eventAttendState,
    eventAttendAction
  }

  // const action = {
  //   updateTab: (str) => {
  //     setTab(str)
  //   },

  //   updatePopRoulette: (bool) => {
  //     setPopRoulette(bool)
  //   }
  // }
  //---------------------------------------------------------------------
  // const value = {tab, popRoulette, action}
  return <Provider value={bundle}>{props.children}</Provider>
}
export {AttendContext, EventAttendProvider}
