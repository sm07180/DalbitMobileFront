import React, {useState, useEffect, useContext} from 'react'
import {useHistory} from 'react-router-dom'
import API from 'context/api'
import {OS_TYPE} from 'context/config'
import styled from 'styled-components'
import {Context} from 'context'
//layout
import Layout from 'pages/common/layout'
import Header from 'components/ui/new_header.js'

import {StoreLink} from 'context/link'
import {storeButtonEvent} from "components/ui/header/TitleButton";
import {useSelector} from "react-redux";

export default () => {
  let history = useHistory();
  const memberRdx = useSelector((state)=> state.member);
  const payStoreRdx = useSelector(({payStore})=> payStore);

  const context = useContext(Context)
  const [eventData, setEventData] = useState('')
  const [osCheck, setOsCheck] = useState(-1)

  async function fetchData() {
    const res = await API.eventTimeCheck({})

    if (res.result === 'success') {
      setEventData(res.data)
    } else if (res.result === 'fail') {
      context.action.alert({
        msg: '이벤트 참여 기간이 아닙니다.',
        callback: () => {
          history.push(`/`)
        }
      })
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
      return <img src="https://image.dalbitlive.com/event/happy_time/20201203/happyTime5.png" />
    } else if (eventData.rate === 3) {
      return <img src="https://image.dalbitlive.com/event/happy_time/20201203/happyTime3.png" />
    }
  }

  const eventBtn = () => {
    storeButtonEvent({history, memberRdx, payStoreRdx});

    // if (osCheck === OS_TYPE['IOS']) {
    //   StoreLink(context, history)
    // } else if (eventData.rate === 5 || eventData.rate === 3) {
    //   history.push(`/store`)
    // }
  }

  return (
    <Content>
      <Layout status="no_gnb">
        <Header title="해피타임 이벤트" />
        <div id="happyTime">
          <div className="happyTime_bg">
            <div className="happyTime_content">
              {EventImg()}
              <button onClick={() => eventBtn()} className="link_button">
                지금 결제 하기
              </button>
            </div>
          </div>
        </div>
      </Layout>
    </Content>
  )
}

const Content = styled.div`
  max-width: 460px;
  margin: auto;
  #happyTime {
    .happyTime_bg {
      background: #ef4440;
      min-height: calc(100vh - 50px);
      .happyTime_content {
        position: relative;
        img {
          display: block;
          width: 100%;
          height: auto;
        }
        .link_button {
          position: absolute;
          left: 0;
          top: 65.2%;
          width: 100%;
          height: 10%;
          text-indent: -9999px;
        }
      }
    }
  }
`
