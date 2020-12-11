import React, {useContext, useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'
import {RankContext} from 'context/rank_ctx'
import NoResult from 'components/ui/new_noResult'
import '../index.scss'

function WeeklyPick({empty}) {
  const history = useHistory()
  const {rankState} = useContext(RankContext)
  const {weeklyList} = rankState

  return (
    <div className="weeklyPick">
      <div className="notice">
        달빛라이브 달과장을 심쿵하게 한<br />
        이주의 달빛 DJ는 누구일까요?
      </div>
      {empty === true ? (
        <NoResult type="default" text="조회 된 결과가 없습니다." />
      ) : (
        <ul className="list">
          {weeklyList.map((v, i) => {
            if (!v) return null
            const {idx, round, memNo1, memNick1, imageInfo1, memNo2, memNick2, imageInfo2} = v
            return (
              <li key={`list-${i}`} className="item">
                <div className="djBox number">
                  <p className={i === 0 ? `on` : ``}>{round}회차</p>
                </div>

                <div className="djBox" onClick={() => history.push(`/mypage/${memNo1}`)}>
                  <img src={imageInfo1.thumb120x120} className="djBox__img" alt={memNick1} />
                  <strong className="djBox__nick">{memNick1}</strong>
                </div>

                {memNo2 && memNick2 && imageInfo2 && (
                  <div className="djBox last" onClick={() => history.push(`/mypage/${memNo2}`)}>
                    <img src={imageInfo2.thumb120x120} className="djBox__img" alt={memNick2} />
                    <strong className="djBox__nick">{memNick2}</strong>
                  </div>
                )}
                <button className="btnMore" onClick={() => history.push(`/rank/pick?idx=${idx}`)}>
                  <img src="https://image.dalbitlive.com/svg/icon_more_right.svg" alt="상세페이지이동" />
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default React.memo(WeeklyPick)
