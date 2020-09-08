import React, {useContext} from 'react'
import styled, {css} from 'styled-components'

import {RankContext} from 'context/rank_ctx'

import NoResult from 'components/ui/noResult'

import like from '../static/like_g_s.svg'
import people from '../static/people_g_s.svg'
import time from '../static/time_g_s.svg'

function SpecialList({empty}) {
  const {rankState} = useContext(RankContext)

  const {specialList} = rankState

  return (
    <ul>
      {empty === true ? (
        <NoResult />
      ) : (
        <>
          {specialList.map((v, idx) => {
            let genderName
            if (v.gender == 'm' || v.gender == 'f') {
              genderName = `genderBox gender-${v.gender}`
            } else {
              genderName = `genderBox`
            }

            return (
              <li key={idx} className="levelListBox">
                <div className="specialBox">{v.specialCnt}회</div>
                <div
                  className="thumbBox"
                  onClick={() => {
                    if (context.token.isLogin) {
                      if (context.token.memNo === memNo) {
                        history.push(`/menu/profile`)
                      } else {
                        history.push(`/mypage/${v.memNo}`)
                      }
                    } else {
                      history.push(`/mypage/${v.memNo}`)
                    }
                  }}>
                  <img src={v.holder} className="thumbBox__frame" />
                  <img src={v.profImg.thumb120x120} className="thumbBox__pic" />
                </div>
                <div>
                  <div className="nickNameBox">{v.nickNm}</div>
                  <div className="genderBox">
                    <LevelBox levelColor={v.levelColor}>Lv{v.level}</LevelBox>
                    <span className={genderName}>{v.gender}</span>
                  </div>
                  <div className="countBox">
                    <span>
                      <img src={like} /> {v.goodCnt}
                    </span>
                    <span>
                      <img src={people} /> {v.listenerCnt}
                    </span>
                    <span>
                      <img src={time} /> {v.broadMin}
                    </span>
                  </div>
                </div>
              </li>
            )
          })}
        </>
      )}
    </ul>
  )
}

export default React.memo(SpecialList)

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
  font-weight: bold;
  font-size: 12px;
  color: #fff;
  text-align: center;
  letter-spacing: -0.3px;
`
