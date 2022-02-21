import React, {useState, useRef} from 'react'
import styled from 'styled-components'
// import Header from 'components/ui/new_header.js'
import Header from 'components/ui/header/Header'
import {Hybrid, isMobileWeb} from "context/hybrid";
import {useHistory} from "react-router-dom";
import qs from 'query-string'

export default (props) => {
  const [noticeView, setNoticeView] = useState(false)
  const {webview} = qs.parse(location.search)
  const history = useHistory();
  const noticeList = useRef()
  const topPoint = useRef()

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

  const bottomGo = () => {
    window.scrollTo(0, topPoint.current.offsetTop)
  }
  const backEvent = ()=>{
    // Hybrid('CloseLayerPopup')
    if(webview === 'new'){
      Hybrid('CloseLayerPopup')
    }else{
      history.goBack();
    }
  }

  return (
    <Content>
      <div id="guestGuide">
        <Header title={"게스트 가이드"} type={'back'} backEvent={backEvent} />
        <div className="event-content">
          <button onClick={bottomGo}>버튼</button>
          <div className="topPoint"></div>
          <img src="https://image.dalbitlive.com/event/guest/20201127/img01.jpg" alt="게스트를 통한 더욱 재미있는 방송" />
          <img src="https://image.dalbitlive.com/event/guest/20201127/img02.jpg" alt="게스트 초대, 게스트 초대 수락" />
          <img
            src="https://image.dalbitlive.com/event/guest/20201127/new_img03_01.jpg"
            alt="게스트가 연결되면 DJ와 게스트 모두 반드시 이어폰으로 들어주세요!"
          />
          <img
            ref={topPoint}
            src="https://image.dalbitlive.com/event/guest/20201127/new_img03_02.jpg"
            alt="센스있는 dj가 되어 효율적인 콘텐츠를 기획해보세요!"
          />
          <img src="https://image.dalbitlive.com/event/guest/20201127/img04.jpg" alt="게스트에게 선물하기, 게스트연결 종료" />
        </div>

        <div className="notice" ref={noticeList}>
          <h2 onClick={buttonToogle}>
            <img className="notice__icon" src="https://image.dalbitlive.com/svg/ic_notice_red_radius.svg" alt="공지 아이콘" />
            PC에서 게스트 이용 시 주의사항
            {noticeView ? (
              <i className="notice__checkicon down">체크아이콘</i>
            ) : (
              <i className="notice__checkicon up">체크아이콘</i>
            )}
          </h2>

          <ul className={`notice__content ${noticeView === true ? 'active' : ''}`}>
            <li className="notice__hiddeText">
              <b>
                <i>01</i>PC 방송에서 게스트 연결 중에는 음질이 떨어질 수 있습니다.
                <br />
              </b>
              DJ님이 PC로 방송하는 경우 스테레오 음질의 방송이 가능하나 게스트 연결 중에는 다소 음질이 떨어질 수 있습니다.
              <br />
              (게스트 연결이 종료되면 다시 스테레오 음질로 자동 변환됩니다.)
            </li>

            <li className="notice__hiddeText">
              <b>
                <i>02</i>PC에서 게스트 연결되었을 때 새로고침(F5) 하지 마세요.
                <br />
              </b>
              PC에서 게스트 연결되었을 때, 게스트가 새로고침을 하면 게스트 연결이 자동으로 종료됩니다.
            </li>
          </ul>

          <p className="notice__text">
            게스트 기능은 지속적으로 개선할 예정이니
            <br />
            많은 관심과 의견 부탁드립니다!
          </p>
        </div>
      </div>
    </Content>
  )
}

const Content = styled.div`
  max-width: 460px;
  margin: auto;
  padding-bottom: 60px;
  #guestGuide {
    position: relative;
    .event-content {
      .topPoint {
        position: absolute;
        top: 2170px;
        width: 10px;
        height: 50px;
      }
      button {
        width: 24%;
        height: 1.2%;
        right: 7%;
        top: 5.8%;
        position: absolute;
        text-indent: -9999px;
      }

      img {
        width: 100%;
        display: block;
      }
    }

    .notice {
      h2 {
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 12px;
        color: #e2475f;
      }

      &__content {
        padding: 33px 21px 30px 48px;
        box-sizing: border-box;
        border-radius: 12px;
        background: #f5f5f5;
        margin-bottom: 16px;
        display: none;

        &.active {
          display: block;
        }
      }

      &__icon {
        margin-right: 4px;
        margin-top: 1px;
      }

      &__checkicon {
        position: relative;
        width: 24px;
        height: 24px;
        margin-left: 3px;
        text-indent: -99999px;
        display: inline-block;

        &.down {
          background: url('https://image.dalbitlive.com/svg/ic_arrow_up.svg') center no-repeat;
        }

        &.up {
          background: url('https://image.dalbitlive.com/svg/ic_arrow_down.svg') center no-repeat;
        }
      }
      &__hiddeText {
        display: block;
        margin-bottom: 16px;
        font-size: 14px;
        display: block;
        b {
          line-height: 17px;
          color: #FF3C7B;
          position: relative;
          i {
            font-style: normal;
            position: absolute;
            left: -24px;
            top: 1px;
          }
        }
      }
      &__text {
        text-align: center;
        font-size: 14px;
        color: #424242;
        line-height: 20px;
        font-weight: 600;
      }
    }
  }
`
