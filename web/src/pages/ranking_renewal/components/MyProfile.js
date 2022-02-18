import React, {useEffect, useState, useCallback, useContext} from 'react'
import {useHistory} from 'react-router-dom'

import Api from 'context/api'
import Util from 'components/lib/utility.js'

import {Context} from 'context'
import {RankContext} from 'context/rank_ctx'
import {liveBoxchangeDate, convertDateToText, convertMonday, convertMonth, dateTimeConvert} from 'pages/common/rank/rank_fn'

import {RANK_TYPE, DATE_TYPE} from '../constant'

import PopupSuccess from '../reward/reward_success_pop'

import BadgeList from 'common/badge_list'

import point from '../static/ico-point.png'
import point2x from '../static/ico-point@2x.png'
import likeWhite from '../static/like_g_s.svg'
import peopleWhite from '../static/people_g_s.svg'
import timeWhite from '../static/time_g_s.svg'
import trophyImg from '../static/rankingtop_back@2x.png'
import likeIcon from '../static/like_g_s.svg'
import likeRedIcon from '../static/like_red_m.svg'

export default function MyProfile({rankSettingBtn, setRankSetting, setResetPointPop}) {
  const history = useHistory()
  const global_ctx = useContext(Context)
  const context = useContext(Context)

  const {token} = global_ctx

  const {rankState, rankAction} = useContext(RankContext)

  const {formState, myInfo, rankTimeData, rankData} = rankState
  const setMyInfo = rankAction.setMyInfo

  const [isFixed, setIsFixed] = useState(false)
  const [popup, setPopup] = useState(false)
  const [rewordProfile, setRewordProfile] = useState({
    date: '일간',
    rank: 'DJ'
  })
  const [rewardPop, setRewardPop] = useState({
    text: '',
    rewardDal: 0
  })
  const [myProfile, setMyProfile] = useState(false)

  const rankingReward = () => {
    async function feachRankingReward() {
      const {result, data} = await Api.get_ranking_reward({
        params: {
          rankSlct: formState[formState.pageType].rankType,
          rankType: formState[formState.pageType].dateType
        }
      })

      if (result === 'success') {
        setPopup(true)
        setRewardPop(data)
      } else {
        setMyInfo({...myInfo, isReward: false})
        return globalCtx.action.alert({
          msg: `랭킹 보상을 받을 수 있는 \n 기간이 지났습니다.`
        })
      }
    }
    feachRankingReward()
  }

  const createMyProfile = useCallback(() => {
    const {myUpDown} = myInfo

    if (
      ((formState[formState.pageType].dateType === DATE_TYPE.DAY || formState[formState.pageType].dateType === DATE_TYPE.WEEK) &&
        myInfo.myRank > 1000) ||
      (formState[formState.pageType].dateType === DATE_TYPE.MONTH && myInfo.myRank > 2000) ||
      (formState[formState.pageType].dateType === DATE_TYPE.YEAR && myInfo.myRank > 3000) ||
      (formState[formState.pageType].rankType === RANK_TYPE.LIKE && myInfo.myRank > 201)
    ) {
      return (
        <>
          <p className="myRanking__rank--text">
            순위
            <br />
            없음
          </p>
          <p className="rankingChange">
            <span></span>
          </p>
        </>
      )
    }

    let myUpDownName,
      myUpDownValue = ''
    if (myUpDown[0] === '+') {
      myUpDownName = `rankingChange__up rankingChange__up--profile`
      myUpDownValue = myUpDown.split('+')[1]
    } else if (myUpDown[0] === '-' && myUpDown.length > 1) {
      myUpDownName = `rankingChange__down rankingChange__down--profile`
      myUpDownValue = myUpDown.split('-')[1]
    } else if (myUpDown === 'new') {
      myUpDownName = `rankingChange__new`
      myUpDownValue = 'new'
    } else {
      myUpDownName = `rankingChange__stop`
    }
    return (
      <>
        <p className={`${myInfo.myRank === 0 ? 'myRanking__rank--text' : 'myRanking__rank--now'}`}>
          {myInfo.myRank === 0 ? '순위\n없음' : myInfo.myRank}
        </p>
        {myInfo.myRank !== 0 && (
          <p className="rankingChange">
            <span className={myUpDownName}>{myUpDownValue}</span>
          </p>
        )}
      </>
    )
  }, [myInfo])

  const rankPointWrap = useCallback(() => {
    return (
      <div className="resetPointBox">
        <p>
          <img src="https://image.dalbitlive.com/ranking/ico_timer_wh@2x.png" alt="icon" />
          실시간 팬 랭킹 점수 <span>미 반영 중</span>
        </p>
        <button
          onClick={() => {
            context.action.alert({
              type: 'confirm',
              msg: `지금부터 실시간 팬 랭킹 점수를<br /><span style="display: block; padding-top: 12px; font-size: 22px;  color: #632beb;">반영하시겠습니까?</span>`,
              callback: () => {
                context.action.alert({
                  msg: `지금부터 팬 랭킹 점수가<br />반영됩니다.`,
                  callback: () => {
                    rankSettingBtn(true)
                    setRankSetting(true)
                    rankAction.setRankData &&
                      rankAction.setRankData({
                        ...rankState.rankData,
                        isRankData: true
                      })
                  }
                })
              }
            })
          }}>
          <img src="https://image.dalbitlive.com/ranking/ico_circle_x_g@2x.png" alt="icon" /> 반영하기
        </button>
      </div>
    )
  }, [])

  const rankPointWrapActive = useCallback(() => {
    return (
      <div className="resetPointBox apply">
        <p>
          <img src="https://image.dalbitlive.com/ranking/ico_timer_wh@2x.png" alt="icon" />
          실시간 팬 랭킹 점수 <span>반영 중</span>
        </p>
        <button onClick={() => setResetPointPop(true)}>반영하지 않기</button>
      </div>
    )
  }, [])

  const realTimeNow = useCallback(() => {
    const status = convertDateToText(formState[formState.pageType].dateType, formState[formState.pageType].currentDate, 0)

    if (token.isLogin) {
      if (formState[formState.pageType].rankType === RANK_TYPE.FAN) {
        if (
          (formState[formState.pageType].dateType === DATE_TYPE.TIME && rankTimeData.nextDate === '') ||
          (formState[formState.pageType].dateType === DATE_TYPE.DAY && status) ||
          (formState[formState.pageType].dateType === DATE_TYPE.WEEK && status) ||
          (formState[formState.pageType].dateType === DATE_TYPE.MONTH && status)
        ) {
          if (rankTimeData.isRankData || rankData.isRankData) {
            return rankPointWrapActive()
          } else {
            return rankPointWrap()
          }
        }
      }
    }
    return <></>
  }, [formState, rankTimeData, rankData])

  //------------------------------------------------

  useEffect(() => {
    const createMyRank = () => {
      if (token.isLogin) {
        setMyProfile(global_ctx.profile)
      } else {
        return null
      }
    }
    createMyRank()
  }, [formState])

  return (
    <>
      {myInfo.isReward ? (
        <>
          <div className="rewordBox">
            <p className="rewordBox__top">
              {formState[formState.pageType].dateType === DATE_TYPE.DAY ? '일간' : '주간'}{' '}
              {formState[formState.pageType].rankType === RANK_TYPE.DJ
                ? 'DJ'
                : formState[formState.pageType].rankType === RANK_TYPE.FAN
                ? '팬'
                : '좋아요'}{' '}
              랭킹 {myInfo.rewardRank}위 <span>축하합니다</span>
            </p>

            <div className="rewordBox__character1">
              <img src={trophyImg} width={84} alt="trophy" />
            </div>

            <button onClick={rankingReward} className="rewordBox__btnGet">
              보상
              <br />
              받기
            </button>
          </div>

          {popup && <PopupSuccess setPopup={setPopup} rewardPop={rewardPop} setRewardPop={setRewardPop} />}
        </>
      ) : (
        <>
          {myProfile && (
            // <div className={`myRanking myRanking__profile ${isFixed === true && 'myRanking__profile--fixed'}`}>
            <div className={`myRanking profileBox`}>
              <div className="profileWrap">
                <div className="myRanking__rank">
                  <p
                    className="myRanking__rank--title
                  ">
                    내 랭킹
                  </p>
                  {createMyProfile()}
                </div>

                <div
                  className="thumbBox"
                  onClick={() => {
                    history.push(`/myProfile`)
                  }}>
                  <img src={myProfile.profImg.thumb120x120} className="thumbBox__pic" />
                </div>

                <div className="myRanking__content">
                  <div className="infoBox">
                    {formState[formState.pageType].rankType === RANK_TYPE.LIKE ? (
                      <div className="likeDetailWrap">
                        <div className="likeListDetail">
                          <div className="fanGoodBox">
                            <img src={likeRedIcon} />
                            <span>{myInfo.myGoodPoint && myInfo.myGoodPoint.toLocaleString()}</span>
                          </div>
                          <div className="nickNameBox">{myProfile.nickNm}</div>
                        </div>

                        {/* <div className="countBox">
                      
                    </div> */}
                        <div className="bestFanBox">
                          <span className="bestFanBox__label">심쿵유발자</span>
                          {myInfo.myDjNickNm === '' ? (
                            ''
                          ) : (
                            <>
                              <span
                                className="bestFanBox__nickname"
                                onClick={() => {
                                  if (context.token.isLogin) {
                                    history.push(`/profile/${myInfo.myDjMemNo}`)
                                  } else {
                                    history.push('/modal/login')
                                  }
                                }}>
                                {myInfo.myDjNickNm}
                              </span>
                              <span className="bestFanBox__icon">
                                <img src={likeIcon} />
                                {myInfo.myDjGoodPoint}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="nickNameBox">
                          <p className="nick">{myProfile.nickNm}</p>
                          <div className="nickNameImg">
                            <span className="nickNameImg__level">Lv {myProfile.level}</span>

                            {formState[formState.pageType].dateType === DATE_TYPE.TIME && (
                              <>
                                {myInfo.myLiveBadgeList && myInfo.myLiveBadgeList.length !== 0 && (
                                  <BadgeList list={myInfo.myLiveBadgeList} />
                                )}
                              </>
                            )}
                            {myProfile.badgeSpecial > 0 && myProfile.badgeSpecial === 2 ? (
                              <em className="icon_wrap icon_bestdj">베스트DJ</em>
                            ) : myProfile.badgeSpecial === 1 ? (
                              <em className="icon_wrap icon_specialdj">스페셜DJ</em>
                            ) : (
                              <></>
                            )}
                          </div>
                        </div>

                        <div className="countBox countBox--profile">
                          {formState[formState.pageType].rankType == RANK_TYPE.DJ && (
                            <>
                              <div className="countBox__block">
                                <span className="countBox__item">
                                  <img src={point} srcSet={`${point} 1x, ${point2x} 2x`} />
                                  {Util.printNumber(myInfo.myPoint)}
                                </span>
                                <span className="countBox__item">
                                  <img src={peopleWhite} />
                                  {Util.printNumber(myInfo.myListenerPoint)}
                                </span>
                                <span className="countBox__item">
                                  <img src={likeWhite} className="icon__white" />
                                  {Util.printNumber(myInfo.myLikePoint)}
                                </span>

                                <span className="countBox__item">
                                  <img src={timeWhite} className="icon__white" />
                                  {Util.printNumber(myInfo.myBroadPoint)}
                                </span>
                              </div>
                            </>
                          )}
                          {formState[formState.pageType].rankType === RANK_TYPE.FAN && (
                            <>
                              <div className="countBox__block">
                                <span className="countBox__item">
                                  <img src={point} srcSet={`${point} 1x, ${point2x} 2x`} />
                                  {Util.printNumber(myInfo.myPoint)}
                                </span>

                                <span className="countBox__item">
                                  <img src={timeWhite} />
                                  {Util.printNumber(myInfo.myListenPoint)}
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      {realTimeNow()}
      {/* {resetPointPop && (
        <ResetPointPop setResetPointPop={setResetPointPop} rankSettingBtn={rankSettingBtn} setRankSetting={setRankSetting} />
      )} */}
    </>
  )
}
