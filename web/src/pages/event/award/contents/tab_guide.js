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
        <img src="https://image.dallalive.com/event/award/201214/guide-img-v3.png" alt="guide" />
        <button className="goodsBtn" onClick={() => setVoteNoticePop(true)}>
          <img src="https://image.dallalive.com/event/award/201214/btn-goods.png" alt="goods" />
        </button>
      </div>

      <div className="noticeWrap attend">
        <div
          className={`noticeWrap__title
           ${noticeView === true ? 'active' : ''}`}
          onClick={buttonToogle}>
          이벤트 유의사항 {noticeView === true ? '닫기' : '확인하기'}
          <img src="https://image.dallalive.com/event/award/201214/ic_arrow_down.svg" />
        </div>
        <div ref={noticeList} className={`noticeListBox ${noticeView === true ? 'active' : ''}`}>
          <ul>
            <li>
              DJ TOP 7 30인의 후보 명단의 선발 기준은 다음과 같습니다.
              <br />
              ① 오픈 이후 달라의 스페셜 DJ 이력이 있는 회원
              <br />
              ② DJ 연간 랭킹 상위 회원
              <br />
              - 연간 랭킹 2020년 12월 15일 기준 적용
              <br />③ 서비스에 부정적인 영향을 줄 수 있다고 판단되는 회원 제외
            </li>
            <li>
              DJ TOP 7 투표에 대한 부정행위 및 어뷰징 등의 방지를 위해 다음 안내 요건에 따라 투표권이 지급됩니다.
              <br />
              - 투표는 1회만 가능하며 1회 투표 시 반드시 3명의 DJ를 선택해야 합니다.
              <br />
              - 투표권은 10레벨 이상의 본인인증이 완료된 회원에게만 지급됩니다.
              <br />
              - 투표완료한 계정 및 이미 인증한 번호의 재인증은 투표권이 지급되지 않습니다.
              <br />
              - 부정한 방법으로 투표를 중복 진행하는 경우 해당 투표는 인정되지 않습니다.
              <br />- 부정적인 방법으로 투표를 중복 진행하는 경우 서비스 이용 제재 대상이 될 수 있습니다.
            </li>
            <li>DJ TOP 7과 팬 TOP 20의 데이터는 선발 시점 데이터로 별도페이지에 상시 노출됩니다.</li>
            <li>DJ TOP 7 배지와 팬 TOP 20 배지는 2021년 1월 1일 적용됩니다.</li>
            <li>배지는 방송방에 노출되지 않으며 해당 회원의 프로필 화면에서만 노출됩니다. </li>
            <li>DJ TOP 7 보상 달은 2021년 1월 4일 이전 일괄 지급됩니다.</li>
            <li>DJ TOP 7 무드등과 팬 TOP 20 굿즈는 1월 11일 이후 배송 진행됩니다.</li>
            <li>주소 수령 및 개인정보 이용 동의가 이뤄지지 않는 경우 보상이 지급되지 않습니다.</li>
            <li>굿즈 및 무드등 발송을 위해 수집된 개인정보는 경품 발송 외 사용되지 않으며 이벤트 종료 후 파기됩니다.</li>
          </ul>
        </div>
      </div>
      {voteNoticePop && <VoteNoticePop setVoteNoticePop={setVoteNoticePop} />}
    </div>
  )
}
