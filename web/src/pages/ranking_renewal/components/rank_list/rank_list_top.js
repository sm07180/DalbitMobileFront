import React, {useContext} from 'react'
import {useHistory} from 'react-router-dom'

import {Context} from 'context'
import {RankContext} from 'context/rank_ctx'

// import { RoomJoin } from "context/room";

import {printNumber} from '../../lib/common_fn'

//static
import point from '../../static/ico-point.png'
import point2x from '../../static/ico-point@2x.png'
import like from '../../static/like_g_s.svg'
import live from '../../static/live.svg'
import people from '../../static/people_g_s.svg'
import time from '../../static/time_g_s.svg'
import StarCountIcon from '../../static/circle_star_s_g.svg'
import list from 'pages/mypage/component/wallet/list'

function RankListTop() {
  const history = useHistory()
  //context
  const context = useContext(Context)

  const {rankState} = useContext(RankContext)
  const {rankList, formState} = rankState

  const creatList = () => {
    return (
      <>
        <div className="userRanking">
          <div className="TopBox">
            {rankList.length > 0 &&
              rankList.slice(0, 3).map((item, index) => {
                const {
                  gender,

                  grade,
                  nickNm,
                  rank,
                  profImg,
                  level,
                  upDown,
                  listenPoint,
                  listenerPoint,
                  goodPoint,
                  broadcastPoint,
                  fanPoint,
                  djPoint,
                  isSpecial,
                  roomNo,
                  memNo,
                  holder,
                  starCnt
                } = item

                let rankName
                let genderName

                if (rank == 1 || rank == 2 || rank == 3) {
                  rankName = `medal medalBox--top${rank}`
                }
                if (gender == 'm' || gender == 'f') {
                  genderName = `genderBox gender-${gender}`
                } else {
                  genderName = `genderBox`
                }

                return (
                  <div
                    className={'TopBox__item ' + `${context.token.isLogin && context.token.memNo === memNo ? 'active' : ''}`}
                    key={index}>
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
                          history.push(`/mypage/${memNo}`)
                        }
                      }}>
                      <img src={holder} className="thumbBox__frame" />
                      <img src={profImg.thumb120x120} className="thumbBox__pic" />
                    </div>

                    <div
                      onClick={() => {
                        if (context.token.isLogin) {
                          if (context.token.memNo === memNo) {
                            history.push(`/menu/profile`)
                          } else {
                            history.push(`/mypage/${memNo}`)
                          }
                        } else {
                          history.push(`/mypage/${memNo}`)
                        }
                      }}>
                      {/* <p className={levelName}>
                      Lv{level} {grade}
                    </p> */}
                      <div className="nickNameBox">
                        <span className="nickName">{nickNm}</span>
                        <div className="iconBox">
                          {/*<img src={korea} srcSet={`${korea} 1x, ${korea2x} 2x`} className="korea-m"/> */}
                          <span className={genderName}>{gender}</span>
                          {isSpecial === true && <em className="specialDj">스페셜DJ</em>}
                        </div>
                      </div>
                    </div>

                    <div
                      className="countBox"
                      onClick={() => {
                        if (context.token.isLogin) {
                          if (context.token.memNo === memNo) {
                            history.push(`/menu/profile`)
                          } else {
                            history.push(`/mypage/${memNo}`)
                          }
                        } else {
                          history.push(`/mypage/${memNo}`)
                        }
                      }}>
                      {formState.rankType === 1 && (
                        <>
                          {/* <span className="countBox__item countBox__item--point">
                          <img src={point} srcSet={`${point} 1x, ${point2x} 2x`} />
                          {printNumber(djPoint)}
                        </span> */}

                          <div className="countBoxInner">
                            <span className="countBox__item">
                              <img src={people} />
                              {printNumber(listenerPoint)}
                            </span>
                            <span className="countBox__item">
                              <img src={like} />
                              {printNumber(goodPoint)}
                            </span>

                            <span className="countBox__item">
                              <img src={time} />
                              {printNumber(broadcastPoint)}
                            </span>
                          </div>
                        </>
                      )}

                      {formState.rankType === 2 && (
                        <>
                          {/* <span className="countBox__item countBox__item--point">
                          <img src={point} />
                          {printNumber(fanPoint)}
                        </span> */}
                          {/* <span className="countBox__item">
                          <img src={moon} />
                          {Util.printNumber(gift)}
                        </span> */}
                          <span className="countBox__item">
                            <img src={StarCountIcon} />
                            {printNumber(starCnt)}
                          </span>
                          <span className="countBox__item">
                            <img src={time} />
                            {printNumber(listenPoint)}
                          </span>
                        </>
                      )}
                    </div>

                    <div className="medalBox">
                      <p className={rankName}>{rank}</p>
                      <p className="rankingChange">
                        {upDown === 'new' ? (
                          <span className="rankingChange__new">NEW</span>
                        ) : upDown > 0 ? (
                          <span className="rankingChange__up">{Math.abs(upDown)}</span>
                        ) : upDown < 0 ? (
                          <span className="rankingChange__down">{Math.abs(upDown)}</span>
                        ) : (
                          <></>
                        )}
                      </p>
                    </div>

                    {roomNo !== '' && (
                      <div className="liveBox">
                        <img
                          src={live}
                          onClick={() => {
                            history.push(`/broadcast/${roomNo}`)
                          }}
                          className="liveBox__img"
                        />
                        <br />
                        LIVE
                      </div>
                    )}
                  </div>
                )
              })}
          </div>
        </div>
      </>
    )
  }

  return creatList()
}

export default React.memo(RankListTop)
