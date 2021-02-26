import React, {useContext} from 'react'
import {useHistory} from 'react-router-dom'
import {Context} from 'context'

import NoResult from 'components/ui/new_noResult'

// static
const GoldMedal = 'https://image.dalbitlive.com/svg/medal_gold_b.svg'
const SivelMedal = 'https://image.dalbitlive.com/svg/medal_silver_b.svg'
const BronzeMedal = 'https://image.dalbitlive.com/svg/medal_bronze_m.svg'

export default function StatusList({nowEventNo, scoreData}) {
  const history = useHistory()
  const context = useContext(Context)

  const eventNo = () => {
    const eventNoList = [1, 2, 3, 4, 5]
    return eventNoList.map((number, index) => {
      if (nowEventNo === index + 1) {
        return (
          <article className="status active" key={index}>
            {number}차<span>진행중</span>
          </article>
        )
      } else if (nowEventNo > index + 1) {
        return (
          <article className="status complete" key={index}>
            {number}차
          </article>
        )
      } else {
        return (
          <article className="status" key={index}>
            {number}차<span>예정</span>
          </article>
        )
      }
    })
  }

  return (
    <ol className="event_list">
      <li className="event_item category">
        <article className="status">
          <p className="rank">순위</p>
          <p className="nickname">닉네임</p>
        </article>
        {eventNo()}
      </li>
      {scoreData.length === 0 ? (
        <div className="noResult">
          <img src="https://image.dalbitlive.com/event/championship/20210223/img_noresult.png" alt="집계중입니다" />
        </div>
      ) : (
        <>
          {scoreData.map((item, index) => {
            const {rank, nickNm, memNo, winPoint1, winPoint2, winPoint3, winPoint4, winPoint5} = item
            const eventPoint = () => {
              const pointList = [winPoint1, winPoint2, winPoint3, winPoint4, winPoint5]
              return pointList.map((point, index) => <span key={index}>{`${point}점`}</span>)
            }
            return (
              <li key={`item - ${index}`} className="event_item status_item">
                <div className="info_box">
                  <span className="rank">
                    {rank < 4 ? (
                      <img className="medal_icon" src={rank === 1 ? GoldMedal : rank === 2 ? SivelMedal : BronzeMedal} />
                    ) : (
                      <span className="num">{rank}</span>
                    )}
                  </span>
                  <span
                    className="nick"
                    onClick={() => {
                      if (context.token.isLogin) {
                        if (context.token.memNo === memNo) {
                          history.push(`/menu/profile`)
                        } else {
                          history.push(`/mypage/${memNo}`)
                        }
                      } else {
                        history.push(`/login`)
                      }
                    }}>
                    {nickNm}
                  </span>
                </div>
                {eventPoint()}
              </li>
            )
          })}
        </>
      )}
    </ol>
  )
}
