import React, {useState, useRef} from 'react'
import {useHistory} from 'react-router-dom'
import {Hybrid} from 'context/hybrid'
import qs from 'query-string'

import styled from 'styled-components'
import Header from 'components/ui/new_header.js'
const btnClose = 'https://image.dalbitlive.com/svg/ic_close_black.svg'

export default () => {
  let history = useHistory()

  const noticeList = useRef()
  const {webview} = qs.parse(location.search)

  const [noticeView, setNoticeView] = useState(false)

  const buttonToogle = () => {
    if (noticeView === false) {
      setNoticeView(true)
      setTimeout(() => {
        const noticeListNode = noticeList.current
        const noticeListHeight = noticeListNode.offsetTop
        window.scrollTo(0, noticeListHeight)
      }, 100)
    } else {
      setNoticeView(false)
    }
  }

  return (
    <Content>
      <div id="imageGuide">
        <Header type="noBack">
          <h2 className="header-title">사진 업로드 가이드</h2>
          <button
            className="btnClose"
            onClick={() => {
              if (webview === 'new') {
                Hybrid('CloseLayerPopup')
              } else {
                history.goBack()
              }
            }}>
            <img src={btnClose} alt="닫기" />
          </button>
        </Header>
        <div className="event-content">
          <img src="https://image.dalbitlive.com/event/guest/20201027/img01.jpg" alt="게스트를 통한 더욱 재미있는 방송" />
          <img src="https://image.dalbitlive.com/event/guest/20201027/img02.jpg" alt="게스트 초대, 게스트 초대 수락" />
        </div>
      </div>
    </Content>
  )
}

const Content = styled.div`
  max-width: 460px;
  margin: auto;
  padding-bottom: 60px;
  #imageGuide {
    .event-content {
      img {
        width: 100%;
        display: block;
      }
    }
    .btnClose {
      position: absolute;
      right: 4px;
    }
  }
`
