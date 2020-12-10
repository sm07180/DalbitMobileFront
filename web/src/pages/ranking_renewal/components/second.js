import React, {useContext, useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'
import {RankContext} from 'context/rank_ctx'
import styled, {css} from 'styled-components'
import NoResult from 'components/ui/new_noResult'
import '../index.scss'

function Second({empty}) {
  const history = useHistory()
  const {rankState} = useContext(RankContext)
  const {secondList} = rankState

  return (
    <div className="weeklyPick weeklyPick--dj">
      <div className="notice">
        나를 표현하는 시간 15초 <br />
        달빛라이브 광고모델을 소개합니다.
      </div>

      {empty === true ? (
        <NoResult type="default" text="조회 된 결과가 없습니다." />
      ) : (
        <ul className="list">
          {secondList.map((v, i) => {
            if (!v) return null
            const {
              idx,
              memNo1,
              title,
              round,
              memSex1,
              memNick1,
              imageInfo1,
              regDate,
              level,
              levelColor,
              holder,
              holderBg,
              likeCnt,
              listenCnt,
              airTime
            } = v
            return (
              <li key={`list-${i}`} className="item">
                <div className="djBox number">
                  <p className={i === 0 ? `on` : ``}>{round}회차</p>
                </div>

                <div className="djBox img" onClick={() => history.push(`/mypage/${memNo1}`)}>
                  {holder && <img src={holder} className="frame" />}
                  {holderBg && <img src={holderBg} className="frame" />}
                  <img src={imageInfo1.thumb120x120} className="thumb" />
                </div>
                <div className="djBox text" onClick={() => history.push(`/rank/marketing?idx=${idx}`)}>
                  <div className="title">{title}</div>
                  <span className="level">
                    <LevelBox levelColor={levelColor}>Lv{level}</LevelBox>
                    {memSex1 === 'w' && <img src="https://image.dalbitlive.com/svg/gender_w_w.svg" className="ico" />}
                    {memSex1 === 'm' && <img src="https://image.dalbitlive.com/svg/gender_m_w.svg" className="ico" />}
                  </span>
                  <ul className="pointList">
                    <li>
                      <img src="https://image.dalbitlive.com/svg/ico_like_g_s.svg" />
                      {likeCnt}
                    </li>
                    <li>
                      <img src="https://image.dalbitlive.com/svg/people_g_s.svg" />
                      {listenCnt}
                    </li>
                    <li>
                      <img src="https://image.dalbitlive.com/svg/time_g_s.svg" />
                      {airTime}
                    </li>
                  </ul>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default React.memo(Second)

const LevelBox = styled.div`
  ${(props) => {
    if (props.levelColor.length === 3) {
      return css`
        background-image: linear-gradient(to right, ${props.levelColor[0]}, ${props.levelColor[1]} 51%, ${props.levelColor[2]});
      `
    } else {
      return css`
        background-color: ${props.levelColor[0]};
      `
    }
  }};
  width: 44px;
  height: 16px;
  border-radius: 14px;
  font-weight: 500;
  font-size: 12px;
  color: #fff;
  text-align: center;
  letter-spacing: -0.3px;
`
