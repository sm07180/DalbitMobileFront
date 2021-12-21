import React, {useContext, useEffect, useState} from 'react'
import API from 'context/api'
import {Context} from 'context'
import {useHistory} from 'react-router-dom'
import Lottie from 'react-lottie'
import {IMG_SERVER} from 'context/config'
// static
import stampActive from '../static/stamp_active.json'

export default (props) => {
  const history = useHistory()
  const context = useContext(Context)
  const globalCtx = useContext(Context)
  const {token} = globalCtx
  const [attendCheck, setAttendCheck] = useState(-1) // 0 - 완료, 1 - 시간부족, 2 -- 시간충족

  //pathname
  const urlrStr = history.location.pathname

  //출석도장
  async function fetchEventAttendCheck() {
    const {result, data} = await API.getEventAttendCheck()
    if (result === 'success') {
      const {userEventCheck} = data
      setAttendCheck(userEventCheck)
    } else {
      //실패
    }
  }

  useEffect(() => {
    fetchEventAttendCheck()
  }, [])

  const attendStampState = () => {
    if (token.isLogin && attendCheck === 0) {
      return (
        <div
          className={`attendStampActive basic ${token.isLogin && attendCheck === 0 && 'on'}`}
          onClick={() => {
            try {
              fbq('track', 'attend_event')
              firebase.analytics().logEvent('attend_event')
            } catch (e) {}
            history.push('/event/attend_event')
          }}/>
      )
    } else if (token.isLogin && attendCheck === 1) {
      return (
        <div
          className="attendStampActive"
          onClick={() => {
            try {
              fbq('track', 'attend_event')
              firebase.analytics().logEvent('attend_event')
            } catch (e) {}
            history.push('/event/attend_event')
          }}>
          <img src={`${IMG_SERVER}/webp/attend_stamp.webp`} alt="attend stamp active" width={48} height={48} />
        </div>
      )
    } else if (token.isLogin && attendCheck === 2) {
      return (
        <div
          className="attendStampActive motion"
          onClick={() => {
            try {
              fbq('track', 'attend_event')
              firebase.analytics().logEvent('attend_event')
            } catch (e) {}
            history.push('/event/attend_event/roulette')
          }}/>
      )
    }
  }

  return (
    <div className={`fixedButton ${context.player ? 'usePlayer' : ''}`}>
      {props.scrollOn && (urlrStr !== '/rank' && attendStampState())}
    </div>
  )

}
