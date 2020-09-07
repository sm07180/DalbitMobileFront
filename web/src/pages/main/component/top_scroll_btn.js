import React, {useContext, useEffect, useState} from 'react'
import styled from 'styled-components'
import API from 'context/api'
import {Context} from 'context'
import {Link, useHistory} from 'react-router-dom'

// static
import TopScrollIcon from '../static/ic_circle_top.svg'

export default (props) => {
  const history = useHistory()
  const context = useContext(Context)
  const globalCtx = useContext(Context)
  const {token} = globalCtx
  const {logoChange} = globalCtx

  const [attendCheck, setAttendCheck] = useState(false)

  //pathname
  const urlrStr = history.location.pathname

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
    <FixedButton className={context.player ? 'usePlayer' : ''}>
      {urlrStr !== '/rank' && attendStampState()}

      {/* <TopScrollBtn onClick={scrollToTop} logoChange={logoChange} /> */}
    </FixedButton>
  )
}

const FixedButton = styled.div`
  position: fixed;
  bottom: 30px;
  right: 10px;
  z-index: 12;
  > button {
    margin: 5px auto 0;
    &:first-child {
      margin-top: 0;
    }
  }

  &.usePlayer {
    bottom: 70px;
  }
`
const AttendStamp = styled.button`
  display: ${(props) => (props.logoChange ? 'block' : 'none')};
  width: 48px;
  height: 48px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  background-image: url('https://image.dalbitlive.com/event/attend/200811/icon_button@2x.png');
`

const TopScrollBtn = styled.button`
  display: ${(props) => (props.logoChange ? 'block' : 'none')};
  width: 36px;
  height: 36px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  background-image: url(${TopScrollIcon});
`
