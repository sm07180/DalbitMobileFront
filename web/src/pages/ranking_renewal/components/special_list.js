import React, {useContext} from 'react'
import styled, {css} from 'styled-components'
import {useHistory} from 'react-router-dom'

import {Context} from 'context'
import {RankContext} from 'context/rank_ctx'

import NoResult from 'components/ui/noResult'
import {RoomJoin} from 'context/room'

import like from '../static/like_g_s.svg'
import people from '../static/people_g_s.svg'
import time from '../static/time_g_s.svg'
import live from '../static/live_m.svg'

function SpecialList({empty}) {
  const history = useHistory()
  const context = useContext(Context)
  const {rankState} = useContext(RankContext)

  const {specialList} = rankState

  return (
    <>
      <div className="specialPage">
        <p className="specialText">달빛라이브의 스타 스페셜 DJ를 소개합니다.</p>
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
                    <div className="specialBox">
                      {v.isNew === true ? <span className="new">NEW</span> : <span>{v.specialCnt}회</span>}
                    </div>
                    <div
                      className="thumbBox"
                      onClick={() => {
                        if (context.token.isLogin) {
                          if (context.token.memNo === v.memNo) {
                            history.push(`/menu/profile`)
                          } else {
                            history.push(`/mypage/${v.memNo}`)
                          }
                        } else {
                          history.push('/login')
                        }
                      }}>
                      <img src={v.holder} className="thumbBox__frame" />
                      <img src={v.profImg.thumb120x120} className="thumbBox__pic" />
                    </div>
                    <div className="test">
                      <div
                        className="nickNameBox"
                        onClick={() => {
                          if (context.token.isLogin) {
                            if (context.token.memNo === v.memNo) {
                              history.push(`/menu/profile`)
                            } else {
                              history.push(`/mypage/${v.memNo}`)
                            }
                          } else {
                            history.push('/login')
                          }
                        }}>
                        {v.nickNm}
                      </div>
                      <div className="genderBox">
                        <LevelBox levelColor={v.levelColor}>Lv{v.level}</LevelBox>
                        <span className={genderName} />
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

                    {v.roomNo !== '' && (
                      <div className="liveBox">
                        <img
                          src={live}
                          onClick={() => {
                            RoomJoin({roomNo: v.roomNo})
                          }}
                          className="liveBox__img"
                        />
                      </div>
                    )}
                  </li>
                )
              })}
            </>
          )}
        </ul>
      </div>
    </>
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
