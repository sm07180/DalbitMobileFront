import React, {useState, useRef, useContext} from 'react'
import {useHistory} from 'react-router-dom'
import Api from 'context/api'
import {Hybrid} from 'context/hybrid'
import {Context} from 'context'
import {OS_TYPE} from 'context/config.js'
import qs from 'query-string'
import styled from 'styled-components'
import Header from 'components/ui/new_header.js'
import {storeButtonEvent} from "components/ui/header/TitleButton";
import {useSelector} from "react-redux";

const btnClose = 'https://image.dalbitlive.com/svg/ic_close_black.svg'

export default () => {
  const noticeList = useRef()
  const history = useHistory()
  const context = useContext(Context)
  const customHeader = JSON.parse(Api.customHeader)
  const {webview} = qs.parse(location.search)
  const memberRdx = useSelector((state)=> state.member);
  const payStoreRdx = useSelector(({payStore})=> payStore);

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

  console.log(noticeView)

  return (
    <Content>
      <div id="moringEvent">
        <Header type="noBack">
          <h2 className="header-title">굿모닝 결제 이벤트</h2>
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
        <div className="content">
          <img src="https://image.dalbitlive.com/event/morning_event/morningEvent.jpg" alt="굿모닝 결제 이벤트" />
          {customHeader['os'] === OS_TYPE['IOS'] ? (
            <button
              className="payLink"
              onClick={() => {
                // webkit.messageHandlers.openInApp.postMessage('')
                // history.push('/store');
                storeButtonEvent({history, memberRdx, payStoreRdx});

              }}>
              충전
            </button>
          ) : (
            <button onClick={() => history.push(`/store`)} className="payLink">
              충전하러 가기
            </button>
          )}

          <button onClick={() => buttonToogle()} className="contentOpen">
            컨텐츠 열고 닫기
          </button>
        </div>

        <div className="notice" ref={noticeList}>
          {!noticeView ? (
            <>
              <div className="conent_padding">
                <img
                  src="https://image.dalbitlive.com/event/morning_event/morningEvent_bt_down.jpg"
                  alt="굿모닝 결제 이벤트 자세히보기 열기"
                />
              </div>
            </>
          ) : (
            <>
              <img
                src="https://image.dalbitlive.com/event/morning_event/morningEvent_bt_up.jpg"
                alt="굿모닝 결제 이벤트 자세히보기 닫기"
              />

              <img
                src="https://image.dalbitlive.com/event/morning_event/morningEvent_hide.jpg"
                alt="100달 이상 결제시 5%의 달이 추가 지급됩니다."
              />
            </>
          )}
        </div>
      </div>
    </Content>
  )
}

const Content = styled.div`
  max-width: 460px;
  margin: auto;
  #moringEvent {
    background: #ffa49c;
    img {
      display: block;
      width: 100%;
    }

    .content {
      position: relative;
      .payLink {
        width: 50%;
        height: 6%;
        position: absolute;
        left: 25%;
        top: 67%;
        text-indent: -99999px;
      }

      .contentOpen {
        width: 90%;
        height: 8%;
        position: absolute;
        left: 5%;
        bottom: -8%;
        text-indent: -99999px;
      }
    }
    .conent_padding {
      padding-bottom: 5%;
    }
    .btnClose {
      position: absolute;
      right: 4px;
    }
  }
`
