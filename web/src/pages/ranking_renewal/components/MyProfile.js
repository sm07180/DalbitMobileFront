import React, {useEffect, useState, useCallback, useContext} from 'react'
import {useHistory} from 'react-router-dom'

import Api from 'context/api'
import Util from 'components/lib/utility.js'

import {Context} from 'context'
import {RankContext} from 'context/rank_ctx'

import {RANK_TYPE, DATE_TYPE} from '../constant'

import PopupSuccess from '../reward/reward_success_pop'

import point from '../static/ico-point.png'
import point2x from '../static/ico-point@2x.png'
import likeWhite from '../static/like_g_s.svg'
import peopleWhite from '../static/people_g_s.svg'
import timeWhite from '../static/time_g_s.svg'
import trophyImg from '../static/rankingtop_back@2x.png'
import likeIcon from '../static/like_g_s.svg'
import likeRedIcon from '../static/like_red_m.svg'

export default function MyProfile() {
  const history = useHistory()
  const global_ctx = useContext(Context)
  const context = useContext(Context)

  const {token} = global_ctx

  const {rankState, rankAction} = useContext(RankContext)

  const {formState, myInfo} = rankState
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
          rankSlct: formState.rankType,
          rankType: formState.dateType
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
      ((formState.dateType === DATE_TYPE.DAY || formState.dateType === DATE_TYPE.WEEK) && myInfo.myRank > 1000) ||
      (formState.dateType === DATE_TYPE.MONTH && myInfo.myRank > 2000) ||
      (formState.dateType === DATE_TYPE.YEAR && myInfo.myRank > 3000)
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

  useEffect(() => {
    const createMyRank = () => {
      if (token.isLogin) {
        setMyProfile(global_ctx.profile)
      } else {
        return null
      }
    }
    createMyRank()
  }, [formState.rankType])

  return (
    <>
      {myInfo.isReward ? (
        <>
          <div className="rewordBox">
            <p className="rewordBox__top">
              {formState.dateType === DATE_TYPE.DAY ? '일간' : '주간'}{' '}
              {formState.rankType === RANK_TYPE.DJ ? 'DJ' : formState.rankType === RANK_TYPE.FAN ? '팬' : '좋아요'} 랭킹{' '}
              {myInfo.rewardRank}위 <span>축하합니다</span>
            </p>

            <div className="rewordBox__character1">
              <img src={trophyImg} width={84} alt="trophy" />
            </div>

            <button onClick={() => rankingReward(2)} className="rewordBox__btnGet">
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
                    history.push(`/menu/profile`)
                  }}>
                  <img src={myProfile.profImg.thumb120x120} className="thumbBox__pic" />
                </div>

                <div className="myRanking__content">
                  <div className="infoBox">
                    {formState.rankType === RANK_TYPE.LIKE ? (
                      <div className="likeDetailWrap">
                        <div className="likeListDetail">
                          <div className="fanGoodBox">
                            <img src={likeRedIcon} />
                            <span>{myInfo.myGoodPoint.toLocaleString()}</span>
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
                                    history.push(`/mypage/${myInfo.myDjMemNo}`)
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

                            {myInfo.myLiveBadgeList &&
                              myInfo.myLiveBadgeList.length !== 0 &&
                              myInfo.myLiveBadgeList.map((item, idx) => {
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

                            {myProfile.isSpecial && <span className="specialDj">스페셜DJ</span>}
                          </div>
                        </div>

                        <div className="countBox countBox--profile">
                          {formState.rankType == RANK_TYPE.DJ && (
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
                          {formState.rankType === RANK_TYPE.FAN && (
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
    </>
  )
}
