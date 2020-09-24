import React, {useContext} from 'react'
import {useHistory} from 'react-router-dom'

import {RoomJoin} from 'context/room'
import {printNumber} from '../../lib/common_fn'

// context
import {Context} from 'context'
import {RankContext} from 'context/rank_ctx'

//static
import point from '../../static/ico-point.png'
import point2x from '../../static/ico-point@2x.png'
import like from '../../static/like_g_s.svg'
import live from '../../static/live.svg'
import people from '../../static/people_g_s.svg'
import time from '../../static/time_g_s.svg'
import StarCountIcon from '../../static/circle_star_s_g.svg'

function RankList() {
  //context
  const context = useContext(Context)
  const {rankState} = useContext(RankContext)

  const {rankList, formState} = rankState

  const history = useHistory()

  const creatList = () => {
    return (
      <>
        <div className="userRanking bottomList">
          {rankList.length > 3 &&
            rankList.slice(3).map((item, index) => {
              const {
                gender,
                nickNm,
                rank,
                profImg,
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
                starCnt
              } = item
              let genderName

              if (gender == 'm' || gender == 'f') {
                genderName = `genderBox gender-${gender}`
              } else {
                genderName = `genderBox`
              }

              return (
                <div className="myRanking rankingList" key={index}>
                  <div
                    className="myRanking__rank"
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
                    <p className="myRanking__rank--ranking">{rank}</p>
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
                    {/* {formState.rankType === 1 && (
                    <>
                      <p className="myRanking__left--point">
                        <img src={point} srcSet={`${point} 1x, ${point2x} 2x`} className="myRanking__img" />
                        {printNumber(djPoint)}
                      </p>
                    </>
                  )} */}

                    {/* {formState.rankType === 2 && (
                    <>
                      <p className="myRanking__left--point">
                        <img src={point} srcSet={`${point} 1x, ${point2x} 2x`} className="myRanking__img" />
                        {printNumber(fanPoint)}
                      </p>
                    </>
                  )} */}
                  </div>

                  <div
                    className="myRanking__content"
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
                    <div className="thumbBox">
                      <img src={profImg.thumb120x120} width="50px" className="thumbBox__pic" />
                    </div>

                    <div className="infoBox">
                      <div className="nickNameBox">
                        {nickNm}
                        <div className="nickNameImg">
                          {/*<img src={korea} srcSet={`${korea} 1x, ${korea2x} 2x`}  className="korea-m"/> */}
                          <span className={genderName}>{gender}</span>
                          {isSpecial === true && <em className="specialDj">스페셜DJ</em>}
                        </div>
                      </div>

                      <div className="countBox">
                        {formState.rankType === 1 && (
                          <>
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
                          </>
                        )}

                        {formState.rankType === 2 && (
                          <>
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
                    </div>
                  </div>

                  {roomNo !== '' && (
                    <div className="liveBox">
                      <img
                        src={live}
                        onClick={() => {
                          RoomJoin({roomNo: roomNo})
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
      </>
    )
  }

  return creatList()
}

export default React.memo(RankList)
