import React, {useCallback, useEffect, useRef, useState} from 'react'
import {useHistory} from 'react-router-dom'
import Api from 'context/api'

//components
import Layout from 'pages/common/layout'
import RankListWrap from './rankListWrap'
import LevelList from './levelList'
import LikeList from './likeList'
import LayerPopup from './layer_popup'
import MyProfile from './components/MyProfile'
import RankDateBtn from './components/ranking_date_btn'
import RankHandleDateBtn from './components/ranking_handle_date_btn'
import Header from 'components/ui/new_header'
// constant
import {DATE_TYPE, RANK_TYPE} from './constant'

//static
import arrowRefreshIcon from './static/ic_arrow_refresh.svg'
import './ranking.scss'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

const RANK_TYPE_LIST = Object.keys(RANK_TYPE).map((type) => RANK_TYPE[type])

let touchStartY = null
let touchEndY = null

// let isFixed = false
export default (props) => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const history = useHistory()
  const {profile, logoChange} = globalState

  const [rankType, setRankType] = useState(RANK_TYPE.DJ)
  const [dateType, setDateType] = useState(DATE_TYPE.DAY)
  const [selectedDate, setSelectedDate] = useState(new Date())

  const [popup, setPopup] = useState(false)
  const [rankList, setRankList] = useState([])
  const [levelList, setLevelList] = useState([])
  const [likeList, setLikeList] = useState([])
  const [fetching, setFetching] = useState(false)

  const [myInfo, setMyInfo] = useState({
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

  const [isFixed, setIsFixed] = useState(false)
  const [reloadInit, setReloadInit] = useState(false)

  const iconWrapRef = useRef()
  const arrowRefreshRef = useRef()
  const fixedWrapRef = useRef()
  const listWrapRef = useRef()
  const refreshDefaultHeight = 49

  const rankTouchStart = useCallback(
    (e) => {
      if (reloadInit === true || window.scrollY !== 0 || rankType === RANK_TYPE.LEVEL || rankType === RANK_TYPE.LIKE) return
      touchStartY = e.touches[0].clientY
    },
    [reloadInit, rankType]
  )

  const rankTouchMove = useCallback(
    (e) => {
      if (reloadInit === true || window.scrollY !== 0 || rankType === RANK_TYPE.LEVEL || rankType === RANK_TYPE.LIKE) return
      const iconWrapNode = iconWrapRef.current
      const refreshIconNode = arrowRefreshRef.current

      touchEndY = e.touches[0].clientY

      const ratio = 3
      const heightDiff = (touchEndY - touchStartY) / ratio

      if (window.scrollY === 0 && typeof heightDiff === 'number' && heightDiff > 10) {
        iconWrapRef.current.style.display = 'block'
        iconWrapNode.style.height = `${refreshDefaultHeight + heightDiff}px`
        refreshIconNode.style.transform = `rotate(${-(heightDiff * ratio)}deg)`
      }
    },
    [reloadInit, rankType]
  )

  const rankTouchEnd = useCallback(
    async (e) => {
      if (reloadInit === true || rankType === RANK_TYPE.LEVEL || rankType === RANK_TYPE.LIKE) return

      const ratio = 3
      const transitionTime = 150
      const iconWrapNode = iconWrapRef.current
      const refreshIconNode = arrowRefreshRef.current

      const heightDiff = (touchEndY - touchStartY) / ratio

      if (heightDiff >= 100) {
        let current_angle = (() => {
          const str_angle = refreshIconNode.style.transform
          let head_slice = str_angle.slice(7)
          let tail_slice = head_slice.slice(0, 4)
          return Number(tail_slice)
        })()

        if (typeof current_angle === 'number') {
          setReloadInit(true)
          iconWrapNode.style.transitionDuration = `${transitionTime}ms`
          iconWrapNode.style.height = `${refreshDefaultHeight}px`

          const loadIntervalId = setInterval(() => {
            if (Math.abs(current_angle) === 360) {
              current_angle = 0
            }
            current_angle += 10
            refreshIconNode.style.transform = `rotate(${current_angle}deg)`
          }, 17)

          if (rankType === RANK_TYPE.DJ || rankType === RANK_TYPE.FAN) {
            await initRankList(true)
          }

          await new Promise((resolve, _) => setTimeout(() => resolve(), 300))
          clearInterval(loadIntervalId)
          setReloadInit(false)
        }
      }
      const promiseSync = () =>
        new Promise((resolve, _) => {
          iconWrapNode.style.transitionDuration = `${transitionTime}ms`
          iconWrapNode.style.height = `${refreshDefaultHeight}px`
          setTimeout(() => resolve(), transitionTime)
        })

      await promiseSync()
      iconWrapNode.style.transitionDuration = '0ms'
      iconWrapNode.style.display = 'none'
      refreshIconNode.style.transform = 'rotate(0)'
      touchStartY = null
      touchEndY = null
    },
    [reloadInit, rankType, dateType]
  )

  /** popup */
  const popStateEvent = (e) => {
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

  useEffect(() => {
    window.addEventListener('popstate', popStateEvent)

    return () => {
      window.removeEventListener('popstate', popStateEvent)
    }
  }, [])

  const handleDate = useCallback(
    (type) => {
      const dateFormatter = (type) => {
        const selected = selectedDate
        const day = selected.getDate()
        const month = selected.getMonth()

        if (type === 'prev') {
          switch (dateType) {
            case DATE_TYPE.DAY:
              return new Date(selected.setDate(day - 1))
            case DATE_TYPE.WEEK:
              return new Date(selected.setDate(day - 7))
            case DATE_TYPE.MONTH:
              return new Date(selected.setMonth(month - 1))
          }
        } else if (type === 'next') {
          switch (dateType) {
            case DATE_TYPE.DAY:
              return new Date(selected.setDate(day + 1))
            case DATE_TYPE.WEEK:
              return new Date(selected.setDate(day + 7))
            case DATE_TYPE.MONTH:
              return new Date(selected.setMonth(month + 1))
          }
        }
      }

      const changedDate = dateFormatter(type)
      setSelectedDate(changedDate)
    },
    [dateType, selectedDate]
  )

  /** About Scroll bottom  */
  const records = 50
  const [page, setPage] = useState(1)
  const [scrollBottom, setScrollBottom] = useState(false)
  const [scrollBottomFinish, setScrollBottomFinish] = useState(false)

  const fetchRankList = useCallback(
    async (init = false) => {
      if (init === true) {
        setFetching(true)
      }

      const year = selectedDate.getFullYear()
      const month = (() => {
        let month = selectedDate.getMonth() + 1
        if (month < 10) {
          month = '0' + month
        }
        return month
      })()
      const date = (() => {
        let date = selectedDate.getDate()
        if (date < 10) {
          date = '0' + date
        }
        return date
      })()

      const {result, data, message} = await Api.get_ranking({
        param: {
          rankSlct: rankType,
          rankType: dateType,
          rankingDate: `${year}-${month}-${date}`,
          page: init === true ? 1 : page,
          records
        }
      })

      setFetching(false)

      if (result === 'success' && _.hasIn(data, 'list')) {
        if (data.list.length > 0)
          setMyInfo({
            isReward: data.isReward,
            myGiftPoint: data.myGiftPoint,
            myListenerPoint: data.myListenerPoint,
            myRank: data.myRank,
            myUpDown: data.myUpDown,
            myBroadPoint: data.myBroadPoint,
            myLikePoint: data.myLikePoint,
            myPoint: data.myPoint,
            myListenPoint: data.myListenPoint,
            time: data.time
          })

        if (data.list.length < records) {
          setScrollBottomFinish(true)
        }

        return data.list
      } else if (result === 'fail') {
        dispatch(setGlobalCtxMessage({
          type: "alert",
          msg: message
        }))
      }
      setScrollBottomFinish(true)
      return null
    },
    [rankType, dateType, selectedDate, page]
  )

  const fetchOtherList = useCallback(
    async (init, url) => {
      if (init === true) {
        setFetching(true)
      }
      const {result, data, message} = await Api.get_ranking_other({
        params: {
          page: init === true ? 1 : page,
          records
        },
        url: url
      })
      setFetching(false)

      if (result === 'success' && _.hasIn(data, 'list')) {
        if (data.list.length < records) {
          setScrollBottomFinish(true)
        }
        return data.list
      } else if (result === 'fail') {
        dispatch(setGlobalCtxMessage({
          type: "alert",
          msg: message
        }))
      }
      setScrollBottomFinish(true)
      return null
    },
    [rankType, dateType, selectedDate, page]
  )

  const concatRankList = useCallback(async () => {
    if (rankType === RANK_TYPE.LEVEL) {
      const list = await fetchOtherList(false, '/rank/level')
      if (list !== null) {
        const newList = levelList.concat(list)

        setLevelList(newList)
      }
    } else if (rankType === RANK_TYPE.LIKE) {
      const list = await fetchOtherList(false, '/rank/good')
      if (list !== null) {
        const newList = likeList.concat(list)

        setLikeList(newList)
      }
    } else {
      const list = await fetchRankList(false)
      if (list !== null) {
        const newList = rankList.concat(list)
        setRankList(newList)
      }
    }

    setPage(page + 1)
    setScrollBottom(false)
  }, [rankType, rankList, levelList, likeList, page, selectedDate])

  const initRankList = useCallback(async () => {
    const list = await fetchRankList(true)
    if (list !== null) {
      setPage(2)
      setRankList(list)
      setScrollBottomFinish(false)
    }
  }, [rankType, dateType, selectedDate])

  const initOtherList = useCallback(async () => {
    const urls = rankType === RANK_TYPE.LEVEL ? '/rank/level' : '/rank/good'
    const list = await fetchOtherList(true, urls)
    if (list !== null) {
      setPage(2)
      setScrollBottomFinish(false)
      if (rankType === RANK_TYPE.LEVEL) {
        setLevelList(list)
      } else {
        setLikeList(list)
      }
    }
  }, [rankType])

  const usePreviousRankType = useCallback(
    (props) => {
      if (props !== rankType) {
        scrollTo(0, 0)
        setRankType(props)
        setDateType(DATE_TYPE.DAY)
      }
    },
    [rankType, dateType]
  )

  useEffect(() => {
    if (rankType === RANK_TYPE.LEVEL || rankType === RANK_TYPE.LIKE) {
      initOtherList()
    } else {
      initRankList()
    }
  }, [selectedDate, rankType])

  useEffect(() => {
    switch (dateType) {
      case DATE_TYPE.DAY:
        setSelectedDate(new Date())
        break
      case DATE_TYPE.WEEK:
        let today = new Date()

        const day = today.getDay()
        let calcNum = 0

        if (day === 0) {
          calcNum = 1
        } else if (day === 1) {
          calcNum = 0
        } else {
          calcNum = 1 - day
        }

        today.setDate(today.getDate() + calcNum)

        setSelectedDate(new Date(today))
        break
      case DATE_TYPE.MONTH:
        let toDay = new Date()
        const year = toDay.getFullYear()
        const month = toDay.getMonth() + 1
        if (month < 10) {
          setSelectedDate(new Date(`${year}-0${month}-01`))
        } else {
          setSelectedDate(new Date(`${year}-${month}-01`))
        }
        break
      case DATE_TYPE.YEAR:
        setSelectedDate(new Date())
    }
  }, [rankType, dateType])

  useEffect(() => {
    if (scrollBottom === true && scrollBottomFinish === false) {
      concatRankList()
    }

    const windowScrollEvent = () => {
      const gnbHeight = 48

      if (window.scrollY >= 48) {
        if (fixedWrapRef.current.classList.length === 0) {
          fixedWrapRef.current.className = 'fixed'
        }
        if (globalState.token.isLogin) {
          if (listWrapRef.current.classList.length === 1) {
            listWrapRef.current.className = 'listFixed more'
          }
        } else {
          if (listWrapRef.current.classList.length === 0) {
            listWrapRef.current.className = 'listFixed'
          }
        }
      } else {
        fixedWrapRef.current.className = ''
        if (globalState.token.isLogin) {
          listWrapRef.current.className = 'more'
        } else {
          listWrapRef.current.className = ''
        }
      }

      if (scrollBottomFinish === true) {
        return
      }

      const diff = document.body.scrollHeight / 3
      if (document.body.scrollHeight <= window.scrollY + window.innerHeight + diff) {
        if (scrollBottom === false) {
          setScrollBottom(true)
        }
      }
    }

    window.addEventListener('scroll', windowScrollEvent)

    return () => {
      window.removeEventListener('scroll', windowScrollEvent)
    }
  }, [scrollBottom, scrollBottomFinish])

  return (
    <Layout status={'no_gnb'}>
      <div id="ranking-page" onTouchStart={rankTouchStart} onTouchMove={rankTouchMove} onTouchEnd={rankTouchEnd}>
        <Header title="랭킹" />
        <div className="refresh-wrap" ref={iconWrapRef}>
          <div className="icon-wrap">
            <img className="arrow-refresh-icon" src={arrowRefreshIcon} ref={arrowRefreshRef} />
          </div>
        </div>
        <div ref={fixedWrapRef}>
          <div className="rankTopBox respansiveBox">
            <div className="rankTab">
              {RANK_TYPE_LIST.map((rType, idx) => {
                const createDateButtonItem = () => {
                  if (rType === RANK_TYPE.DJ) {
                    return 'DJ'
                  } else if (rType === RANK_TYPE.FAN) {
                    return '팬'
                  } else if (rType === RANK_TYPE.LEVEL) {
                    return '레벨'
                  } else if (rType === RANK_TYPE.LIKE) {
                    return '좋아요'
                  }
                }

                return (
                  <button
                    key={`type-${idx}`}
                    className={rankType === rType ? 'rankTab__btn rankTab__btn--active' : 'rankTab__btn'}
                    onClick={() => usePreviousRankType(rType)}>
                    {createDateButtonItem()}
                  </button>
                )
              })}
            </div>
          </div>
          {rankType !== RANK_TYPE.LEVEL && rankType !== RANK_TYPE.LIKE && (
            <>
              <RankDateBtn dateType={dateType} setDateType={setDateType} fetching={fetching} />
              <RankHandleDateBtn handleDate={handleDate} selectedDate={selectedDate} dateType={dateType} fetching={fetching} />
              <MyProfile myInfo={myInfo} rankType={rankType} dateType={dateType} setMyInfo={setMyInfo} />
            </>
          )}
        </div>
        {rankType === RANK_TYPE.LEVEL && <LevelList levelList={levelList} />}
        {rankType === RANK_TYPE.LIKE && <LikeList likeList={likeList} />}
        {rankType !== RANK_TYPE.LEVEL && rankType !== RANK_TYPE.LIKE && (
          <div ref={listWrapRef} className={`${globalState.token.isLogin && 'more'}`}>
            <RankListWrap
              rankType={rankType}
              dateType={dateType}
              rankList={rankList}
              myInfo={myInfo}
              selectedDate={selectedDate}
              setMyInfo={setMyInfo}
              setDateType={setDateType}
              handleDate={handleDate}
            />
          </div>
        )}
        {popup && <LayerPopup setPopup={setPopup} />}
      </div>
    </Layout>
  )
}
