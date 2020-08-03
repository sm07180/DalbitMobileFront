import React, {useContext, useState, useEffect} from 'react'

import {Context} from 'context'
import Api from 'context/api'
import Util from 'components/lib/utility.js'

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

const dateArray = ['오늘', '일간', '주간']

let moreState = false

export default (props) => {
  let timer

  const context = useContext(Context)
  const {
    typeState,
    dateType,
    setDateType,
    rankType,
    setRankType,
    list,
    fetchRank,
    myInfo,
    setMyInfo,
    nextList,
    setCurrentPage,
    resetFn
  } = props
  const [myProfile, setMyProfile] = useState(false)
  const [rewardPop, setRewardPop] = useState({
    text: '',
    rewardDal: 0
  })
  const [popup, setPopup] = useState(false)

  const createDateButton = () => {
    return dateArray.map((item, index) => {
      //index++
      return (
        <button
          key={index}
          className={dateType === index ? 'todayList__btn todayList__btn--active' : 'todayList__btn'}
          onClick={() => {
            setCurrentPage()
            setDateType(index)
            fetchRank(rankType, index)
            setMyInfo({
              isReward: false,
              myGiftPoint: 0,
              myListenerPoint: 0,
              myRank: 0,
              myUpDown: '',
              myBroadPoint: 0,
              myLikePoint: 0,
              myPoint: 0,
              myListenPoint: 0,
              time: ''
            })
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
    if (typeState) {
      setRankType(typeState)
      fetchRank(typeState, dateType)
    } else {
      fetchRank(rankType, dateType)
    }

    creatMyRank()
  }, [])

  const creatResult = () => {
    if (list === -1) {
      return null
    } else if (list === 0) {
      return <NoResult />
    } else {
      return (
        <>
          <RankListTop list={list.slice(0, 3)} rankType={rankType} myMemNo={myProfile.memNo} />
          <RankList list={list.slice(3)} rankType={rankType} />
        </>
      )
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

  useEffect(() => {
    //reload
    window.addEventListener('scroll', scrollEvtHdr)
    return () => {
      window.removeEventListener('scroll', scrollEvtHdr)
    }
  }, [nextList])

  useEffect(() => {
    window.removeEventListener('scroll', scrollEvent)
    window.addEventListener('scroll', scrollEvent)
    return () => {
      window.removeEventListener('scroll', scrollEvent)
    }
  }, [context.logoChange])

  //checkScroll
  const scrollEvtHdr = (event) => {
    if (timer) window.clearTimeout(timer)
    timer = window.setTimeout(function () {
      //스크롤
      const windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight
      const body = document.body
      const html = document.documentElement
      const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)
      const windowBottom = windowHeight + window.pageYOffset
      //스크롤이벤트체크
      /*
       * @가속처리
       */
      if (moreState && windowBottom >= docHeight - 400) {
        showMoreList()
      } else {
      }
    }, 10)
  }

  const showMoreList = () => {
    setList(list.concat(nextList))
    fetchRank(rankType, dateType, 'next')
  }

  const scrollEvent = () => {
    const headerHeight = 48

    if (window.scrollY >= headerHeight) {
      context.action.updateLogoChange(true)
    } else if (window.scrollY < headerHeight) {
      context.action.updateLogoChange(false)
    }
  }

  //clickState === 1 :탭 버튼이 변경되었을 경우
  //clickState === 2 :보상받기를 클릭했을 경우
  const rankingReward = (clickState) => {
    if (dateType === 0) return null

    async function feachrankingReward() {
      const {result, data} = await Api.get_ranking_reward({
        params: {
          rankSlct: rankType === 'dj' ? 1 : 2,
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
          return context.action.alert({
            msg: `랭킹 보상을 받을 수 있는 \n 기간이 지났습니다.`
          })
        }
        setMyInfo({...myInfo, isReward: false})
      }
    }
    feachrankingReward()
  }

  useEffect(() => {
    rankingReward(1)
  }, [dateType, rankType])

  useEffect(() => {
    if (!popup) {
      resetFn()
    }
  }, [popup])

  return (
    <>
      <div className="todayList">{createDateButton()}</div>

      <>
        {myProfile && (
          <div
            className="myRanking myRanking__profile"
            onClick={() => {
              window.location.href = `/menu/profile`
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
                    {rankType == 'dj' && (
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
                    {rankType == 'fan' && (
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
        )}
      </>

      {/* {myInfo.isReward ? (
        <>
          <div>
            <div className="rewordBox">
              <p className="rewordBox__top">
                {rewardPop.text} <span>축하합니다</span>
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
              rewardPop={rewardPop}
              setRewardPop={setRewardPop}
              rankType={rankType}
              dateType={dateType}
            />
          )}
        </>
      ) : (
        <>
          {myProfile && (
            <div
              className="myRanking myRanking__profile"
              onClick={() => {
                window.location.href = `/menu/profile`
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
                      {rankType == 'dj' && (
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
                      {rankType == 'fan' && (
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
          )}
        </>
      )} */}

      {creatResult()}
    </>
  )
}
