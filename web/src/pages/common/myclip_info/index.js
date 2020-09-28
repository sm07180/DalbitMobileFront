import React, {useContext} from 'react'
import {Context} from 'context'

import './index.scss'

export default () => {
  const context = useContext(Context)
  return (
    <div id="MyClipPopup">
      <div className="title">
        <h2>내 클립 현황</h2>
        <button onClick={() => context.action.updatePopupVisible(false)}>확인</button>
      </div>
      <div className="content">
        <ul>
          <li>
            <span className="upload">등록 게시물 수</span>
            <p>본인이 등록한 클립 게시물 중 공개 설정된 클립의 개수 입니다.</p>
          </li>
          <li>
            <span className="listen">청취 횟수</span>
            <p>본인이 등록한 클립 게시물의 유저들의 청취 횟수 입니다.</p>
          </li>
          <li>
            <span className="like">받은 좋아요</span>
            <p>본인이 등록한 모든 클립 게시물이 받은 좋아요 수를 합산한 개수입니다.</p>
          </li>
          <li>
            <span className="gift">받은 선물</span>
            <p>본인이 등록한 클립 게시물이 받은 선물(별)의 수를 합산한 개수입니다.</p>
          </li>
        </ul>
      </div>
    </div>
  )
}
