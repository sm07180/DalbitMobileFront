import React, {useContext} from 'react'
import {useHistory} from 'react-router-dom'
import styled, {css} from 'styled-components'

import Room, {RoomJoin} from 'context/room'
import NoResult from 'components/ui/new_noResult'
// context
import {Context} from 'context'
import {RankContext} from 'context/rank_ctx'
import {IMG_SERVER} from 'context/config'

import MyProfile from './MyProfile'

//static
import guideIcon from '../static/guide_s.png'
import goodIcon from '../static/like_w_m.svg'
import likeIcon from '../static/like_g_s.svg'
const goldMedalIcon = `${IMG_SERVER}/main/200714/ico-ranking-gold.png`
const silverMedalIcon = `${IMG_SERVER}/main/200714/ico-ranking-silver.png`
const bronzeMedalIcon = `${IMG_SERVER}/main/200714/ico-ranking-bronze.png`
import likeRedIcon from '../static/like_red_m.svg'

import {RANK_TYPE} from '../constant'

function LikeList({empty}) {
  const context = useContext(Context)
  const {rankState} = useContext(RankContext)
  const history = useHistory()
  const {formState, likeList, rankList} = rankState
  return (
    <>
      {empty === true ? (
        <NoResult type="default" text="조회 된 결과가 없습니다." />
      ) : (
        <>
          {context.token.isLogin ? (
            <div className="likeTopBox">
              <MyProfile />
            </div>
          ) : (
            ''
          )}

          <div
            className={`userRanking bottomList ${
              formState[formState.pageType].rankType === RANK_TYPE.LIKE && !context.token.isLogin ? 'likeList' : ''
            }`}>
            <ul>
              {rankList.map((list, index) => {
                const {
                  nickNm,
                  djNickNm,
                  fanMemNo,
                  profImg,
                  holder,
                  rank,
                  grade,
                  djGoodPoint,
                  djMemNo,
                  roomNo,
                  memNo,
                  goodPoint,
                  upDown
                } = list

                return (
                  <li key={index} className="myRanking rankingList">
                    <div className="myRanking__rank levelListBox__levelBox">
                      {rank === 1 ? (
                        <img src={goldMedalIcon} className="levelListBox__levelBox--top1" />
                      ) : rank === 2 ? (
                        <img src={silverMedalIcon} className="levelListBox__levelBox--top2" />
                      ) : rank === 3 ? (
                        <img src={bronzeMedalIcon} className="levelListBox__levelBox--top3" />
                      ) : (
                        <div className="myRanking__rank--ranking">{rank}</div>
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
                      <img src={profImg.thumb120x120} className="thumbBox__pic" />
                    </div>
                    <div className="likeDetailWrap">
                      <div
                        className="likeListDetail"
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
                        <div className="fanGoodBox">
                          <img src={likeRedIcon} />
                          <span>{goodPoint.toLocaleString()}</span>
                        </div>
                        <div className="nickNameBox">{nickNm}</div>
                      </div>
                      {/* <div className="countBox">
                      </div> */}
                      <div className="bestFanBox">
                        <span className="bestFanBox__label">심쿵유발자</span>
                        <span
                          className="bestFanBox__nickname"
                          onClick={() => {
                            if (context.token.isLogin) {
                              if (context.token.memNo === memNo) {
                                history.push(`/menu/profile`)
                              } else {
                                history.push(`/mypage/${djMemNo}`)
                              }
                            } else {
                              history.push(`/login`)
                            }
                          }}>
                          {djNickNm}
                        </span>
                        <span className="bestFanBox__icon">
                          <img src={likeIcon} />
                          {djGoodPoint}
                        </span>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </>
      )}
    </>
  )
}

export default React.memo(LikeList)
