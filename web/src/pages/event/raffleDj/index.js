import React, {useState} from 'react'

import {Context} from 'context'
import {useHistory} from 'react-router-dom'
import Api from 'context/api'

import PopupNotice from './content/popupNotice'
import PopupDetails from './content/popupDetails'

import './style.scss'

export default () => {
  const history = useHistory()
  const [popupNotice, setPopupNotice] = useState(false)
  const [popupDetails, setPopupDetails] = useState(false)

  const goBack = () => {
    history.goBack()
  }

  return (
    <div id="raffle">
      <button className="close" onClick={goBack}>
        <img src="https://image.dalbitlive.com/event/raffle/close.png" alt="닫기" />
      </button>
      <div className="top">
        <img
          src="https://image.dalbitlive.com/event/raffle/topImgDj.png"
          alt="DJ님!! 이게 머선129? 방송에서 선물을 받으면 추가 적립! 많이 받으면 보너스 선물까지!"
        />
        <div className="date">
          {/* <span className="red">총 이벤트 기간</span>
            <span>11/10 ~ 12/7,</span>
            <span className="red">발표</span>
            <span>12/8</span> */}
          <img src="https://image.dalbitlive.com/event/raffle/date-dj.png" alt="총 이벤트 기간 11/10 ~ 12/7, 발표 12/8" />
        </div>
      </div>
      <div id="raffleDj">
        <section className="section-1">
          <img
            src="https://image.dalbitlive.com/event/raffle/djSection-1.png"
            alt="이벤트 1, 5% 추가 적립, 방송에서 받은 선물(별)의 5%를 추가 적립해 드립니다."
          />
        </section>
        <section className="section-2">
          <img
            src="https://image.dalbitlive.com/event/raffle/djSection-2.png"
            alt="이벤트 2, 방송시간 50시간 달성, 달성 시 부스터 20개를 드립니다."
          />
          <div className="time">
            <img src="https://image.dalbitlive.com/event/raffle/event-time.png" alt="방송시간:" />
            <span className="inline">12시간 12분</span>
            <button>
              <img src="https://image.dalbitlive.com/event/raffle/event2-btn.png" alt="선물 받기" />
            </button>
          </div>
        </section>
        <section className="section-3">
          <img
            src="https://image.dalbitlive.com/event/raffle/djSection-3.png"
            alt="이벤트 3, 추가 보너스 이벤트, 이벤트 기간 총 받은 선물 수에 따라 보너스 선물을 드립니다."
          />
          <div className="gift">
            <div className="giftList">
              <img src="https://image.dalbitlive.com/event/raffle/evnet3-txt1.png" alt="" />
              <span>100,100개</span>
            </div>
            <div className="giftList">
              <img src="https://image.dalbitlive.com/event/raffle/evnet3-txt2.png" alt="" />
              <span>라이브 방송세트(50%)</span>
            </div>
          </div>
        </section>
        <section className="section-4">
          <img
            src="https://image.dalbitlive.com/event/raffle/djSection-4.png"
            alt="이벤트 3, 추가 보너스 이벤트, 이벤트 기간 총 받은 선물 수에 따라 보너스 선물을 드립니다."
          />
        </section>
        <footer>
          <div className="fTop">
            <img src="https://image.dalbitlive.com/event/raffle/bottomTitle.png" height="16px" alt="꼭 읽어보세요" />
            <button onClick={() => setPopupNotice(true)}>
              <img src="https://image.dalbitlive.com/event/raffle/bottomBtn-1.png" height="22px" alt="유의사항" />
            </button>
            <button onClick={() => setPopupDetails(true)}>
              <img src="https://image.dalbitlive.com/event/raffle/bottomBtn-2.png" height="22px" alt="경품 자세히" />
            </button>
          </div>
        </footer>
        {popupNotice === true && <PopupNotice setPopupNotice={setPopupNotice} />}
        {popupDetails === true && <PopupDetails setPopupDetails={setPopupDetails} />}
      </div>
    </div>
  )
}
