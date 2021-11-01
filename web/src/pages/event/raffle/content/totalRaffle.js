import React, {useState} from 'react'

import PopupNotice from './popupNotice'
import PopupDetails from './popupDetails'

export default () => {
  const [popupNotice, setPopupNotice] = useState(false)
  const [popupDetails, setPopupDetails] = useState(false)

  return (
    <div id="total">
      <section className="section-1">
        <img src="https://image.dalbitlive.com/event/raffle/secImg-1.png" alt="" />
        <div className="ticket">
          <div className="number">
            <span>000</span>개
          </div>
          <button>
            <img src="https://image.dalbitlive.com/event/raffle/secBtn-1.png" alt="달충전" />
          </button>
        </div>
        <div className="exWrap">
          <div className="exBox">
            <div className="title">
              <img
                src="https://image.dalbitlive.com/event/raffle/sectitle-1.png"
                width="76px"
                height="15px"
                alt="- 총 응모 현황 :"
              />
              0000 회
            </div>
            <div className="title">
              <img
                src="https://image.dalbitlive.com/event/raffle/sectitle-2.png"
                width="101px"
                height="15px"
                alt="- 이번 회 응모 현황 :"
              />
              000 회
            </div>
          </div>
          <button>
            <img src="https://image.dalbitlive.com/event/raffle/secBtn-2.png" alt="추첨 이벤트 보기" />
          </button>
        </div>
      </section>
      <section className="section-2">
        <div className="list">
          <div className="top">
            <img src="" alt="" />
            <span className="status">
              내 응모 횟수 : <span>0,000회</span>
            </span>
          </div>
          <div className="bottom">
            <input type="number" placeholder="0,000" />
            <img src="https://image.dalbitlive.com/event/raffle/gae.png" className="gae" alt="개" />
            <button>
              <img src="https://image.dalbitlive.com/event/raffle/listBtn.png" alt="응모" />
            </button>
          </div>
        </div>
      </section>
      <section className="section-3">
        <img
          src="https://image.dalbitlive.com/event/raffle/bottomImg.png"
          alt="가장 많이 응모한 단 1명에게 특정 DJ에게 스페셜DJ 가산점 10점을 부여할 수 있는 특별한 권한을 드립니다."
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
        {/* <ul>
          <li>경품별로 상위 00명까지 가장 많이 응모한 회원에게 해당 경품이 지급됩니다.</li>
          <li>중복 당첨은 불가하며 1계정에 1개의 경품만 당첨됩니다.</li>
          <li>내 응모 현황 외 경품별 응모 현황은 공개되지 않습니다.</li>
          <li>공지사항을 통해 당첨자를 발표합니다.</li>
          <li>가장 많이 응모한 1명에게는 5월 4일 개별 연락 드리겠습니다.</li>
        </ul> */}
      </footer>
      {popupNotice === true && <PopupNotice setPopupNotice={setPopupNotice} whoIs={whoIs} />}
      {popupDetails === true && <PopupDetails setPopupDetails={setPopupDetails} />}
    </div>
  )
}
