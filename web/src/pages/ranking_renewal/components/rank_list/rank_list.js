import React, {useContext, useMemo} from 'react'
import {useHistory} from 'react-router-dom'

import Api from 'context/api'
import {RoomJoin} from 'context/room'
import {OS_TYPE} from 'context/config.js'

import {convertDateToText, printNumber} from 'pages/common/rank/rank_fn'

// context
import {Context} from 'context'
import {DATE_TYPE, RANK_TYPE} from 'pages/ranking_renewal/constant'

import BadgeList from 'common/badge_list'
import {useSelector} from "react-redux";

function RankList() {
  //context
  const history = useHistory()
  const context = useContext(Context)
  const rankState = useSelector(({rankCtx}) => rankCtx);
  const customHeader = JSON.parse(Api.customHeader)

  const {rankList, formState} = rankState

  const sliceStart = useMemo(() => {
    if (formState[formState.pageType].rankType === RANK_TYPE.DJ || formState[formState.pageType].rankType === RANK_TYPE.FAN) {
      return 3
    } else {
      return 0
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
                badgeSpecial,
                roomNo,
                listenRoomNo,
                memNo,
                starCnt,
                liveBadgeList
              } = item
              return (
                <div className="myRanking rankingList" key={index}>
                  {/* {realTimeCheck ? (
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
                  ) : ( */}
                  <div
                    className="myRanking__rank"
                    onClick={() => {
                      if (context.token.isLogin) {
                        history.push(`/profile/${memNo}`)
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
                  {/* )} */}

                  <div
                    className="myRanking__content"
                    onClick={() => {
                      if (context.token.isLogin) {
                        history.push(`/profile/${memNo}`)
                      } else {
                        history.push(`/login`)
                      }
                    }}>
                    <div className="thumbBox">
                      {formState[formState.pageType].rankType === 2 && index < 2 && <div className="thumbBox__frame" />}
                      <img src={profImg.thumb292x292} className="thumbBox__pic" />
                    </div>

                    <div className="infoBox">
                      <div className="nickNameBox">
                        {nickNm}
                        <div className="nickNameImg">
                          {gender !== '' && (
                            <em className={`icon_wrap ${gender === 'm' ? 'icon_male' : 'icon_female'}`}>성별 아이콘</em>
                          )}

                          {formState[formState.pageType].dateType === DATE_TYPE.DAY && (
                            <>{liveBadgeList && liveBadgeList.length !== 0 && <BadgeList list={liveBadgeList} />}</>
                          )}
                          {badgeSpecial > 0 && badgeSpecial === 1 ? (
                            <em className="icon_wrap icon_specialdj">스페셜DJ</em>
                          ) : badgeSpecial === 2 ? (
                            <em className="icon_wrap icon_bestdj">베스트DJ</em>
                          ) : (
                            <></>
                          )}
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
                            RoomJoin({roomNo: roomNo, nickNm: nickNm})
                          } else {
                            let alertMsg
                            if (isNaN(listenRoomNo)) {
                              alertMsg = `${nickNm} 님이 어딘가에서 청취중입니다. 위치 공개를 원치 않아 해당방에 입장할 수 없습니다`
                              context.action.alert({
                                type: 'alert',
                                msg: alertMsg
                              })
                            } else {
                              alertMsg = `해당 청취자가 있는 방송으로 입장하시겠습니까?`
                              context.action.confirm({
                                type: 'confirm',
                                msg: alertMsg,
                                callback: () => {
                                  return RoomJoin({roomNo: listenRoomNo, listener: 'listener'})
                                }
                              })
                            }
                          }
                        }
                      }}
                      className="liveBox__img">
                      {roomNo !== '' && <em className="icon_wrap icon_live_text_ranking">라이브중</em>}
                      {roomNo === '' && listenRoomNo !== '' && <em className="icon_wrap icon_listen_text_ranking">청취중</em>}
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
