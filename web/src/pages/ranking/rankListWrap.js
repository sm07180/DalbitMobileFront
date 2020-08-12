import React, {useContext, useState, useEffect, useCallback} from 'react'
import {useHistory} from 'react-router-dom'

import {Context} from 'context'
import Api from 'context/api'
import Util from 'components/lib/utility.js'

//components
import NoResult from 'components/ui/noResult'
import RankListComponent from './rankList'
import RankListTop from './rankListTop'
import PopupSuccess from './reward/reward_success_pop'

//static
import point from './static/ico-point.png'
import point2x from './static/ico-point@2x.png'
import likeWhite from './static/like_w_s.svg'
import peopleWhite from './static/people_w_s.svg'
import timeWhite from './static/time_w_s.svg'

const dateArray = ['오늘', '주간', '월간', '연간']

export default (props) => {
  const history = useHistory()
  const globalCtx = useContext(Context)
  const {token} = globalCtx
  const {RANK_TYPE, DATE_TYPE, rankType, dateType, setDateType, rankList, formData, myInfo, handleDate, setMyInfo} = props

  const [dateTitle, setDateTitle] = useState({
    header: '오늘',
    date: ''
  })
  const [myProfile, setMyProfile] = useState(false)

  const [rewardPop, setRewardPop] = useState({
    text: '',
    rewardDal: 0
  })
  const [popup, setPopup] = useState(false)

  const createDateButton = useCallback(() => {
    const DATE_TYPE_LIST = Object.keys(DATE_TYPE).map((type) => DATE_TYPE[type])
    return dateArray.map((text, idx) => {
      return (
        <button
          key={`date-type-${idx}`}
          className={dateType === DATE_TYPE_LIST[idx] ? 'todayList__btn todayList__btn--active' : 'todayList__btn'}
          onClick={() => setDateType(DATE_TYPE_LIST[idx])}>
          {text}
        </button>
      )
    })
  }, [dateType])

  const createMyRank = () => {
    if (token.isLogin) {
      const settingProfileInfo = async (memNo) => {
        const profileInfo = await Api.profile({
          params: {memNo: token.memNo}
        })
        if (profileInfo.result === 'success') {
          setMyProfile(profileInfo.data)
        }
      }
      settingProfileInfo()
    } else {
      return null
    }
  }

  // useEffect(() => {
  //   createMyRank()
  // }, [])

  useEffect(() => {
    formatDate()
  }, [myInfo])

  const createResult = () => {
    if (Array.isArray(rankList) === false) {
      return null
    }
    if (rankList.length === 0) {
      return <NoResult />
    }
    return (
      <>
        <RankListTop list={rankList.slice(0, 3)} formData={formData} myMemNo={myProfile.memNo} />
        <RankListComponent list={rankList.slice(3)} formData={formData} />
      </>
    )
  }

  const createMyProfile = () => {
    const {myUpDown} = myInfo

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
    return <span className={myUpDownName}>{myUpDownValue}</span>
  }

  const rankingReward = (clickState) => {
    async function feachRankingReward() {
      const {result, data} = await Api.get_ranking_reward({
        params: {
          rankSlct: rankType,
          rankType: dateType
        }
      })

      if (result === 'success') {
        if (clickState === 2) {
          setPopup(true)
        }
        setRewardPop(data)
      } else {
        if (clickState === 2) {
          return globalCtx.action.alert({
            msg: `랭킹 보상을 받을 수 있는 \n 기간이 지났습니다.`
          })
        }
        setMyInfo({...myInfo, isReward: false})
      }
    }
    feachRankingReward()
  }

  const formatDate = () => {
    const formDt = formData.currentDate
    let formYear = formDt.getFullYear()
    let formMonth = formDt.getMonth() + 1
    let formDate = formDt.getDate()

    const cDate = new Date()
    let year = cDate.getFullYear()
    let month = cDate.getMonth() + 1
    let date = cDate.getDate()

    if (dateType === DATE_TYPE.DAY) {
      if (year === formYear && month === formMonth && formDate === date) {
        setDateTitle({
          header: '오늘',
          date: ''
        })
      } else if (year === formYear && month === formMonth && formDate === date - 1) {
        setDateTitle({
          header: '어제',
          date: ''
        })
      } else {
        setDateTitle({
          header: '일간 순위',
          date: `${formYear}.${formMonth}.${formDate}`
        })
      }
    } else if (dateType === DATE_TYPE.WEEK) {
      const currentWeek = convertMonday()
      year = currentWeek.getFullYear()
      month = currentWeek.getMonth() + 1
      date = currentWeek.getDate()

      const week = convertMonday()
      const weekAgo = new Date(week.setDate(week.getDate() - 7))
      let wYear = weekAgo.getFullYear()
      let wMonth = weekAgo.getMonth() + 1
      let wDate = weekAgo.getDate()

      if (year === formYear && month === formMonth && formDate === date) {
        setDateTitle({
          header: '이번주',
          date: ''
        })
      } else if (formYear === wYear && formMonth === wMonth && formDate === wDate) {
        setDateTitle({
          header: '지난주',
          date: ''
        })
      } else {
        const a = new Date(formDt.getTime())
        const b = new Date(a.setDate(a.getDate() + 6))
        const rangeMonth = b.getMonth() + 1
        const rangeDate = b.getDate()
        console.log(myInfo.time)
        setDateTitle({
          header: '주간 순위',
          date: myInfo.time
        })
      }
    } else if (dateType === DATE_TYPE.MONTH) {
      if (year === formYear && month === formMonth) {
        setDateTitle({
          header: '이번달',
          date: ''
        })
      } else if (year === formYear && month - 1 === formMonth) {
        setDateTitle({
          header: '지난달',
          date: ''
        })
      } else {
        setDateTitle({
          header: '월간 순위',
          date: `${formYear}.${formMonth}`
        })
      }
    } else {
      setDateTitle({
        header: `${formYear}년`,
        date: ''
      })
    }
  }

  return (
    <>
      <div className="todayList">{createDateButton()}</div>

      <div className="detailView">
        <button className={`prevButton`} onClick={() => {}}>
          이전
        </button>

        <div className="title">
          <div className="titleWrap">
            {dateTitle.header}
            <img
              src="https://image.dalbitlive.com/images/api/20200806/benefit.png"
              alt="benefit"
              className="benefitSize"
              onClick={() => {}}
            />
          </div>
          <span>{dateTitle.date}</span>
        </div>

        <button className={`nextButton`} onClick={() => {}}>
          다음
        </button>
      </div>

      {myInfo.isReward ? (
        <>
          <div>
            <div className="rewordBox">
              <p className="rewordBox__top">
                {dateType === DATE_TYPE.DAY ? '일간' : '주간'} {rankType === RANK_TYPE.DJ ? 'DJ' : '팬'} 랭킹 {myInfo.rewardRank}
                위 <span>축하합니다</span>
              </p>

              <div className="rewordBox__character1"></div>
              <div className="rewordBox__character2"></div>
              <button onClick={() => rankingReward(2)} className="rewordBox__btnGet">
                보상 받기
              </button>
            </div>
          </div>

          {popup && (
            <PopupSuccess
              setPopup={setPopup}
              setMyInfo={setMyInfo}
              myInfo={myInfo}
              formData={formData}
              rewardPop={rewardPop}
              setRewardPop={setRewardPop}
            />
          )}
        </>
      ) : (
        <>
          {myProfile && (
            <div className="myRanking myRanking__profile">
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
                  <p className="myRanking__left--now colorWhite">{myInfo.myRank === 0 ? '' : myInfo.myRank}</p>
                  <p className="rankingChange">{createMyProfile()}</p>
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
                        {rankType == RANK_TYPE.DJ && (
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
                        {rankType === RANK_TYPE.FAN && (
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

      {createResult()}
    </>
  )
}
