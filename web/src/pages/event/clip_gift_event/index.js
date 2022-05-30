import React, {useRef, useState} from 'react'
import {useHistory} from 'react-router-dom'

// context
import styled from 'styled-components'
import qs from 'query-string'
import {Hybrid} from 'context/hybrid'

import Header from 'components/ui/new_header.js'

const btnClose = 'https://image.dallalive.com/svg/ic_close_black.svg'

export default () => {
  let history = useHistory()
  const [noticeView, setNoticeView] = useState(false)
  const {webview} = qs.parse(location.search)

  const noticeList = useRef()

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
      <div id="clipEvent">
        <Header type="noBack">
          <h2 className="header-title">클립 40% 추가 선물 이벤트</h2>
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
          <img src="https://image.dallalive.com/event/clip/event/event_gift_201012.png" alt="클립 40% 추가 선물 이벤트" />
        </div>
        <div className="event-notice">
          <p className={`title ${noticeView === true ? 'active' : ''}`} onClick={buttonToogle}>
            이벤트 상세 설명 {noticeView === true ? '닫기' : '보기'}
          </p>

          <ul ref={noticeList} className={`notice-list ${noticeView === true ? 'active' : ''}`}>
            <li>
              <strong>선물시 40%의 달이 추가 선물(지급)</strong>됩니다. <br />
              예) 골드바(10달) 선물시 40%(4달)을 포함한 총 14달이 선물 됩니다.{' '}
            </li>
            <li>
              추가 선물은 소수점 이하는 <strong>지급되지 않습니다.</strong>
              <br />
              예) 도넛(13달) 선물 시 40%(5.2달)에서 0.2달이 제외된 18달(13달+5달)이 선물 됩니다.
            </li>
            <li>본 이벤트는 별도의 공지없이 마감 및 추가 지급 비율이 변동될 수 있습니다.</li>
          </ul>
        </div>
      </div>
    </Content>
  )
}
const Content = styled.div`
  #clipEvent {
    width: 100%;
    min-height: 100vh;
    background: #009ea4;
    color: #fff;
    .event-content {
      img {
        width: 100%;
      }
    }
    .btnClose {
      position: absolute;
      right: 4px;
    }
    .event-notice {
      padding: 10px 10% 32px;
      font-size: 14px;
      .title {
        margin: 0 auto;
        height: 34px;
        border: 1px solid #fff;
        border-radius: 12px;
        font-size: 12px;
        line-height: 34px;
        text-align: center;
        &::after {
          position: relative;
          top: -1px;
          display: inline-block;
          content: '';
          vertical-align: middle;
          width: 0;
          height: 0;
          margin-left: 5px;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 8px solid #fff;
          border-radius: 2px;
        }
        &.active {
          &::after {
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            border-bottom: 8px solid #fff;
            border-top: 0;
          }
        }
      }
      .notice-list {
        display: none;
        padding: 30px 0;
        &.active {
          display: block;
        }
        li {
          position: relative;
          margin-top: 30px;
          &:first-child {
            margin-top: 0;
          }
          &::before {
            position: absolute;
            top: 7px;
            left: -18px;
            display: inline-block;
            content: '';
            width: 10px;
            height: 3px;
            background: #fbfb3a;
          }
        }
      }
    }
  }
`
