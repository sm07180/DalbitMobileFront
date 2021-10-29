import React, {useEffect, useState} from 'react'

import {Context} from 'context'
import {useHistory} from 'react-router-dom'
import Api from 'context/api'

import PopupNotice from './popupNotice'

export default (prop) => {
  const {whoIs} = props
  const [popupNotice, setPopupNotice] = useState({boolean: false, page: 'raffleDj'})
  const [popupDetails, setPopupDetails] = useState(false)

  useEffect(() => {
    console.log(popupNotice.page)
  }, [])

  return (
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
          <img
            src="https://image.dalbitlive.com/event/raffle/bottomBtn-1.png"
            height="22px"
            onClick={() => setPopupNotice(true)}
            alt="유의사항"
          />
          <img
            src="https://image.dalbitlive.com/event/raffle/bottomBtn-2.png"
            height="22px"
            onClick={(() => setPopupDetails(true), (whoIs = {whoIs}))}
            alt="경품 자세히"
          />
        </div>
      </footer>
    </div>
  )
}
