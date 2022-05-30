import React, {useState, useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import API from 'context/api'

import ResultDj from './tab_result_dj'
import ResultFan from './tab_result_fan'

export const RESULT_TYPE = {
  DJ: 1,
  FAN: 2
}

export default function awardEventResult() {
  const history = useHistory()
  const [tabState, setTabState] = useState(1) //dj, fan
  const [resultList, setResultList] = useState(null)

  const clickCloseBtn = () => {
    return history.goBack()
  }

  async function fetchAwardList() {
    const {result, data} = await API.getAwardResult({
      year: '2020',
      slctType: tabState
    })
    if (result === 'success') {
      setResultList(data.list)
    } else {
      console.log('실패')
    }
  }

  //-----------------

  useEffect(() => {
    fetchAwardList()
  }, [tabState])

  return (
    <>
      <div className="topBox">
        <button className="btnBack" onClick={() => clickCloseBtn()}>
          <img src="https://image.dallalive.com/svg/close_w_l.svg" alt="close" />
        </button>
        <img src="https://image.dallalive.com/event/award/201214/main-result.png" className="topBox__mainImg" alt="main Image" />
      </div>

      <div className="tabBox result">
        <button className={`btn ${tabState === RESULT_TYPE.DJ && 'active'}`} onClick={() => setTabState(RESULT_TYPE.DJ)}>
          <img src="https://image.dallalive.com/event/award/201214/tab_dj_top.png" />
        </button>
        <button className={`btn ${tabState === RESULT_TYPE.FAN && 'active'}`} onClick={() => setTabState(RESULT_TYPE.FAN)}>
          <img src="https://image.dallalive.com/event/award/201214/tab_fan_top.png" />
        </button>
      </div>
      {tabState === RESULT_TYPE.DJ && <ResultDj resultList={resultList} />}
      {tabState === RESULT_TYPE.FAN && <ResultFan resultList={resultList} />}
    </>
  )
}
