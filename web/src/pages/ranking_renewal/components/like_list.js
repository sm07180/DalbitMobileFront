import React, {useContext} from 'react'
import {useHistory} from 'react-router-dom'
import styled, {css} from 'styled-components'

import Room, {RoomJoin} from 'context/room'
import NoResult from 'components/ui/noResult'
// context
import {Context} from 'context'
import {RankContext} from 'context/rank_ctx'
import {IMG_SERVER} from 'context/config'

//static
import guideIcon from '../static/guide_s.png'
import goodIcon from '../static/like_w_m.svg'
import likeIcon from '../static/like_g_s.svg'
const goldMedalIcon = `${IMG_SERVER}/main/200714/ico-ranking-gold.png`
const silverMedalIcon = `${IMG_SERVER}/main/200714/ico-ranking-silver.png`
const bronzeMedalIcon = `${IMG_SERVER}/main/200714/ico-ranking-bronze.png`

function LikeList({empty}) {
  const context = useContext(Context)
  const {rankState} = useContext(RankContext)
  const history = useHistory()
  const {likeList} = rankState
  return (
    <>
      <ul>
        <li className="renewalBox">
          <span>매일 00시 집계 및 갱신</span>
          <img
            src={guideIcon}
            onClick={() => {
              context.action.updatePopup('RANK_POP', 'like')
            }}
          />
        </li>
        {empty === true ? (
          <NoResult />
        ) : (
          likeList.map((list, index) => {
            const {
              nickNm,
              fanNickNm,
              fanMemNo,
              profImg,
              holder,
              rank,
              grade,
              fanGoodCnt,
              roomNo,
              memNo,
              totalGoodCnt,
              upDown
            } = list

            return (
              <li key={index} className="levelListBox">
                <div className="levelListBox__levelBox">
                  {rank === 1 ? (
                    <img src={goldMedalIcon} className="levelListBox__levelBox--top1" />
                  ) : rank === 2 ? (
                    <img src={silverMedalIcon} className="levelListBox__levelBox--top2" />
                  ) : rank === 3 ? (
                    <img src={bronzeMedalIcon} className="levelListBox__levelBox--top3" />
                  ) : (
                    <div className="levelListBox__levelBox--rankText">{rank}</div>
                  )}
                  <div className="levelListBox__levelBox--updown">
                    {upDown === '-' ? (
                      <span className="levelListBox__levelBox--updown__new"></span>
                    ) : upDown === 'new' ? (
                      <span className="levelListBox__levelBox--updown__new">NEW</span>
                    ) : upDown[0] === '+' ? (
                      <span className="levelListBox__levelBox--updown__up">{Math.abs(parseInt(upDown))}</span>
                    ) : (
                      <span className="levelListBox__levelBox--updown__down">{Math.abs(parseInt(upDown))}</span>
                    )}
                  </div>
                </div>
                <div
                  className="thumbBox"
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
                  <img src={holder} className="thumbBox__frame" />
                  <img src={profImg.thumb120x120} className="thumbBox__pic" />
                </div>
                <div className="textBox">
                  <div className="fanGoodBox">
                    <img src={goodIcon} />
                    <span>{totalGoodCnt.toLocaleString()}</span>
                  </div>
                  <div className="nickNameBox">{nickNm}</div>
                  {/* <div className="countBox">
                      </div> */}
                  <div className="bestFanBox">
                    <span className="bestFanBox__label">왕큐피트</span>
                    <span
                      className="bestFanBox__nickNm"
                      onClick={() => {
                        if (context.token.isLogin) {
                          if (context.token.memNo === fanMemNo) {
                            history.push(`/menu/profile`)
                          } else {
                            history.push(`/mypage/${fanMemNo}`)
                          }
                        } else {
                          history.push(`/login`)
                        }
                      }}>
                      {fanNickNm}
                    </span>
                    <span className="bestFanBox__icon">{fanGoodCnt}</span>
                  </div>
                </div>
              </li>
            )
          })
        )}
      </ul>
    </>
  )
}

export default React.memo(LikeList)
