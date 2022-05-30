import React, {useState, useCallback, useLayoutEffect} from 'react'

import './index.scss'

import {useHistory} from 'react-router-dom'

import API from 'context/api'

import GuidePage from './components/guide'
import WizardPage from './components/wizard'
import HouseOwnerPage from './components/houseowner'

import {moonRiseBtnArray} from './constant'

export default function () {
  const history = useHistory()
  const [tabState, setTabState] = useState('가이드')
  const [moonRiseTime, setMoonRisTime] = useState({
    fullmoonIdx: 0,
    fullmoonText: '',
    fullmoonDuration: ''
  })

  const fetchMoonTime = useCallback(async () => {
    const {result, data} = await API.getMoonRiseTime({})
    if (result === 'success') {
      setMoonRisTime({
        fullmoonIdx: data.fullmoon_idx,
        fullmoonText: data.fullmoon_text,
        fullmoonDuration: data.fullmoon_duration
      })
    } else {
    }
  }, [])

  useLayoutEffect(() => {
    fetchMoonTime()
  }, [])

  const MakeView = useCallback(() => {
    switch (tabState) {
      case '가이드': {
        return <GuidePage />
      }
      case '문법사': {
        return <WizardPage moonRiseTime={moonRiseTime.fullmoonIdx} />
      }
      case '문집사': {
        return <HouseOwnerPage moonRiseTime={moonRiseTime.fullmoonIdx} />
      }
      default:
        return <></>
    }
  }, [tabState])

  return (
    <div id="moonRise">
      <button className="btnBack" onClick={() => history.goBack()}>
        <img src="https://image.dallalive.com/svg/close_w_l.svg" alt="close" />
      </button>
      <div className="share_header">
        <img src="https://image.dallalive.com/event/moonrise/img_title.png" alt="달띄우기상단공통이미지" />
        {/* <span className="share_topDate riseDate">{moonRiseTime.fullmoonText}</span> */}
        <span className="share_topDate wholeDate">{moonRiseTime.fullmoonDuration}</span>
      </div>
      <div className="share_tabWrap">
        {moonRiseBtnArray.map((tabItem, idx) => {
          const {title, id, srcOn, srcOff} = tabItem
          return (
            <button key={`${title} + ${id}`} className="share_tabItem" onClick={() => setTabState(title)}>
              <img src={title === tabState ? srcOn : srcOff} alt={`달띄우기공통탭${title}`} />
            </button>
          )
        })}
      </div>
      <MakeView />
    </div>
  )
}
