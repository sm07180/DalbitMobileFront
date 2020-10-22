import React, {useContext, useEffect, useRef, useState} from 'react'
import {AttendContext} from '../attend_ctx'
import {IMG_SERVER} from 'context/config'
import {useHistory} from 'react-router-dom'

// component
import Layout from 'pages/common/layout'
import AttendPage from './attend'
import RoulettePage from './roulette'
import qs from 'query-string'
import {Hybrid, isHybrid} from 'context/hybrid'

export default () => {
  const history = useHistory()
  const {eventAttendState, eventAttendAction} = useContext(AttendContext)
  const {tab} = eventAttendState
  const {webview, type} = qs.parse(location.search)

  const commonTopRef = useRef()
  const tabRef = useRef()

  const [tabFixed, setTabFixed] = useState(false)

  const clickCloseBtn = () => {
    if (isHybrid() && webview && webview === 'new') {
      Hybrid('CloseLayerPopup')
    } else {
      return history.goBack()
    }
  }

  const windowScrollEvent = () => {
    let scroll = window.scrollY || window.pageYOffset

    if (scroll >= commonTopRef.current.clientHeight) {
      setTabFixed(true)
    } else {
      setTabFixed(false)
    }
  }

  //-------------------
  useEffect(() => {
    if (type === 'roulette') {
      eventAttendAction.setTab('roulette')
    } else {
      eventAttendAction.setTab('attend')
    }

    window.addEventListener('scroll', windowScrollEvent)
    return () => {
      window.removeEventListener('scroll', windowScrollEvent)
    }

    cons
  }, [])

  return (
    <div id="attendEventPage">
      <Layout status="no_gnb">
        <div className="commonTopWrap" ref={commonTopRef}>
          <button className="btnBack" onClick={() => clickCloseBtn()}>
            <img src="https://image.dalbitlive.com/svg/close_w_l.svg" alt="close" />
          </button>
          <img src={`${IMG_SERVER}/event/attend/201019/event_img_top@2x.png`} />
        </div>

        <div className={`tabWrap ${tabFixed ? 'fixed' : ''}`} ref={tabRef}>
          <button
            type="button"
            onClick={() => eventAttendAction.setTab('attend')}
            className={`btnAttend ${tab === 'attend' ? 'active' : ''}`}>
            출석 이벤트
          </button>
          <button
            type="button"
            onClick={() => eventAttendAction.setTab('roulette')}
            className={`btnRoul ${tab === 'roulette' ? 'active' : ''}`}>
            룰렛 이벤트
          </button>
        </div>

        <div className={`tabContent ${tabFixed ? 'isTop' : ''}`}>{tab === 'attend' ? <AttendPage /> : <RoulettePage />}</div>
      </Layout>
    </div>
  )
}
