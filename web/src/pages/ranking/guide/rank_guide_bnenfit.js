import React from 'react'

import crownIcon from '../static/ic_crown_y.svg'

export default (props) => {
  return (
    <>
      <div className="benefitTop">
        <p className="benefitTop__title">
          <img src={crownIcon} /> DJ / FAN TOP 3에 도전해보세요!
        </p>
        <p>랭커만을 위한 스페셜한 혜택을 받게 됩니다.</p>
      </div>

      <div className="benefitTable">
        <p>
          TOP 랭킹 배지 지급<span>프로필과 방송방에서 랭킹 배지를 자랑하세요!</span>
        </p>

        <table>
          <tr>
            <td>랭킹</td>
          </tr>
        </table>
      </div>
    </>
  )
}
