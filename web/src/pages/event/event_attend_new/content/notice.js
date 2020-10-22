import React, {useContext, useEffect, useRef, useState} from 'react'

import {AttendContext} from '../attend_ctx'

import arrowIcon from './../static/ic_arrow_y_down.svg'

export default (props) => {
  const {eventAttendState, eventAttendAction} = useContext(AttendContext)

  const [attendView, setAttendView] = useState(false)
  const [rouletteView, setRouletteView] = useState(false)

  const noticeList = useRef()

  const buttonToogle = () => {
    if (attendView === false) {
      setAttendView(true)
      setTimeout(() => {
        const noticeListNode = noticeList.current
        const noticeListHeight = noticeListNode.offsetTop
        window.scrollTo(0, noticeListHeight)
      }, 100)
    } else {
      setAttendView(false)
    }

    if (rouletteView === false) {
      setRouletteView(true)
      setTimeout(() => {
        const noticeListNode = noticeList.current
        const noticeListHeight = noticeListNode.offsetTop
        window.scrollTo(0, noticeListHeight)
      }, 100)
    } else {
      setRouletteView(false)
    }
  }

  return (
    <>
      {eventAttendState.tab === 'attend' ? (
        <div className="noticeWrap attend">
          <div
            className={`noticeWrap__title
           ${attendView === true ? 'active' : ''}`}
            onClick={buttonToogle}>
            이벤트 유의사항 {attendView === true ? '닫기' : '확인하기'} <img src={arrowIcon} alt="arrow" />
          </div>
          <div ref={noticeList} className={`noticeListBox ${attendView === true ? 'active' : ''}`}>
            <ul>
              <li>
                출석은 00시 기준 방송 또는 청취 시간의 합이 30분 이상일 때 완료할 수 있습니다. 예시) 23:40-00:10의 방송 또는 청취
                시간의 경우 오늘 20분의 시간을 더 채워야 출석이 가능합니다.
              </li>
              <li>출석은 한 대의 기기당 1일 1회 한 개의 계정만 진행할 수 있습니다.</li>
              <li>매일 출석 체크 현황은 일주일 단위로 초기화 됩니다.</li>
              <li>[보너스 받기]는 달(0~10개 중 지급)과 경험치 (50, 70, 100, 200, 300, 500 중 지급)로 구성되어 있습니다.</li>
              <li>[보너스 받기]는 일요일과 월요일에만 선택이 가능합니다.</li>
              <li>본 이벤트는 사전 고지 없이 변경 및 종료될 수 있습니다.</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="noticeWrap roulette">
          <div className={`noticeWrap__title ${attendView === true ? 'active' : ''}`} onClick={buttonToogle}>
            이벤트 유의사항 {attendView === true ? '닫기' : '확인하기'} <img src={arrowIcon} alt="arrow" />
          </div>
          <div ref={noticeList} className={`noticeListBox ${rouletteView === true ? 'active' : ''}`}>
            <p>이벤트 취지</p>
            <ul>
              <li>
                룰렛 이벤트는 출석체크 이벤트 외의 부가적인 이벤트로서 즐겁게 방송 또는 청취를 하시면서 소소한 이벤트 상품까지
                받으실 수 있도록 하는 데에 취지가 있습니다.
              </li>
            </ul>

            <p>이벤트 유의 사항</p>
            <ul>
              <li>[마이페이지 &gt; 프로필 설정]에서 본인인증을 완료한 대상에 한하여 이벤트에 참여할 수 있습니다.</li>
              <li>
                1일 기준 1시간 방송(청취)를 누적하여 완료(종료 기준)할 때마다 자동으로 응모 기회를 받을 수 있습니다. (1일 최대
                3회)
              </li>
              <li>
                응모권의 유효기간은 발급 기준 72시간이며 기간 내 응모하지 않을 시 자동으로 차감됩니다. 예시) 1월 1일 15:00 응모권
                1개 발급 → 유효기간: 1월 4일 14:59:59까지
              </li>
              <li>본 이벤트는 사전 고지 없이 변경 및 종료될 수 있습니다.</li>
            </ul>

            <p>이벤트 당첨 확률</p>
            <ul>
              <li>
                꽝(63%), 1달(20%), 3달(10%), 초코에몽(3.5%), 편의점 상품권(1.5%), 스타벅스 아아(1%), 문화상품권(0.7%),
                교촌치킨(0.3%)
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  )
}
