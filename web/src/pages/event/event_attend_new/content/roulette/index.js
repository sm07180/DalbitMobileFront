import React, {useContext, useEffect} from 'react'
import {useHistory} from 'react-router-dom'

import API from 'context/api'
import {AttendContext} from '../../attend_ctx'

import Notice from '../notice'
import PopRoulette from './popRoulette'

export default function RouletteTab() {
  const history = useHistory()

  const {eventAttendState, eventAttendAction} = useContext(AttendContext)
  const {popRoulette} = eventAttendState

  async function fetchEventRouletteCoupon() {
    const {result, data} = await API.getEventRouletteCoupon()
    if (result === 'success') {
      eventAttendAction.setCouponCnt(data.couponCnt)
    }
  }

  //----------------------------------
  useEffect(() => {
    fetchEventRouletteCoupon()
  }, [])

  return (
    <div className="rouletteTab">
      <div className="topBanner">룰렛이벤트입니다.</div>

      <button>내 참여내역</button>

      <div> 나의 룰렛이벤트 응모 티켓수 {eventAttendState.couponCnt}개</div>

      <button onClick={() => history.push('/event_attend/winList')}>기프티콘 당첨</button>
      <div>
        {eventAttendState.couponCnt === 0 ? (
          <button type="button" onClick={() => eventAttendAction.setPopRoulette(popRoulette ? false : true)}>
            룰렛스타트
          </button>
        ) : (
          <button type="button">룰렛스타드(없음)</button>
        )}
      </div>
      <div>
        <Notice />
      </div>

      {popRoulette && <PopRoulette />}
    </div>
  )
}
