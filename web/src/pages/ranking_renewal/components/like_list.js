import React, {useContext, useMemo} from 'react'
import {useHistory} from 'react-router-dom'
// context
import {Context} from 'context'
import {IMG_SERVER} from 'context/config'

//static
import likeIcon from '../static/like_g_s.svg'
import likeRedIcon from '../static/like_red_m.svg'

import {RANK_TYPE} from '../constant'
import {useSelector} from "react-redux";

const goldMedalIcon = `${IMG_SERVER}/main/200714/ico-ranking-gold.png`
const silverMedalIcon = `${IMG_SERVER}/main/200714/ico-ranking-silver.png`
const bronzeMedalIcon = `${IMG_SERVER}/main/200714/ico-ranking-bronze.png`

function LikeList({empty}) {
  const context = useContext(Context)
  const rankState = useSelector(({rankCtx}) => rankCtx);
  const history = useHistory()
  const {formState, likeList, rankList} = rankState

  const sliceStart = useMemo(() => {
    if (formState[formState.pageType].rankType === RANK_TYPE.LIKE) {
      return 3
    } else {
      return 0
    }
  }, [formState])

  return (
    <div className="userRanking bottomList">
      <ul>
        {rankList.slice(sliceStart).map((list, index) => {
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
                {/* {rank === 1 ? (
                        <img src={goldMedalIcon} className="levelListBox__levelBox--top1" />
                      ) : rank === 2 ? (
                        <img src={silverMedalIcon} className="levelListBox__levelBox--top2" />
                      ) : rank === 3 ? (
                        <img src={bronzeMedalIcon} className="levelListBox__levelBox--top3" />
                      ) : (
                        <div className="myRanking__rank--ranking">{rank}</div>
                      )} */}
                <div className="myRanking__rank--ranking">{rank}</div>
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
                    history.push(`/profile/${memNo}`)
                  } else {
                    history.push(`/login`)
                  }
                }}>
                <img src={profImg.thumb292x292} className="thumbBox__pic" />
              </div>
              <div className="likeDetailWrap">
                <div
                  className="likeListDetail"
                  onClick={() => {
                    if (context.token.isLogin) {
                      history.push(`/profile/${memNo}`)
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
                          history.push(`/myProfile`)
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
  )
}

export default React.memo(LikeList)
