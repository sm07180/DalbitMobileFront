import React, {useEffect} from 'react'

import './popup.scss'

const PopupNotice = (props) => {
  const {onClose} = props

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
        <ul>
          <li>
            - DJ 이벤트에 동일 회원(계정)이 참여해서 종합랭킹과 신인랭킹 2가지 모두 입상할 경우, 높은 상품 1가지만 인정합니다.
          </li>
          <li>- 당첨자는 목요일 오후 1시 이후에 발표합니다. </li>
          <li>- 부정한 방법으로 참여한 경우 이벤트 당첨이 취소될 수 있습니다.</li>
          <li>- 점수가 동일할 경우 레벨(경험치)이 높은 사람이 우선입니다.</li>
          <li>- 당첨된 달과 경품은 당첨자 발표 후에 순차적으로 지급될 예정입니다.</li>
          <li>- DJ, 팬 부문 동시 입상 가능, 단 DJ부문 종합/신인은 중복 안됩니다. </li>
          <li>- 결과는 공지사항을 통해 발표하며, 당첨자 관련 서류는 문자를 통해 별도 안내드립니다.</li>
          <li>- 달을 제외한 경품의 제세공과금(22%)은 본인 부담입니다.</li>
          <li>
            - 경품 대신 현금 지급이 가능하며, 현금 지급을 원할 시 메일(help@dalbitlive.com)로 당첨자 서류와 함께 [현금 입금 희망]
            내용을 남겨주시면 이벤트 서류 확인 후 제세공과금(22%)을 제외한 금액이 입금됩니다.
          </li>
          <li>-경품 대신 달로 받는 경우 제세공과금이 발생하지 않습니다. 달로 받고 싶은 분은 1:1문의에 남겨주세요. </li>
        </ul>
        <button className="closeBtn" onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  )
}

export default PopupNotice
