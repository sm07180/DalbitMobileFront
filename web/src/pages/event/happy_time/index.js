import React, {useState, useEffect, useContext} from 'react'
import {useHistory} from 'react-router-dom'
import API from 'context/api'
import {OS_TYPE} from 'context/config'
import styled from 'styled-components'
import {Context} from 'context'
import Header from 'components/ui/new_header.js'

import {StoreLink} from 'context/link'

export default () => {
  let history = useHistory()
  const context = useContext(Context)
  const [eventData, setEventData] = useState('')
  const [osCheck, setOsCheck] = useState(-1)

  async function fetchData() {
    const res = await API.eventTimeCheck({})

    if (res.result === 'success') {
      setEventData(res.data)
    } else if (res.result === 'fail') {
      history.push(`/`)
    }
  }

  useEffect(() => {
    setOsCheck(navigator.userAgent.match(/Android/i) != null ? 1 : navigator.userAgent.match(/iPhone|iPad|iPod/i) != null ? 2 : 3)
  }, [])

  useEffect(() => {
    fetchData()
  }, [])

  const EventImg = () => {
    if (eventData.rate === 5) {
      return <img src="https://image.dalbitlive.com/event/happy_time/happyTime5.png" className="img" />
    } else if (eventData.rate === 3) {
      return <img src="https://image.dalbitlive.com/event/happy_time/happyTime3.png" className="img" />
    }
  }

  const eventBtn = () => {
    if (osCheck === OS_TYPE['IOS']) {
      StoreLink(context, history)
    } else if (eventData.rate === 5 || eventData.rate === 3) {
      history.push(`/pay/store`)
    }
  }

  return (
    <Content>
      <Header title="해피타임 이벤트" />
      <div id="happyTime">
        {EventImg()}
        <button onClick={() => eventBtn()} className="link_button">
          지금 결제 하기
        </button>
      </div>
    </Content>
  )
}

const Content = styled.div`
  max-width: 460px;
  margin: auto;
  padding-bottom: 60px;

  #happyTime {
    min-height: 100vh;
    position: relative;
    background: #000;
    .img {
      display: block;
      width: 100%;
      height: auto;
    }

    .link_button {
      position: absolute;
      left: 11%;
      top: 72%;
      width: 77.9%;
      height: 10%;
      text-indent: -9999px;
    }
  }
`
