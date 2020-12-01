import React from 'react'
import {useHistory} from 'react-router-dom'
import styled from 'styled-components'
import Header from 'components/ui/new_header.js'

export default () => {
  let history = useHistory()

  return (
    <Content>
      <div id="happyTime">
        <Header title="해피타임 이벤트" />
        <img src="https://image.dalbitlive.com/event/happy_time/happyTime.png" className="img" />
        <button onClick={() => history.push(`/pay/store`)} className="link_button">
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
    position: relative;
    .img {
      display: block;
      width: 100%;
      height: auto;
    }

    .link_button {
      position: absolute;
      left: 11%;
      top: 74.6%;
      width: 77.9%;
      height: 6.9%;
      text-indent: -9999px;
    }
  }
`
