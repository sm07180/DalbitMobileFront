import React from 'react'
import styled from 'styled-components'
import Header from 'components/ui/new_header.js'
import {useHistory} from 'react-router-dom'

export default () => {
  let history = useHistory()

  return (
    <Content>
      <Header title="해피타임 이벤트" />
      <div id="happyTime">
        <img src="https://image.dalbitlive.com/event/happy_time/happyTime5.png" className="img" />
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

    .test_button {
      position: absolute;
      left: 11%;
      top: 20.6%;
      width: 77.9%;
      height: 6.9%;
      text-indent: -9999px;
      border: solid 5px;
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
