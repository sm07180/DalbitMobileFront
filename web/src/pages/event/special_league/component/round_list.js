import React from 'react'
import {useHistory} from 'react-router-dom'

export default function RoundList({rankList}) {
  const history = useHistory()

  const FanPointCount = (fanPoint) => {
    let upDown = fanPoint && fanPoint.slice(0, 1)
    let num = fanPoint && fanPoint.slice(1)
    if (upDown === '0') {
      return '0'
    } else {
      return `${upDown}${num.toLocaleString()}`
    }
  }

  return (
    <div className="list_wrap">
      <ul className="list_box top3">
        {rankList.length > 0 &&
          rankList.slice(0, 3).map((item, index) => {
            const {rank, upDown, memNo, nickName, profImg, giftPoint, listenerPoint, goodPoint, totalPoint, fanPoint} = item
            return (
              <li className="list_item" key={index}>
                <div className="rank_box">
                  <span className="rank">{rank}</span>
                  {upDown === '-' || upDown === '' ? (
                    <span className="up_down">{upDown}</span>
                  ) : upDown.includes('new') ? (
                    <span className="up_down new">{upDown}</span>
                  ) : upDown.includes('+') ? (
                    <span className="up_down up">{Math.abs(parseInt(upDown))}</span>
                  ) : (
                    <span className="up_down down">{Math.abs(parseInt(upDown))}</span>
                  )}
                </div>
                <div className="thumb_box" onClick={() => history.push(`/profile/${memNo}`)}>
                  <img src={profImg.thumb292x292} alt={nickName} />
                  <span className="nick"> {nickName}</span>
                </div>

                <dl className="point_box">
                  {/* <dt>
                    <img src="https://image.dalbitlive.com/svg/ico_point.svg" width={16} alt="획득" /> 획득
                  </dt>
                  <dd>{totalPoint.toLocaleString()}</dd> */}
                  <dt>
                    <img src="https://image.dalbitlive.com/svg/people_g_m.svg" width={16} alt="청취자수" /> 50
                  </dt>
                  <dd>{listenerPoint.toLocaleString()}회</dd>
                  <dt>
                    <img src="https://image.dalbitlive.com/svg/like_r_m.svg" width={16} alt="좋아요" /> 100
                  </dt>
                  <dd>{goodPoint.toLocaleString()}회</dd>

                  <dt>
                    <img src="https://image.dalbitlive.com/svg/ic_fan.svg" width={16} alt="팬등록" /> 100
                  </dt>
                  <dd>{FanPointCount(fanPoint)}명</dd>
                </dl>
              </li>
            )
          })}
      </ul>

      <ul className="list_box">
        {rankList &&
          rankList.slice(3, 100).map((item, index) => {
            const {rank, upDown, memNo, nickName, profImg, giftPoint, listenerPoint, goodPoint, totalPoint, fanPoint} = item
            return (
              <li className="list_item" key={index}>
                <div className="rank_box">
                  <span className="rank">{rank}</span>
                  {upDown === '-' || upDown === '' ? (
                    <span className="up_down">{upDown}</span>
                  ) : upDown.includes('new') ? (
                    <span className="up_down new">{upDown}</span>
                  ) : upDown.includes('+') ? (
                    <span className="up_down up">{Math.abs(parseInt(upDown))}</span>
                  ) : (
                    <span className="up_down down">{Math.abs(parseInt(upDown))}</span>
                  )}
                </div>
                <div className="thumb_box" onClick={() => history.push(`/profile/${memNo}`)}>
                  <img src={profImg.thumb292x292} alt={nickName} />
                  <span className="nick">{nickName}</span>
                </div>

                <dl className="point_box">
                  {/* <dt>
                    <img src="https://image.dalbitlive.com/svg/ico_point.svg" width={16} alt="획득" /> 획득
                  </dt>
                  <dd>{totalPoint.toLocaleString()}</dd> */}
                  <dt>
                    <img src="https://image.dalbitlive.com/svg/people_g_m.svg" width={16} alt="청취자수" /> 50
                  </dt>
                  <dd>{listenerPoint.toLocaleString()}회</dd>
                  <dt>
                    <img src="https://image.dalbitlive.com/svg/like_r_m.svg" width={16} alt="좋아요" /> 100
                  </dt>
                  <dd>{goodPoint.toLocaleString()}회</dd>
                  <dt>
                    <img src="https://image.dalbitlive.com/svg/ic_fan.svg" width={16} alt="팬등록" /> 100
                  </dt>
                  <dd>{FanPointCount(fanPoint)}명</dd>
                </dl>
              </li>
            )
          })}
      </ul>
    </div>
  )
}
