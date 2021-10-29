import React, {useState} from 'react'

import {Context} from 'context'
import {useHistory} from 'react-router-dom'
import Api from 'context/api'

import PopupNotice from './popupNotice'

export default () => {
  const [popupNotice, setPopupNotice] = useState(false)
  const [popupDetails, setPopupDetails] = useState(false)

  return (
    <div id="raffleDj">
      <div className="section-1">
        <img
          src="https://image.dalbitlive.com/event/raffle/djSection-1.png"
          alt="이벤트 1, 5% 추가 적립, 방송에서 받은 선물(별)의 5%를 추가 적립해 드립니다."
        />
      </div>
      <div className="section-2">
        <img
          src="https://image.dalbitlive.com/event/raffle/djSection-2.png"
          alt="이벤트 2, 방송시간 50시간 달성, 달성 시 부스터 20개를 드립니다."
        />
        <div className="time">
          <img src="https://image.dalbitlive.com/event/raffle/event-time.png" alt="방송시간:" />
          12시간 12분
          <button>
            <img src="https://image.dalbitlive.com/event/raffle/event2-btn.png" alt="선물 받기" />
          </button>
        </div>
      </div>
      <div className="section-3">
        <img
          src="https://image.dalbitlive.com/event/raffle/djSection-3.png"
          alt="이벤트 3, 추가 보너스 이벤트, 이벤트 기간 총 받은 선물 수에 따라 보너스 선물을 드립니다."
        />
      </div>
      <footer>
        <div className="fTop">
          <img src="https://image.dalbitlive.com/event/raffle/bottomTitle2.png" height="16px" alt="유의사항" />
        </div>
        <ul>
          <li>당첨확률 : 선물 받을 수 있는 사람수 / 달성자 수 </li>
          <li>추첨 프로그램을 통해 공정하게 선정하겠습니다. </li>
          <li>회차당 1계정 1번만 당첨되며, 중복 당첨은 되지 않습니다. </li>
          <li>당첨자는 공지사항을 통해 발표됩니다. </li>
        </ul>
      </footer>
    </div>
  )
}
