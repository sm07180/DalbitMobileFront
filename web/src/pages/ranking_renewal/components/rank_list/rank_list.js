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
import live from '../../static/live_m.svg'
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
                isSpecial,
                roomNo,
                memNo,
                starCnt,
                liveBadgeList
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
                      {formState.rankType === 2 && index < 2 && (
                        <div className={`thumbBox__frame ${index === 0 ? 'thumbBox__frame--4rd' : 'thumbBox__frame--5rd'}`} />
                      )}
                      <img src={profImg.thumb120x120} className="thumbBox__pic" />
                    </div>

                    <div className="infoBox">
                      <div className="nickNameBox">
                        {nickNm}
                        <div className="nickNameImg">
                          {genderName !== 'n' && (
                            <div className={`gender-icon ${genderName === 'm' ? 'male' : 'female'}`}>성별</div>
                          )}

                          {liveBadgeList &&
                            liveBadgeList.length !== 0 &&
                            liveBadgeList.map((item, idx) => {
                              return (
                                <React.Fragment key={idx + `badge`}>
                                  {item.icon !== '' ? (
                                    <div
                                      className="badgeIcon topImg"
                                      style={{
                                        background: `linear-gradient(to right, ${item.startColor}, ${item.endColor}`,
                                        marginLeft: '4px'
                                      }}>
                                      <img src={item.icon} style={{height: '16px'}} />
                                      {item.text}
                                    </div>
                                  ) : (
                                    <div
                                      style={{
                                        background: `linear-gradient(to right, ${item.startColor}, ${item.endColor}`,
                                        marginLeft: '4px'
                                      }}
                                      className="badgeIcon text">
                                      {item.text}
                                    </div>
                                  )}
                                </React.Fragment>
                              )
                            })}
                          {isSpecial === true && <em className="specialDj">스페셜DJ</em>}
                        </div>
                      </div>

                      <div className="countBox">
                        {formState.rankType === 1 && (
                          <>
                            <span className="countBox__item">
                              <i className="icon icon--people">사람 아이콘</i>
                              {printNumber(listenerPoint)}
                            </span>

                            <span className="countBox__item">
                              <i className="icon icon--like">회색 하트 아이콘</i>
                              {printNumber(goodPoint)}
                            </span>

                            <span className="countBox__item">
                              <i className="icon icon--time">시계 아이콘</i>
                              {printNumber(broadcastPoint)}
                            </span>
                          </>
                        )}

                        {formState.rankType === 2 && (
                          <>
                            <span className="countBox__item">
                              <i className="icon icon--star">s 스타아이콘</i>
                              {printNumber(starCnt)}
                            </span>
                            <span className="countBox__item">
                              <i className="icon icon--time">시계 아이콘</i>
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
