import React, {useContext, useState, useEffect} from 'react'
import Util from 'components/lib/utility.js'

import NoResult from 'components/ui/noResult'
import RankList from './rankList'
import RankListTop from './rankListTop'

import {Context} from 'context'
import Api from 'context/api'

import point from './static/ico-point.png'
import point2x from './static/ico-point@2x.png'
import likeWhite from './static/like_w_s.svg'
import peopleWhite from './static/people_w_s.svg'
import timeWhite from './static/time_w_s.svg'

const dateArray = ['오늘', '전일', '주간']

let moreState = false

export default (props) => {
  let timer

  const context = useContext(Context)
  const {typeState, dateType, setDateType, rankType, list, fetchRank, myInfo, setMyInfo, nextList, setCurrentPage} = props
  const [myProfile, setMyProfile] = useState(false)

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

  return (
    <>
      <div className="todayList">{createDateButton()}</div>
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
            <p className="rankingChange">
              {createMyProfile()}
              {/* <span className={createMyUpDownClass()}>{myInfo.myUpDown}</span> */}
            </p>
          </div>

          <div className="thumbBox thumbBox__profile">
            <img src={myProfile.holder} className="thumbBox__frame" />
            <img src={myProfile.profImg.thumb120x120} className="thumbBox__pic" />
          </div>

          <div className="myRanking__right">
            <div className="myRanking__rightWrap">
              <div className="profileItme">
                {/* <p className={createMyLevelClass()}>
            Lv<strong>{myProfile.level}</strong>. {myProfile.grade}
          </p> */}
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

                      {/* <span className="countBox__item">
                      <img src={moonWhite} />
                      {Util.printNumber(myInfo.myGiftPoint)}
                    </span> */}

                      {/* <span className="countBox__item">
                      <img src={moonWhite} />
                      {Util.printNumber(myProfile.dalCnt)}
                    </span> */}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {creatResult()}
    </>
  )
}
