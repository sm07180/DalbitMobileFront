import React, {useContext, useEffect, useState, useCallback, useMemo} from 'react'
import {useHistory} from 'react-router-dom'

import {Context} from 'context'
import Api from 'context/api'

//components
import Layout from 'pages/common/layout'
import RankListWrap from './rankListWrap'
import LevelList from './levelList'
import LayerPopup from './layer_popup'
import RankGuide from './guide/rank_guide'
import MyProfile from './components/MyProfile'
import RankDateBtn from './components/ranking_date_btn'
import RankHandleDateBtn from './components/ranking_handle_date_btn'
// constant
import {RANK_TYPE, DATE_TYPE} from './constant'

//statc
import backBtn from './static/ic_back.svg'
import './ranking.scss'
import {MonthSelection} from '@material-ui/pickers/views/Month/MonthView'
import {isCompositeComponent} from 'react-dom/test-utils'

const RANK_TYPE_LIST = Object.keys(RANK_TYPE).map((type) => RANK_TYPE[type])

export default (props) => {
  const history = useHistory()
  const globalCtx = useContext(Context)
  const {profile} = globalCtx

  const [rankType, setRankType] = useState(RANK_TYPE.DJ)
  const [dateType, setDateType] = useState(DATE_TYPE.DAY)
  const [selectedDate, setSelectedDate] = useState(new Date())

  const [popup, setPopup] = useState(false)
  const [rankList, setRankList] = useState([])
  const [levelList, setLevelList] = useState([])
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
        globalCtx.action.alert({
          msg: message
        })
        return null
      }
    },
    [rankType, dateType, selectedDate, page]
  )

  const fetchLevelList = useCallback(async (init = false) => {
    const {result, data, message} = await Api.get_level_ranking({
      params: {
        page: init === true ? 1 : page,
        records
      }
    })

    setFetching(false)

    if (result === 'success' && _.hasIn(data, 'list')) {
      if (data.list.length < records) {
        setScrollBottomFinish(true)
      }

      return data.list
    } else if (result === 'fail') {
      globalCtx.action.alert({
        msg: message
      })
      return null
    }
  }, [])

  const concatRankList = useCallback(async () => {
    if (rankType === RANK_TYPE.LEVEL) {
      const list = await fetchLevelList()
      if (list !== null) {
        const newList = levelList.concat(list)
        setLevelList(newList)
      }
    } else {
      const list = await fetchRankList()
      if (list !== null) {
        const newList = rankList.concat(list)
        setRankList(newList)
      }
    }
    setPage(page + 1)
    setScrollBottom(false)
  }, [rankType, rankList, page, selectedDate])

  const initRankList = useCallback(async () => {
    const list = await fetchRankList(true)
    if (list !== null) {
      setPage(2)
      setRankList(list)
      setScrollBottomFinish(false)
    }
  }, [rankType, dateType, page, selectedDate])

  const initLevelList = useCallback(async () => {
    const list = await fetchLevelList(true)
    if (list !== null) {
      setPage(2)
      setLevelList(list)
      setScrollBottom(false)
    }
  }, [page])

  useEffect(() => {
    if (rankType === RANK_TYPE.LEVEL) {
      initLevelList()
    } else {
      initRankList()
    }
  }, [selectedDate])

  useEffect(() => {
    setSelectedDate(new Date())
  }, [rankType, dateType])

  useEffect(() => {
    if (scrollBottom === true && scrollBottomFinish === false) {
      concatRankList()
    }

    const windowScrollEvent = () => {
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
    <Layout {...props}>
      <div id="ranking-page">
        <div className="header">
          <h1 className="header__title">랭킹</h1>
          <button className="header__btnBack" onClick={() => history.goBack()}>
            <img src={backBtn} alt="뒤로가기" />
          </button>
        </div>

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
                }
              }

              return (
                <button
                  key={`type-${idx}`}
                  className={rankType === rType ? 'rankTab__btn rankTab__btn--active' : 'rankTab__btn'}
                  onClick={() => setRankType(rType)}>
                  {createDateButtonItem()}
                </button>
              )
            })}
          </div>
        </div>

        {rankType === RANK_TYPE.LEVEL && <LevelList levelList={levelList} />}

        {rankType !== RANK_TYPE.LEVEL && fetching === false && (
          <>
            <RankDateBtn dateType={dateType} setDateType={setDateType} />
            <RankHandleDateBtn handleDate={handleDate} selectedDate={selectedDate} dateType={dateType} />
            <MyProfile myInfo={myInfo} rankType={rankType} dateType={dateType} />
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
          </>
        )}

        {popup && <LayerPopup setPopup={setPopup} />}
      </div>
    </Layout>
  )
}
