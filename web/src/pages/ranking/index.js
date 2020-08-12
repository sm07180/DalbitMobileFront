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

//statc
import backBtn from './static/ic_back.svg'
import './ranking.scss'

const RANK_TYPE = {
  DJ: 1,
  FAN: 2,
  LEVEL: 3
}
const DATE_TYPE = {
  DAY: 1,
  WEEK: 2,
  MONTH: 3,
  YEAR: 4
}
const RANK_TYPE_LIST = Object.keys(RANK_TYPE).map((type) => RANK_TYPE[type])

export default (props) => {
  const history = useHistory()
  const context = useContext(Context)

  const [rankType, setRankType] = useState(RANK_TYPE.DJ)
  const [dateType, setDateType] = useState(DATE_TYPE.DAY)
  const [selectedDate, setSelectedDate] = useState(new Date())

  const [popup, setPopup] = useState(false)
  const [rankList, setRankList] = useState([])
  const [levelList, setLevelList] = useState([])
  const [fetching, setFetching] = useState(false)

  const [formData, setFormData] = useState({
    rankType: RANK_TYPE.DJ,
    dateType: DATE_TYPE.DAY,
    currentDate: new Date()
  })
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
        let day = formData.currentDate
        let year = day.getFullYear()
        let month = day.getMonth() + 1

        if (type === 'prev') {
          switch (dateType) {
            case 1:
              return new Date(day.setDate(day.getDate() - 1))

            case 2:
              return new Date(day.setDate(day.getDate() - 7))
            case 3:
              if (month === 1) {
                return new Date(`${year - 1}-12-01`)
              } else {
                month -= 1
                if (month < 10) {
                  month = '0' + month
                }
                return new Date(`${year}-${month}-01`)
              }
          }
        } else if (type === 'next') {
          switch (dateType) {
            case 1:
              return new Date(day.setDate(day.getDate() + 1))
            case 2:
              return new Date(day.setDate(day.getDate() + 7))
            case 3:
              if (month === 12) {
                return new Date(`${year + 1}-01-01`)
              } else {
                month += 1
                if (month < 10) {
                  month = '0' + month
                }
                return new Date(`${year}-${month}-01`)
              }
          }
        }
      }
    },
    [dateType]
  )

  // const levelListView = () => {
  //   async function feachLevelList() {
  //     const {result, data} = await Api.get_level_ranking()
  //     if (result === 'success') {
  //       const {list} = data
  //       setLevelList(list)
  //     }
  //   }
  //   feachLevelList()
  // }

  /** About Scroll bottom  */
  const records = 10
  const [page, setPage] = useState(1)
  const [scrollBottom, setScrollBottom] = useState(false)
  const [scrollBottomFinish, setScrollBottomFinish] = useState(false)

  const fetchRankList = useCallback(
    async (init = false) => {
      setFetching(true)

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

      const {result, data} = await Api.get_ranking({
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
        context.action.alert({
          msg: message
        })
        return null
      }
    },
    [rankType, dateType, selectedDate, page]
  )

  const concatRankList = useCallback(async () => {
    const list = await fetchRankList()
    if (list !== null) {
      const newList = rankList.concat(list)
      setPage(page + 1)
      setRankList(newList)
      setScrollBottom(false)
    }
  }, [page, rankList])

  const initRankList = useCallback(async () => {
    const list = await fetchRankList(true)
    if (list !== null) {
      setRankList(list)
    }
  }, [rankType, dateType])

  useEffect(() => {
    if (rankType !== RANK_TYPE.LEVEL) {
      initRankList()
    }
  }, [rankType, dateType])

  useEffect(() => {
    if (scrollBottom === true && scrollBottomFinish === false) {
      concatRankList()
    }

    const windowScrollEvent = () => {
      if (scrollBottomFinish === true) {
        return
      }

      const diff = 50
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
    <Layout {...props} status="no_gnb">
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
            <MyProfile />
            <RankListWrap
              RANK_TYPE={RANK_TYPE}
              DATE_TYPE={DATE_TYPE}
              rankType={rankType}
              dateType={dateType}
              setDateType={setDateType}
              rankList={rankList}
              formData={formData}
              myInfo={myInfo}
              handleDate={handleDate}
              setMyInfo={setMyInfo}
            />
          </>
        )}

        {popup && <LayerPopup setPopup={setPopup} />}
      </div>
    </Layout>
  )
}
