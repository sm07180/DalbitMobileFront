import React, {useEffect} from 'react'

import './popup.scss'

const PopupNotice = (props) => {
  const {onClose, tab} = props

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <div id="popup">
      <div className="wrapper">
        <div className="title">이벤트 유의사항</div>
        {tab === 'dj' && <ul>
          <li><strong>DJ, 팬 2가지 동시 입상시 큰 상품만 당첨되며 중복 당첨되지 않습니다. </strong></li>
          <li>DJ 이벤트에 동일 회원(계정)이 참여해서 종합랭킹과 신인랭킹 2가지 모두 입상할 경우, 높은 상품 1가지만 인정합니다.</li>
          <li>당첨자는 목요일 오후 1시 이후에 발표합니다. </li>
          <li>부정한 방법으로 참여한 경우 이벤트 당첨이 취소될 수 있습니다.</li>
          <li>점수가 동일할 경우 레벨(경험치)이 높은 사람이 우선입니다.</li>
          <li>당첨된 달과 경품은 당첨자 발표 후에 순차적으로 지급될 예정입니다.</li>
          <li>DJ 부분 종합/신인은 중복 수상 안됩니다. (높은 상품(달/현금 구분없음) 순위 인정, 선택 불가). </li>
          <li>결과는 공지사항을 통해 발표하며, 당첨자 관련 서류는 문자를 통해 별도 안내드립니다.</li>
          <li>달을 제외한 경품의 제세공과금(22%)은 본인 부담입니다.</li>
          <li>
            경품 대신 현금 지급이 가능하며, 현금 지급을 원할 시 메일(help@dalbitlive.com)로 당첨자 서류와 함께 [현금 입금 희망]
            내용을 남겨주시면 이벤트 서류 확인 후 제세공과금(22%)을 제외한 금액이 입금됩니다.
          </li>
          <li>경품 대신 달로 받는 경우 제세공과금이 발생하지 않습니다. 달로 받고 싶은 분은 1:1문의에 남겨주세요. </li>
        </ul>}
        {tab === 'fan' && <ul>
          <li><strong>DJ, 팬 2가지 동시 입상시 큰 상품만 당첨되며 중복 당첨되지 않습니다. </strong></li>
          <li>당첨자는 목요일 오후 1시 이후에 발표합니다.</li>
          <li>특별점수는 이벤트가 종료된 이후에 집계됩니다.<br/>
          만약 내가 1만개씩 선물한 A와 B가 나란히 1,2등에 입상했다면, 이벤트 종료 후 집계시 특별점수 2000점 + 2000점 = 4000점 추가 반영</li>
          <li>부정한 방법으로 참여한 경우 이벤트 당첨이 취소될 수 있습니다.</li>
          <li>점수가 동일할 경우 레벨(총 경험치)이  높은 사람이 우선입니다.</li>
          <li>당첨된 달은 당첨자 발표 후에 순차적으로 지급될 예정입니다.</li>
        </ul>}
        <button className="closeBtn" onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  )
}

export default PopupNotice
