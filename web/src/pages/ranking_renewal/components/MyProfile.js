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
import likeWhite from '../static/like_w_s.svg'
import peopleWhite from '../static/people_w_s.svg'
import timeWhite from '../static/time_w_s.svg'

export default function MyProfile() {
  const history = useHistory()
  const global_ctx = useContext(Context)

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
          <p className="myRanking__left--now colorWhite">순위 없음</p>
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
        <p className="myRanking__left--now colorWhite">{myInfo.myRank === 0 ? '순위 없음' : myInfo.myRank}</p>
        {myInfo.myRank === 0 ? (
          ''
        ) : (
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
        // console.log(global_ctx)
        setMyProfile(global_ctx.profile)
        // const settingProfileInfo = async (memNo) => {
        //   const profileInfo = await Api.profile({
        //     params: {memNo: token.memNo}
        //   })
        //   if (profileInfo.result === 'success') {
        //     setMyProfile(profileInfo.data)
        //     console.log('api', profileInfo.data)
        //   }
        // }
        // settingProfileInfo()
      } else {
        return null
      }
    }
    createMyRank()
  }, [])

  return (
    <>
      {myInfo.isReward ? (
        <>
          <div className="rewordBox">
            <p className="rewordBox__top">
              {formState.dateType === DATE_TYPE.DAY ? '일간' : '주간'} {formState.rankType === RANK_TYPE.DJ ? 'DJ' : '팬'} 랭킹{' '}
              {myInfo.rewardRank}위 <span>축하합니다</span>
            </p>

            <div className="rewordBox__character1"></div>
            <div className="rewordBox__character2"></div>
            <button onClick={() => rankingReward(2)} className="rewordBox__btnGet">
              보상 받기
            </button>
          </div>

          {popup && <PopupSuccess setPopup={setPopup} rewardPop={rewardPop} setRewardPop={setRewardPop} />}
        </>
      ) : (
        <>
          {myProfile && (
            // <div className={`myRanking myRanking__profile ${isFixed === true && 'myRanking__profile--fixed'}`}>
            <div className={`myRanking myRanking__profile`}>
              <div
                className="myRanking__profile__wrap"
                onClick={() => {
                  history.push(`/menu/profile`)
                }}>
                <div className="myRanking__left myRanking__left--profile">
                  <p
                    className="myRanking__left--title colorWhite 
                  ">
                    내 랭킹
                  </p>
                  {createMyProfile()}
                </div>

                <div className="thumbBox thumbBox__profile">
                  <img src={myProfile.holder} className="thumbBox__frame" />
                  <img src={myProfile.profImg.thumb120x120} className="thumbBox__pic" />
                </div>

                <div className="myRanking__right">
                  <div className="myRanking__rightWrap">
                    <div className="profileItme">
                      <p className="nickNameBox">{myProfile.nickNm}</p>
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
                            </div>

                            <div className="countBox__block">
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
                    </div>
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

// {myInfo.isReward === true ? (
//   <div>
//     <div className="rewordBox">
//       <p className="rewordBox__top">
//         {rewardProfile.date} {rewardProfile.rank} 랭킹 {myInfo.rewardRank}위 <span>축하합니다</span>
//       </p>

//       <div className="rewordBox__character1"></div>
//       <div className="rewordBox__character2"></div>
//       <button onClick={() => rankingReward()} className="rewordBox__btnGet">
//         보상 받기
//       </button>
//     </div>
//   </div>
// ) : (
//   <>
//     {myProfile && (
//       <div className="myRanking myRanking__profile">
//         <div
//           className="myRanking__profile__wrap"
//           onClick={() => {
//             history.push(`/mypage/${globalState.baseData.memNo}/notice`)
//           }}>
//           <div className="myRanking__left myRanking__left--profile">
//             <p
//               className="myRanking__left--title colorWhite
//             ">
//               내 랭킹
//             </p>
//             <p className="myRanking__left--now colorWhite">{myInfo.myRank === 0 ? '' : myInfo.myRank}</p>
//             {}
//             <p className="rankingChange">{createMyProfile()}</p>
//           </div>

//           <div className="thumbBox thumbBox__profile">
//             <img src={myProfile.holder} className="thumbBox__frame" />
//             <img src={myProfile.profImg.thumb120x120} className="thumbBox__pic" />
//           </div>

//           <div className="myRanking__right">
//             <div className="myRanking__rightWrap">
//               <div className="profileItme">
//                 <p className="nickNameBox">{myProfile.nickNm}</p>
//                 <div className="countBox countBox--profile">
//                   {formState.rankType === 1 && (
//                     <>
//                       <div className="countBox__block">
//                         <span className="countBox__item">
//                           <img src={point} srcSet={`${point} 1x, ${point2x} 2x`} />
//                           {printNumber(myInfo.myPoint)}
//                         </span>

//                         <span className="countBox__item">
//                           <img src={peopleWhite} className="icon__white" />
//                           {printNumber(myInfo.myListenerPoint)}
//                         </span>
//                       </div>

//                       <div className="countBox__block">
//                         <span className="countBox__item">
//                           <img src={likeWhite} className="icon__white" />
//                           {printNumber(myInfo.myLikePoint)}
//                         </span>

//                         <span className="countBox__item">
//                           <img src={timeWhite} className="icon__white" />
//                           {printNumber(myInfo.myBroadPoint)}
//                         </span>
//                       </div>
//                     </>
//                   )}
//                   {formState.rankType === 2 && (
//                     <>
//                       <div className="countBox__block">
//                         <span className="countBox__item">
//                           <img src={point} srcSet={`${point} 1x, ${point2x} 2x`} />
//                           {printNumber(myInfo.myPoint)}
//                         </span>

//                         <span className="countBox__item">
//                           <img src={timeWhite} />
//                           {printNumber(myInfo.myListenPoint)}
//                         </span>
//                       </div>
//                     </>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     )}
//   </>
// )}
