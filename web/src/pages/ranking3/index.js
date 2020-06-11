import Util from 'components/lib/utility.js'
import NoResult from 'components/ui/noResult'
//context
import {Context} from 'context'
import Api from 'context/api'
import React, {useContext, useEffect, useState} from 'react'
import LayerPopup from './layer_popup'
//state
import './ranking.scss'
import RankList from './rankList'
import RankListTop from './rankListTop'
import hint from './static/hint.svg'
import point from './static/ico-point.png'
import point2x from './static/ico-point@2x.png'
import closeBtn from './static/ic_back.svg'
import like from './static/like_g_s.svg'
import people from './static/people_g_s.svg'
import time from './static/time_g_s.svg'

const rankArray = ['dj', 'fan']
const dateArray = ['오늘', '일간', '주간']
// const dateArray = ['오늘', '일간', '주간', '월간']

let currentPage = 1
let moreState = false

export default props => {
  let timer

  const [myProfile, setMyProfile] = useState(false)
  const [rankType, setRankType] = useState('dj')
  const [nextList, setNextList] = useState(false)
  const [popup, setPopup] = useState(false)
  const [list, setList] = useState(-1)
  const [myInfo, setMyInfo] = useState({
    myLikePoint: 0,
    myBroadPoint: 0,
    myFanPoint: 0,
    myGiftPoint: 0,
    myListenerPoint: 0,
    myPoint: 0,
    myRank: 0,
    myUpDown: ''
  })

  const [dateType, setDateType] = useState(0)
  const [myRank, setMyRank] = useState(false)
  const context = useContext(Context)
  const typeState = props.location.state

  const goBack = () => {
    window.history.back()
  }

  const popStateEvent = e => {
    if (e.state === null) {
      setPopup(false)
    } else if (e.state === 'layer') {
      setPopup(true)
    }
  }

  useEffect(() => {
    if (popup) {
      if (window.location.hash === '') {
        window.history.pushState('layer', '', '/rank/#layer')
      }
    } else if (!popup) {
      if (window.location.hash === '#layer') {
        window.history.back()
      }
    }
  }, [popup])

  const creatMyRank = () => {
    if (context.token.isLogin) {
      const settingProfileInfo = async memNo => {
        const profileInfo = await Api.profile({params: {memNo: context.token.memNo}})
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
    //reload
    // window.addEventListener('scroll', scrollEvtHdr)
    // return () => {
    //   window.removeEventListener('scroll', scrollEvtHdr)
    // }
  }, [nextList])

  useEffect(() => {
    if (typeState) {
      setRankType(typeState)
      fetchRank(typeState, dateType)
    } else {
      fetchRank(rankType, dateType)
    }

    creatMyRank()

    window.addEventListener('popstate', popStateEvent)

    return () => {
      currentPage = 1
      window.removeEventListener('popstate', popStateEvent)
    }
  }, [])

  // useEffect(() => {
  //   fetchRank()
  // }, [])

  const createRankButton = () => {
    return rankArray.map((item, index) => {
      return (
        <button
          key={index}
          className={rankType === item ? 'rankTab__btn rankTab__btn--active' : 'rankTab__btn'}
          onClick={() => {
            currentPage = 1
            setRankType(item)
            fetchRank(item, dateType)
          }}>
          {item === 'dj' ? 'DJ' : '팬'}
        </button>
      )
    })
  }

  const createDateButton = () => {
    return dateArray.map((item, index) => {
      //index++
      return (
        <button
          key={index}
          className={dateType === index ? 'todayList__btn todayList__btn--active' : 'todayList__btn'}
          onClick={() => {
            currentPage = 1
            setDateType(index)
            fetchRank(rankType, index)
            setMyInfo({
              myLikePoint: 0,
              myBroadPoint: 0,
              myFanPoint: 0,
              myGiftPoint: 0,
              myListenerPoint: 0,
              myPoint: 0,
              myRank: 0,
              myUpDown: ''
            })
          }}>
          {item}
        </button>
      )
    })
  }

  console.log(myInfo)
  //checkScroll
  const scrollEvtHdr = event => {
    if (timer) window.clearTimeout(timer)
    timer = window.setTimeout(function() {
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

  async function fetchRank(type, dateType, next) {
    let res = ''
    currentPage = next ? ++currentPage : currentPage

    if (type === 'dj') {
      res = await Api.get_dj_ranking({
        params: {
          rankType: dateType,
          page: currentPage,
          records: 100
        }
      })
    } else if (type === 'fan') {
      res = await Api.get_fan_ranking({
        params: {
          rankType: dateType,
          page: currentPage,
          records: 100
        }
      })
    }

    if (res.result === 'success' && _.hasIn(res, 'data.list')) {
      //조회 결과값 없을경우 res.data.list = [] 으로 넘어옴
      if (res.code === '0') {
        if (!next) setList(0)
        // setMoreState(false)
        moreState = false
      } else {
        if (next) {
          // setMoreState(true)
          moreState = true
          setNextList(res.data.list)
        } else {
          setList(res.data.list)
          fetchRank(type, dateType, 'next')
        }

        setMyInfo({
          myGiftPoint: res.data.myGiftPoint,
          myListenerPoint: res.data.myListenerPoint,
          myPoint: res.data.myPoint,
          myRank: res.data.myRank,
          myLikePoint: res.data.myLikePoint,
          myUpDown: res.data.myUpDown,
          myBroadPoint: res.data.myBroadPoint,
          time: res.data.time
        })
      }
    } else {
      context.action.alert({
        msg: res.massage
      })
    }
  }

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

  const createMyLevelClass = () => {
    const {level} = myProfile
    let levelName
    if (level === 0) {
      levelName = `levelBox levelBox__lv0`
    } else if (level >= 1 && level <= 10) {
      levelName = `levelBox levelBox__lv1`
    } else if (level >= 11 && level <= 20) {
      levelName = `levelBox levelBox__lv2`
    } else if (level >= 21 && level <= 30) {
      levelName = `levelBox levelBox__lv3`
    } else if (level >= 31 && level <= 40) {
      levelName = `levelBox levelBox__lv4`
    } else if (level >= 41 && level <= 50) {
      levelName = `levelBox levelBox__lv5`
    }

    return levelName
  }

  const createMyUpDownClass = () => {
    const {myUpDown} = myInfo

    let myUpDownName

    if (myUpDown[0] === '+') {
      myUpDownName = `rankingChange__up`
    } else if (myUpDown[0] === '-' && myUpDown.length > 1) {
      myUpDownName = `rankingChange__down`
    } else if (myUpDown === 'new') {
      myUpDownName = `rankingChange__new`
    } else {
      myUpDownName = `rankingChange__stop`
    }

    return myUpDownName
  }

  const createMyProfile = () => {
    const {myUpDown} = myInfo
    let myUpDownName,
      myUpDownValue = ''
    if (myUpDown[0] === '+') {
      myUpDownName = `rankingChange__up`
      myUpDownValue = myUpDown.split('+')[1]
    } else if (myUpDown[0] === '-' && myUpDown.length > 1) {
      myUpDownName = `rankingChange__down`
      myUpDownValue = myUpDown.split('-')[1]
    } else if (myUpDown === 'new') {
      myUpDownName = `rankingChange__new`
      myUpDownValue = 'new'
    } else {
      myUpDownName = `rankingChange__stop`
    }
    return <span className={myUpDownName}>{myUpDownValue}</span>
  }

  return (
    <>
      <div className="header">
        <h1 className="header__title">랭킹</h1>
        <img className="header__btnBack" src={closeBtn} onClick={goBack} />
      </div>

      <div>
        <div className="rankTopBox respansiveBox">
          <div className="rankTab">{createRankButton()}</div>

          <div className="rankTopBox__update">
            {myInfo.time}
            <img src={hint} onClick={() => setPopup(popup ? false : true)} className="rankTopBox__img" />
          </div>
        </div>

        <div className="todayList">{createDateButton()}</div>

        {myProfile && (
          <div
            className="myRanking"
            onClick={() => {
              window.location.href = `/menu/profile`
            }}>
            <div className="myRanking__left">
              <p className="myRanking__left--title">내 랭킹</p>
              <p className="myRanking__left--now">
                {myInfo.myRank === 0 ? <span className="rankingChange__stop"></span> : myInfo.myRank}
              </p>
              <p className="rankingChange">
                {createMyProfile()}
                {/* <span className={createMyUpDownClass()}>{myInfo.myUpDown}</span> */}
              </p>
              <p className="myRanking__left--point">
                <img src={point} srcSet={`${point} 1x, ${point2x} 2x`} /> {myInfo.myPoint}
              </p>
            </div>

            <div className="myRanking__right">
              <div className="myRanking__rightWrap">
                <div className="thumbBox">
                  <img src={myProfile.holder} className="thumbBox__frame" />
                  <img src={myProfile.profImg.thumb120x120} className="thumbBox__pic thumbBox__pic" />
                </div>

                <div>
                  <p className={createMyLevelClass()}>
                    Lv<strong>{myProfile.level}</strong>. {myProfile.grade}
                  </p>
                  <p className="nickNameBox">{myProfile.nickNm}</p>
                  <div className="countBox countBox--profile">
                    {rankType == 'dj' && (
                      <>
                        {/* <span className="countBox__item">
                          <img src={star} />
                          {Util.printNumber(myInfo.myGiftPoint)}
                        </span> */}
                        <span className="countBox__item">
                          <img src={people} />
                          {Util.printNumber(myInfo.myListenerPoint)}
                        </span>

                        <span className="countBox__item">
                          <img src={like} />
                          {Util.printNumber(myInfo.myLikePoint)}
                        </span>

                        <span className="countBox__item">
                          <img src={time} />
                          {Util.printNumber(myInfo.myBroadPoint)}
                        </span>
                      </>
                    )}
                    {rankType == 'fan' && (
                      <>
                        {/* <span className="countBox__item">
                          <img src={moon} />
                          {Util.printNumber(myProfile.dalCnt)}
                        </span> */}
                        <span className="countBox__item">
                          <img src={time} />
                          {Util.printNumber(myProfile.listenTotTime)}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {creatResult()}

        {popup && <LayerPopup setPopup={setPopup} dateType={dateType} />}
      </div>
    </>
  )
}
