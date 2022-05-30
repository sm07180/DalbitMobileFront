import React from 'react'

export default function MyRank({myData}) {
  const {myGiftPoint, myGoodPoint, myListenerPoint, myRank, myTotalPoint, myUpDown, nowRoundNo, myFanPoint} = myData

  const FanPointCount = () => {
    let upDown = myFanPoint && myFanPoint.slice(0, 1)
    let num = myFanPoint && myFanPoint.slice(1)
    if (upDown === '0') {
      return '0'
    } else {
      return `${upDown}${num.toLocaleString()}`
    }
  }

  return (
    <div className="my_rank_box">
      <dl className="my_rank">
        <dt>내 순위 정보</dt>
        <dd>
          <span className="rank">{myRank}</span>등
        </dd>
      </dl>

      <dl className="my_point">
        <dt>
          <img src="https://image.dallalive.com/svg/ico_point.svg" width={16} alt="획득" /> 획득
        </dt>
        <dd>{myTotalPoint.toLocaleString()}</dd>
        <dt>
          <img src="https://image.dallalive.com/svg/people_g_m.svg" width={16} alt="청취자수" /> 50
        </dt>
        <dd>{myListenerPoint.toLocaleString()}회</dd>
        <dt>
          <img src="https://image.dallalive.com/svg/cashstar_purple_s.svg" width={16} alt="별" /> 1,000
        </dt>
        <dd>{myGiftPoint.toLocaleString()}회</dd>
        <dt>
          <img src="https://image.dallalive.com/svg/like_r_m.svg" width={16} alt="좋아요" /> 100
        </dt>
        <dd>{myGoodPoint.toLocaleString()}회</dd>
        <dt>
          <img src="https://image.dallalive.com/svg/ic_fan.svg" width={16} alt="팬등록" /> 100
        </dt>
        <dd>{FanPointCount()}명</dd>
      </dl>
    </div>
  )
}
