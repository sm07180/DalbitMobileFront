import React, {useContext, useEffect, useState} from 'react'

//context
import {Context} from 'context'

export default function RankingType(props) {
  const globalCtx = useContext(Context)
  // globalCtx.action.updatePopup('TERMS', 'event-detail')
  // globalCtx.action.updatePopup('TERMS', 'event-gift-detail')

  if (props.rankingType === 'exp') {
    return (
      <div className="content-wrap">
        <img src="https://image.dalbitlive.com/event/200603/ranking_exp_img.png" />

        <div className="notice-wrap">
          <p>
            <span>※</span> 순위는 실시간으로 집계됩니다.
          </p>
          <p>
            <span>※</span> 당첨자 발표일 및 유의사항 <button type="button">자세히보기</button>
          </p>
        </div>
      </div>
    )
  } else if (props.rankingType === 'like') {
    return (
      <div className="content-wrap">
        <img src="https://image.dalbitlive.com/event/200603/ranking_exp_img.png" />

        <div className="notice-wrap">
          <p>
            <span>※</span> 순위는 실시간으로 집계됩니다.
          </p>
          <p>
            <span>※</span> 당첨자 발표일 및 유의사항 <button type="button">자세히보기</button>
          </p>
        </div>
      </div>
    )
  } else if (props.rankingType === 'gift') {
    return (
      <div className="content-wrap">
        <img src="https://image.dalbitlive.com/event/200603/ranking_exp_img.png" />

        <div className="notice-wrap">
          <p>
            <span>※</span> 순위는 실시간으로 집계됩니다.
          </p>
          <p>
            <span>※</span> 당첨자 발표일 및 유의사항 <button type="button">자세히보기</button>
          </p>
        </div>
      </div>
    )
  }

  return null
}
