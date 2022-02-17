import React from 'react'

import './index.scss'

export default () => {
  return (
    <div id="proofShoptPopupWrap">
      <div className="title">
        <h2>이벤트 안내</h2>
      </div>
      <div className="content">
        <h3>선물 지급 안내</h3>
        <ul>
          <li>이벤트 참여 기간(8.31~9.13) PC로 10분 이상 방송한 이력이 있는 대상만 선물을 지급받을 수 있습니다.</li>
          <li>Best 10은 내부 회의를 통해 선정됩니다.</li>
          <li>이벤트 종료 후 공지사항을 통해 선물 지급 내용을 확인할 수 있습니다.</li>
        </ul>
        <br />

        <h3>유의사항 안내</h3>
        <ul>
          <li>
            이벤트 취지와 어울리지 않는 내용 혹은 운영 정책에 위배된 이미지 또는 글이 확인되는 경우 무 통보 삭제 및 제재를 할 수
            있습니다.
            <br />
            (예시: 타인 사진 도용, 음란성, 혐오감 조성, 비속어 등)
          </li>
          <li>참여한 이벤트 내용은 사전 고지 없이 서비스 마케팅으로 활용될 수 있습니다.</li>
        </ul>
      </div>
    </div>
  )
}
