import React, {useContext, useEffect, useRef, useState} from 'react'
import {useParams} from 'react-router-dom'
import {AttendContext} from '../attend_ctx'

// component
import Layout from 'pages/common/layout'
import AttendPage from './attend'
import RoulettePage from './roulette'
import GiftWinner from './roulette/gift_winner'

export default () => {
  const {eventAttendState, eventAttendAction} = useContext(AttendContext)
  const {tab} = eventAttendState

  const params = useParams()
  const {title} = params

  const commonTopRef = useRef()
  const tabRef = useRef()

  const [tabFixed, setTabFixed] = useState(false)

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
    window.addEventListener('scroll', windowScrollEvent)
    return () => {
      window.removeEventListener('scroll', windowScrollEvent)
    }
  }, [])

  if (title === 'winList') return <GiftWinner />
  else {
    return (
      <div id="attendEventPage">
        <Layout status="no_gnb">
          <div className="commonTopWrap" ref={commonTopRef}>
            탑배너
          </div>

          <div className={`tabWrap ${tabFixed ? 'fixed' : ''}`} ref={tabRef}>
            <button
              type="button"
              onClick={() => eventAttendAction.setTab('attend')}
              className={`${tab === 'attend' ? 'active' : ''}`}>
              출석 이벤트
            </button>
            <button
              type="button"
              onClick={() => eventAttendAction.setTab('roulette')}
              className={`${tab === 'roulette' ? 'active' : ''}`}>
              룰렛 이벤트
            </button>
          </div>

          <div className={`tabContent ${tabFixed ? 'isTop' : ''}`}>{tab === 'attend' ? <AttendPage /> : <RoulettePage />}</div>
        </Layout>
      </div>
    )
  }
}
