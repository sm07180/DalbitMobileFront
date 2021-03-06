import React, {useContext, useMemo} from 'react'
import {useHistory} from 'react-router-dom'

import Api from 'context/api'
import {RoomJoin} from 'context/room'
import {OS_TYPE} from 'context/config.js'

import {convertDateToText, printNumber} from 'pages/common/rank/rank_fn'

import {DATE_TYPE, RANK_TYPE} from 'pages/ranking_renewal/constant'

import BadgeList from 'common/badge_list'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage, setGlobalCtxUpdatePopup} from "redux/actions/globalCtx";

function RankList() {
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const dispatch = useDispatch();

  //context
  const history = useHistory()
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
                      if (globalState.token.isLogin) {
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
                      if (globalState.token.isLogin) {
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
                            <em className={`icon_wrap ${gender === 'm' ? 'icon_male' : 'icon_female'}`}>?????? ?????????</em>
                          )}

                          {formState[formState.pageType].dateType === DATE_TYPE.DAY && (
                            <>{liveBadgeList && liveBadgeList.length !== 0 && <BadgeList list={liveBadgeList} />}</>
                          )}
                          {badgeSpecial > 0 && badgeSpecial === 1 ? (
                            <em className="icon_wrap icon_specialdj">?????????DJ</em>
                          ) : badgeSpecial === 2 ? (
                            <em className="icon_wrap icon_bestdj">?????????DJ</em>
                          ) : (
                            <></>
                          )}
                        </div>
                      </div>

                      <div className="countBox">
                        {formState[formState.pageType].rankType === 1 && (
                          <>
                            <span className="countBox__item">
                              <i className="icon icon--people">?????? ?????????</i>
                              {printNumber(listenerPoint)}
                            </span>

                            <span className="countBox__item">
                              <i className="icon icon--like">?????? ?????? ?????????</i>
                              {printNumber(goodPoint)}
                            </span>

                            <span className="countBox__item">
                              <i className="icon icon--time">?????? ?????????</i>
                              {printNumber(broadcastPoint)}
                            </span>
                          </>
                        )}

                        {formState[formState.pageType].rankType === 2 && (
                          <>
                            <span className="countBox__item">
                              <i className="icon icon--star">s ???????????????</i>
                              {printNumber(starCnt)}
                            </span>
                            <span className="countBox__item">
                              <i className="icon icon--time">?????? ?????????</i>
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
                          if (globalState.token.isLogin === false) {
                            dispatch(setGlobalCtxMessage({
                              type:"alert",
                              msg: '?????? ???????????? ??????<br/>???????????? ????????????.',
                              callback: ()=>{
                                history.push('/login')
                              }
                            }))
                          } else {
                            dispatch(setGlobalCtxUpdatePopup({popup:['APPDOWN', 'appDownAlrt', 2]}))
                          }
                        } else {
                          if (roomNo !== '') {
                            RoomJoin({roomNo: roomNo, nickNm: nickNm})
                          } else {
                            let alertMsg
                            if (isNaN(listenRoomNo)) {
                              alertMsg = `${nickNm} ?????? ??????????????? ??????????????????. ?????? ????????? ?????? ?????? ???????????? ????????? ??? ????????????`
                              dispatch(setGlobalCtxMessage({
                                type: 'alert',
                                msg: alertMsg
                              }))
                            } else {
                              alertMsg = `?????? ???????????? ?????? ???????????? ?????????????????????????`
                              dispatch(setGlobalCtxMessage({
                                type: 'confirm',
                                msg: alertMsg,
                                callback: () => {
                                  return RoomJoin({roomNo: listenRoomNo, listener: 'listener'})
                                }
                              }))
                            }
                          }
                        }
                      }}
                      className="liveBox__img">
                      {roomNo !== '' && <em className="icon_wrap icon_live_text_ranking">????????????</em>}
                      {roomNo === '' && listenRoomNo !== '' && <em className="icon_wrap icon_listen_text_ranking">?????????</em>}
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
