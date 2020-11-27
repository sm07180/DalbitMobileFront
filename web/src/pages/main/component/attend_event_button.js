import React, {useContext, useEffect, useState} from 'react'
import API from 'context/api'
import {Context} from 'context'
import {useHistory} from 'react-router-dom'
import Lottie from 'react-lottie'
// static
import stampActive from '../static/stamp_active.json'
import './style/attend_event_button.scss'

export default (props) => {
  const history = useHistory()
  const context = useContext(Context)
  const globalCtx = useContext(Context)
  const {token} = globalCtx
  const [attendCheck, setAttendCheck] = useState(-1)

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
          }}></div>
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
          <Lottie
            options={{
              loop: true,
              autoPlay: true,
              animationData: stampActive
            }}
          />
        </div>
      )
    } else if (token.isLogin && attendCheck === 2) {
      return (
        <div
          className="attendStampActive rouletteStampActive"
          onClick={() => {
            try {
              fbq('track', 'attend_event')
              firebase.analytics().logEvent('attend_event')
            } catch (e) {}
            history.push('/event/attend_event/roulette')
          }}></div>
      )
    }
  }

  return <div className={`fixedButton ${context.player ? 'usePlayer' : ''}`}>{urlrStr !== '/rank' && attendStampState()}</div>
}
