import React, {useContext, useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'
import {RankContext} from 'context/rank_ctx'
import NoResult from 'components/ui/new_noResult'
import ProfileImage from 'components/ui/profileImage'
import '../index.scss'

function WeeklyPick({empty}) {
  const history = useHistory()
  const {rankState} = useContext(RankContext)
  const {weeklyList} = rankState

  return (
    <div className="specialPage">
      <div className="notice">
        달라 달대리을 심쿵하게 한<br />
        이주의 달라 DJ는 누구일까요?
      </div>
      {empty === true ? (
        <NoResult type="default" text="조회 된 결과가 없습니다." />
      ) : (
        <ul className="levelListWrap">
          {weeklyList.map((v, i) => {
            if (!v) return null
            const {idx, round, memberList} = v
            return (
              <li key={`list-${i}`} className="levelListBox" onClick={() => history.push(`/rank/pick?idx=${idx}`)}>
                <div className="specialBox specialBox-pick">
                  <span className={i === 0 ? `on` : ``}>{round}회차</span>
                </div>
                <div className="infoBox infoBox-weekly flexBox">
                  {memberList &&
                    memberList.map((v1, i1) => {
                      return (
                        <div key={`memberList-${i1}`} className="profileBox flexBox">
                          <ProfileImage imageData={{profImg: v1.imageInfo.thumb120x120}} imageSize={74} />
                          <strong className="nickNameBox ellipsis">{v1.memNick}</strong>
                        </div>
                      )
                    })}
                </div>
                <button className="btnMore">
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
