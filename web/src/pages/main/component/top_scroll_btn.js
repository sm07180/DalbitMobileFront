import React, {useContext, useEffect, useState} from 'react'
import styled from 'styled-components'
import API from 'context/api'
import {Context} from 'context'
import {Link, useHistory} from 'react-router-dom'

// static
import TopScrollIcon from '../static/ic_circle_top.svg'

export default (props) => {
  const history = useHistory()
  const globalCtx = useContext(Context)
  const {token} = globalCtx
  const {logoChange} = globalCtx

  const [attendCheck, setAttendCheck] = useState(false)

  //출석도장
  useEffect(() => {
    async function fetchEventAttendCheck() {
      const {result, data} = await API.getEventAttendCheck()
      if (result === 'success') {
        const {isCheck} = data
        setAttendCheck(isCheck)
      } else {
        //실패
      }
    }
    fetchEventAttendCheck()
  }, [])

  const scrollToTop = () => {
    if (logoChange && window.scrollY) {
      window.scrollTo(0, 0)
    }
  }

  const attendStampState = () => {
    if (token.isLogin && !attendCheck) {
      if (globalCtx.attendStamp === true) {
        return (
          <AttendStamp
            logoChange={logoChange}
            onClick={() => {
              try {
                fbq('track', 'attend_event')
                firebase.analytics().logEvent('attend_event')
              } catch (e) {}
              history.push('/attend_event')
            }}
          />
        )
      } else {
        return null
      }
    }
  }

  return (
    <>
      {attendStampState()}

      <TopScrollBtn onClick={scrollToTop} logoChange={logoChange} />
    </>
  )
}

const AttendStamp = styled.button`
  display: ${(props) => (props.logoChange ? 'block' : 'none')};
  position: fixed;
  bottom: 74px;
  right: 10px;
  width: 48px;
  height: 48px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  background-image: url('https://image.dalbitlive.com/event/attend/200811/icon_button@2x.png');
  z-index: 12;
`

const TopScrollBtn = styled.button`
  display: ${(props) => (props.logoChange ? 'block' : 'none')};
  position: fixed;
  bottom: 30px;
  right: 15px;
  width: 36px;
  height: 36px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  background-image: url(${TopScrollIcon});
  z-index: 12;
`
