import React, {useState, useRef} from 'react'

import VoteNoticePop from './pop_vote_notice'
export default function awardEventGuide() {
  const [voteNoticePop, setVoteNoticePop] = useState(false)

  const [noticeView, setNoticeView] = useState(false)

  const noticeList = useRef()

  const buttonToogle = () => {
    if (noticeView === false) {
      setNoticeView(true)
      setTimeout(() => {
        const noticeListNode = noticeList.current
        const noticeListHeight = noticeListNode.offsetTop
        window.scrollTo({top: noticeListHeight, behavior: 'smooth'})
      }, 100)
    } else {
      setNoticeView(false)
    }
  }

  return (
    <div className="tabGuideWrap">
      <div className="topImage">
        <img src="https://image.dalbitlive.com/event/award/201214/guide-img-v2.png" alt="guide" />
        <button className="goodsBtn" onClick={() => setVoteNoticePop(true)}>
          <img src="https://image.dalbitlive.com/event/award/201214/btn-goods.png" alt="goods" />
        </button>
      </div>

      <div className="noticeWrap attend">
        <div
          className={`noticeWrap__title
           ${noticeView === true ? 'active' : ''}`}
          onClick={buttonToogle}>
          이벤트 유의사항 {noticeView === true ? '닫기' : '확인하기'}
          <img src="https://image.dalbitlive.com/event/award/201214/ic_arrow_down.svg" />
        </div>
        <div ref={noticeList} className={`noticeListBox ${noticeView === true ? 'active' : ''}`}>
          <ul>
            <li>
              DJ TOP 7 30인의 후보 명단의 선발 기준은 다음과 같습니다.
              <br />
              ① 오픈 이후 달빛라이브의 스페셜 DJ 이력이 있는 회원
              <br />
              ② 최근 한 달 이내 방송시간 20시간 이상 회원
              <br />
              ③ 연간 랭킹 50위 이내 회원
              <br />
              ④ 최근 달빛라이브 이용이 저조하거나 DJ 활동 종료를 명시한 <br />
              회원 제외
            </li>
            <li>DJ TOP 7과 팬 TOP 20의 데이터는 선발 시점 데이터로 별도 페이지에 상시 노출됩니다.</li>
            <li>DJ TOP 7 배지와 팬 TOP 20 배지는 2021년 1월 1일 적용됩니다.</li>
            <li>배지는 방송방에 노출되지 않으며 해당 회원의 프로필 화면에서만 노출됩니다. </li>
            <li>DJ TOP 7 무드등과 팬 TOP 20 굿즈는 1월 11일 이후 배송 진행됩니다.</li>
            <li>굿즈 및 무드등 발송을 위해 수집된 개인정보는 경품 발송 외 사용되지 않으며 이벤트 종료 후 파기됩니다</li>
            <li></li>
          </ul>
        </div>
      </div>
      {voteNoticePop && <VoteNoticePop setVoteNoticePop={setVoteNoticePop} />}
    </div>
  )
}
