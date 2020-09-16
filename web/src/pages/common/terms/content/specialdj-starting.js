/**
 * @file terms/content/event_gift_detail.js
 * @brief 이벤트 경품 상세소개
 */
import React from 'react'
import './scss/specialdj-starting.scss'

import NumberImg01 from './static/specialdj_starting_number01.png'
import NumberImg02 from './static/specialdj_starting_number02.png'
import NumberImg03 from './static/specialdj_starting_number03.png'

////---------------------------------------------------------------------
export default (props) => {
  //---------------------------------------------------------------------
  return (
    <div id="specialdjStarting">
      <h1>스페셜 Dj 선발 요건</h1>
      <p className="notice">
        스페셜 DJ에 관한 회원분들의 의견을 반영하여 <br />
        다음과 같이 선발 요건이 변경 되었습니다.
      </p>

      <ul className="list">
        <li>
          <img src={NumberImg01} className="numberImg" />
          정량적 지표에 대한 내용을
          <br />
          방송 점수, 청취자 점수, 방송 호응도, 받은 선물
          <br />총 4개 항목으로 변경하였습니다.
        </li>

        <li>
          <img src={NumberImg02} className="numberImg" />
          공개된 4개 항목들을 합산하여 총 100점으로
          <br />
          점수를 산정합니다.
        </li>

        <li>
          <img src={NumberImg03} className="numberImg" />
          합산된 총 점수인 100점에
          <br />
          일간 랭킹 가산점을 적용하여 총 110점 만점으로
          <br />총 점수표를 변경하였습니다.
        </li>
      </ul>
      <p className="subText">※ 자세한 내용은 공지사항을 통해 확인 바랍니다.</p>
      <button>공지사항 보러가기</button>
    </div>
  )
}
