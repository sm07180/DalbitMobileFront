import React, {useContext, useMemo} from 'react'
import {useHistory} from 'react-router-dom'

import Api from 'context/api'
import {RoomJoin} from 'context/room'
import {OS_TYPE} from 'context/config.js'
import {IMG_SERVER} from 'context/config'

import {printNumber, convertDateToText} from '../../lib/common_fn'

// context
import {Context} from 'context'
import {RankContext} from 'context/rank_ctx'

//static
const goldMedalIcon = `${IMG_SERVER}/main/200714/ico-ranking-gold.png`
const silverMedalIcon = `${IMG_SERVER}/main/200714/ico-ranking-silver.png`
const bronzeMedalIcon = `${IMG_SERVER}/main/200714/ico-ranking-bronze.png`
const liveIcon = `${IMG_SERVER}/svg/ico_ranking_live.svg`
const listenIcon = `${IMG_SERVER}/svg/ico_ranking_listen.svg`
import point from '../../static/ico-point.png'
import point2x from '../../static/ico-point@2x.png'
import like from '../../static/like_g_s.svg'
import live from '../../static/live_m.svg'
import people from '../../static/people_g_s.svg'
import time from '../../static/time_g_s.svg'
import StarCountIcon from '../../static/circle_star_s_g.svg'
import {DATE_TYPE} from 'pages/ranking_renewal/constant'

function RankList() {
  //context
  const history = useHistory()
  const context = useContext(Context)
  const {rankState} = useContext(RankContext)
  const customHeader = JSON.parse(Api.customHeader)

  const {rankList, formState} = rankState

  const sliceStart = useMemo(() => {
    if (convertDateToText(formState[formState.pageType].dateType, formState[formState.pageType].currentDate, 0)) {
      return 0
    } else {
      return 3
    }
  }, [formState])

  const realTimeCheck = useMemo(() => {
    if (convertDateToText(formState[formState.pageType].dateType, formState[formState.pageType].currentDate, 0)) {
      return true
    } else {
      return false
    }
  }, [formState])

  const creatList = () => {
    return (
      <>
        <div className="userRanking bottomList">
          {rankList.length > sliceStart &&
            rankList.slice(sliceStart).map((item, index) => {
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
                listenRoomNo,
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
                  {realTimeCheck ? (
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
                  ) : (
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
                  )}

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
                      {formState[formState.pageType].rankType === 2 && index < 2 && <div className="thumbBox__frame" />}
                      <img src={profImg.thumb120x120} className="thumbBox__pic" />
                    </div>

                    <div className="infoBox">
                      <div className="nickNameBox">
                        {nickNm}
                        <div className="nickNameImg">
                          {gender !== '' && <div className={`gender-icon ${gender === 'm' ? 'male' : 'female'}`}>성별</div>}

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
                        {formState[formState.pageType].rankType === 1 && (
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

                        {formState[formState.pageType].rankType === 2 && (
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

                  <div className="liveBox">
                    <button
                      onClick={() => {
                        if (customHeader['os'] === OS_TYPE['Desktop']) {
                          if (context.token.isLogin === false) {
                            context.action.alert({
                              msg: '해당 서비스를 위해<br/>로그인을 해주세요.',
                              callback: () => {
                                history.push('/login')
                              }
                            })
                          } else {
                            context.action.updatePopup('APPDOWN', 'appDownAlrt', 2)
                          }
                        } else {
                          if (roomNo !== '') {
                            RoomJoin({roomNo: roomNo})
                          } else {
                            context.action.confirm({
                              msg: '해당 청취자가 있는 방송으로 입장하시겠습니까?',
                              callback: () => {
                                return RoomJoin({roomNo: listenRoomNo})
                              }
                            })
                          }
                        }
                      }}
                      className="liveBox__img">
                      {roomNo !== '' && <img src={liveIcon} alt="라이브중" />}
                      {roomNo === '' && listenRoomNo !== '' && <img src={listenIcon} alt="청취중" />}
                    </button>
                  </div>
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
