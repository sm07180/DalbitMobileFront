import React, {useContext, useState, useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import Lottie from 'react-lottie'

import {Context} from 'context'
import Api from 'context/api'
import Util from 'components/lib/utility.js'
import Utility, {dateFormatter} from 'components/lib/utility'
import moment from 'moment'
//components
import NoResult from 'components/ui/noResult'
import RankList from './rankList'
import RankListTop from './rankListTop'
import PopupSuccess from './reward/reward_success_pop'

//static
import point from './static/ico-point.png'
import point2x from './static/ico-point@2x.png'
import likeWhite from './static/like_w_s.svg'
import peopleWhite from './static/people_w_s.svg'
import timeWhite from './static/time_w_s.svg'

// const dateArray = ['오늘', '주간', '월간']
const dateArray = ['오늘', '주간', '월간']

let moreState = false

export default (props) => {
  let timer
  const history = useHistory()
  const context = useContext(Context)
  const {list, formData, handleEv, myInfo, setMyInfo, nextList, setCurrentPage} = props
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
  const [test, setTest] = useState(false)

  const createDateButton = () => {
    return dateArray.map((item, index) => {
      //index++
      return (
        <button
          key={index}
          className={formData.dateType === index + 1 ? 'todayList__btn todayList__btn--active' : 'todayList__btn'}
          onClick={() => {
            handleEv('dateType', index + 1)
            // setMyInfo({
            //   isReward: false,
            //   myGiftPoint: 0,
            //   myListenerPoint: 0,
            //   myRank: 0,
            //   myUpDown: '',
            //   myBroadPoint: 0,
            //   myLikePoint: 0,
            //   myPoint: 0,
            //   myListenPoint: 0,
            //   time: ''
            // })
          }}>
          {item}
        </button>
      )
    })
  }

  const creatMyRank = () => {
    if (context.token.isLogin) {
      const settingProfileInfo = async (memNo) => {
        const profileInfo = await Api.profile({
          params: {memNo: context.token.memNo}
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

  useEffect(() => {
    creatMyRank()
  }, [])

  useEffect(() => {
    formatDate()
  }, [myInfo])

  const creatResult = () => {
    if (list === -1) {
      return null
    } else if (list === 0) {
      return <NoResult />
    } else {
      return (
        <>
          <RankListTop list={list.slice(0, 3)} formData={formData} myMemNo={myProfile.memNo} />
          <RankList list={list.slice(3)} formData={formData} />
        </>
      )
    }
  }

  const handleTest = () => {
    let cy = formData.currentDate.getFullYear()
    let cm = formData.currentDate.getMonth() + 1
    let cd = formData.currentDate.getDate()
    if (formData.dateType === 1) {
      const cDt = new Date()

      let ye = cDt.getFullYear()
      let yM = cDt.getMonth() + 1
      let yd = cDt.getDate()

      if (cy === ye && cm === yM && cd === yd) {
        return false
      } else {
        return true
      }
    } else if (formData.dateType === 2) {
      const cDt = convertMonday()
      let ye = cDt.getFullYear()
      let yM = cDt.getMonth() + 1
      let yd = cDt.getDate()

      if (cy === ye && cm === yM && cd === yd) {
        return false
      } else {
        return true
      }
    } else {
      const cDt = convertMonth()
      let ye = cDt.getFullYear()
      let yM = cDt.getMonth() + 1
      let yd = cDt.getDate()

      if (cy === ye && cm === yM) {
        return false
      } else {
        return true
      }
    }
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

  //clickState === 1 :탭 버튼이 변경되었을 경우
  //clickState === 2 :보상받기를 클릭했을 경우
  const rankingReward = (clickState) => {
    if (formData.dateType === 0) return null

    async function feachrankingReward() {
      const {result, data} = await Api.get_ranking_reward({
        params: {
          rankSlct: formData.rankType === 'dj' ? 1 : 2,
          rankType: formData.dateType
        }
      })

      if (result === 'success') {
        if (clickState === 2) {
          setPopup(true)
        }
        setRewardPop(data)
      } else {
        if (clickState === 2) {
          return context.action.alert({
            msg: `랭킹 보상을 받을 수 있는 \n 기간이 지났습니다.`
          })
        }
        setMyInfo({...myInfo, isReward: false})
      }
    }
    feachrankingReward()
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

    if (formData.dateType === 1) {
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
    } else if (formData.dateType === 2) {
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
    } else {
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
    }
  }

  const convertMonday = () => {
    let toDay = new Date()
    const day = toDay.getDay()
    let c = 0

    if (day === 0) {
      c = 1
    } else if (day === 1) {
      c = 0
    } else {
      c = 1 - day
    }
    toDay.setDate(toDay.getDate() + c)
    return toDay
  }

  const convertMonth = () => {
    let today = new Date()

    const year = today.getFullYear()
    const month = today.getMonth() + 1

    return new Date(`${year}-0${month}-01`)
  }

  // useEffect(() => {
  //   if (myInfo.isReward) {
  //     if (popup) rankingReward()
  //   }
  // }, [formData])

  const handlePrevLast = () => {
    let cy = formData.currentDate.getFullYear()
    let cm = formData.currentDate.getMonth() + 1
    let cd = formData.currentDate.getDate()
    if (formData.dateType === 1) {
      const cDt = new Date('2020-07-01')

      let ye = cDt.getFullYear()
      let yM = cDt.getMonth() + 1
      let yd = cDt.getDate()

      if (cy === ye && cm === yM && cd === yd) {
        return false
      } else {
        return true
      }
    } else if (formData.dateType === 2) {
      const cDt = new Date('2020-07-06')
      let ye = cDt.getFullYear()
      let yM = cDt.getMonth() + 1
      let yd = cDt.getDate()

      if (cy === ye && cm === yM && cd === yd) {
        return false
      } else {
        return true
      }
    } else {
      const cDt = new Date('2020-07-01')
      let ye = cDt.getFullYear()
      let yM = cDt.getMonth() + 1
      let yd = cDt.getDate()

      if (cy === ye && cm === yM) {
        return false
      } else {
        return true
      }
    }
  }

  useEffect(() => {
    if (!popup) {
      handleEv('')
    }
  }, [popup])

  return (
    <>
      <div className="todayList">{createDateButton()}</div>

      <div className="detaillView">
        <button
          className={`prevButton ${handlePrevLast() && 'active'}`}
          onClick={() => {
            if (handlePrevLast()) {
              handleEv('currentDate', 'back')
            }
          }}>
          이전
        </button>

        <div className="title">
          <div className="titleWrap">
            {dateTitle.header}
            <img src="https://image.dalbitlive.com/images/api/20200806/benefit.png" className="benefitSize" />
          </div>
          <span>{dateTitle.date}</span>
        </div>

        <button
          className={`nextButton ${handleTest() && 'active'}`}
          onClick={() => {
            if (handleTest()) {
              handleEv('currentDate', 'front')
            }
          }}>
          다음
        </button>
      </div>

      {myInfo.isReward ? (
        <>
          <div>
            <div className="rewordBox">
              <p className="rewordBox__top">
                {formData.dateType === 1 ? '일간' : '주간'} DJ 랭킹 {myInfo.myRank}위 <span>축하합니다</span>
              </p>

              <div className="rewordBox__character1"></div>
              <div className="rewordBox__character2"></div>
              <button onClick={() => rankingReward(2)} className="rewordBox__btnGet">
                보상 받기
              </button>
            </div>
          </div>

          {popup && <PopupSuccess setPopup={setPopup} formData={formData} rewardPop={rewardPop} setRewardPop={setRewardPop} />}
        </>
      ) : (
        <>
          {myProfile && (
            <div className="myRanking myRanking__profile">
              {/* <Lottie
                width={420}
                height={130}
                options={{
                  loop: true,
                  autoPlay: true,
                  path: `https://image.dalbitlive.com/ani/lottie/ranking_bg.json`
                }}
              /> */}
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
                        {formData.rankType == 'dj' && (
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
                        {formData.rankType == 'fan' && (
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

      {creatResult()}
    </>
  )
}
