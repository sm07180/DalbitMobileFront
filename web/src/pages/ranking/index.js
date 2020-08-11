import React, {useContext, useEffect, useState, useCallback, useMemo} from 'react'
import {useHistory} from 'react-router-dom'

import {Context} from 'context'
import Api from 'context/api'

//components
import Layout from 'pages/common/layout'
import RankListWrap from './rankListWrap'
import LevelList from './levelList'
import RankGuide from './guide/rank_guide'
import './ranking.scss'

//statc
import backBtn from './static/ic_back.svg'

const rankArray = ['dj', 'fan', 'level']

const DATE_TYPE = {
  day: 1,
  week: 2,
  month: 3
}

export default (props) => {
  const history = useHistory()

  const [rankType, setRankType] = useState('dj')
  const [dateType, setDateType] = useState(0)
  const [formData, setFormData] = useState({
    rankType: 'dj',
    dateType: DATE_TYPE['day'],
    currentDate: new Date()
  })

  const [levelList, setLevelList] = useState([])
  const [rakingDate, setRakingDate] = useState({
    date: ''
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

  const [popup, setPopup] = useState(false)
  const [rankList, setRankList] = useState([])

  const context = useContext(Context)

  let typeState = props.location.state

  const goBack = () => {
    history.goBack()
  }

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
    if (history.location.search !== '') {
      // const search = history.location.search.split('&')
      // setFormData({
      //   ...formData,
      //   rankType: search[0].split('=')[1] === '1' ? 'dj' : 'fan',
      //   dateType: parseInt(search[1].split('=')[1])
      // })
    }
    window.addEventListener('popstate', popStateEvent)

    return () => {
      window.removeEventListener('popstate', popStateEvent)
    }
  }, [])

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
    if (month < 10) {
      return new Date(`${year}-0${month}-01`)
    } else {
      return new Date(`${year}-${month}-01`)
    }
  }

  const createRankButton = () => {
    return rankArray.map((item, index) => {
      const createDateButtonItem = () => {
        if (item === 'dj') {
          return <>DJ</>
        } else if (item === 'fan') {
          return <>팬</>
        } else if (item === 'level') {
          return <>레벨</>
        }
      }

      return (
        <button
          key={index}
          className={formData.rankType === item ? 'rankTab__btn rankTab__btn--active' : 'rankTab__btn'}
          onClick={() => {
            setFormData({
              rankType: item,
              dateType: DATE_TYPE['day'],
              currentDate: new Date()
            })
          }}>
          {createDateButtonItem()}
        </button>
      )
    })
  }

  const handleEv = (something, value) => {
    let someDate
    switch (something) {
      case 'dateType':
        if (value === DATE_TYPE['week']) {
          someDate = convertMonday()
        } else if (value === DATE_TYPE['day']) {
          someDate = new Date()
        } else {
          someDate = convertMonth()
        }

        setFormData({
          ...formData,
          dateType: value,
          currentDate: someDate
        })
        break
      case 'currentDate':
        someDate = handleDate(value)
        setFormData({
          ...formData,
          currentDate: someDate
        })
        break
      default:
        setFormData({
          ...formData
        })
    }
  }

  const handleDate = (some) => {
    let day1 = formData.currentDate
    let year = day1.getFullYear()
    let month = day1.getMonth() + 1
    let date = day1.getDate()
    if (some === 'back') {
      switch (formData.dateType) {
        case 1:
          return new Date(day1.setDate(day1.getDate() - 1))

        case 2:
          return new Date(day1.setDate(day1.getDate() - 7))
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
    } else {
      switch (formData.dateType) {
        case 1:
          return new Date(day1.setDate(day1.getDate() + 1))
        case 2:
          return new Date(day1.setDate(day1.getDate() + 7))
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

  //가이드에 따른 분기
  // const {title} = props.match.params
  // if (title === 'guide') {
  //   return <RankGuide />
  // }

  const rankCategory = () => {
    const current = formData.currentDate
    let formYear = current.getFullYear()
    let formMonth = current.getMonth() + 1
    let formDate = current.getDate()

    const cDate = new Date()
    let year = cDate.getFullYear()
    let month = cDate.getMonth() + 1
    let date = cDate.getDate()

    if (formData.rankType === 'level') {
      return ''
    } else {
      if (formData.dateType === DATE_TYPE['day']) {
        if (year === formYear && month === formMonth && formDate === date) {
          return '실시간 집계'
        } else {
          return ''
        }
      } else if (formData.dateType === DATE_TYPE['week']) {
        const currentWeek = convertMonday()
        year = currentWeek.getFullYear()
        month = currentWeek.getMonth() + 1
        date = currentWeek.getDate()

        if (year === formYear && month === formMonth && formDate === date) {
          return '실시간 집계'
        } else {
          return ''
        }
      } else {
        if (year === formYear && month === formMonth) {
          return '실시간 집계'
        } else {
          return ''
        }
      }
    }
  }

  const levelListView = () => {
    async function feachLevelList() {
      const {result, data} = await Api.get_level_ranking()
      if (result === 'success') {
        const {list} = data
        setLevelList(list)
      }
    }
    feachLevelList()
  }

  /** About Scroll bottom  */

  const records = 10
  const [page, setPage] = useState(1)
  const [scrollBottom, setScrollBottom] = useState(false)
  const [scrollBottomFinish, setScrollBottomFinish] = useState(false)

  const fetchRank = useCallback(
    async (type, dateType, next) => {
      const month = (() => {
        let month = formData.currentDate.getMonth() + 1
        if (month < 10) {
          month = '0' + month
        }
        return month
      })()

      const date = (() => {
        let date = formData.currentDate.getDate()
        if (date < 10) {
          date = '0' + date
        }
        return date
      })()

      const res = await Api.get_ranking({
        param: {
          rankSlct: formData.rankType === 'dj' ? 1 : 2,
          rankType: formData.dateType,
          rankingDate: `${formData.currentDate.getFullYear()}-${month}-${date}`,
          page,
          records
        }
      })

      if (res.result === 'success' && _.hasIn(res, 'data.list')) {
        const {data} = res

        setMyInfo({
          isReward: res.data.isReward,
          myGiftPoint: res.data.myGiftPoint,
          myListenerPoint: res.data.myListenerPoint,
          myRank: res.data.myRank,
          myUpDown: res.data.myUpDown,
          myBroadPoint: res.data.myBroadPoint,
          myLikePoint: res.data.myLikePoint,
          myPoint: res.data.myPoint,
          myListenPoint: res.data.myListenPoint,
          time: res.data.time
        })

        if (data.list.length < records) {
          setScrollBottomFinish(true)
        }

        return data.list
      } else if (res.result === 'fail') {
        context.action.alert({
          msg: res.message
        })
        return null
      }
    },
    [formData, page]
  )

  const concatRankList = useCallback(async () => {
    const list = await fetchRank()
    if (list !== null) {
      const newList = rankList.concat(list)
      setRankList(newList)
      setScrollBottom(false)
      setPage(page + 1)
    }
  }, [page])

  useEffect(() => {
    concatRankList()
  }, [])

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
          <button className="header__btnBack" onClick={goBack}>
            <img src={backBtn} alt="뒤로가기" />
          </button>
        </div>

        <div>
          <div className="rankTopBox respansiveBox">
            <div className="rankTab">{createRankButton()}</div>
            <div className="rankTopBox__update">{rankType !== 'level' && rankCategory()}</div>
          </div>

          {formData.rankType === 'level' ? (
            <LevelList levelList={levelList} />
          ) : (
            <RankListWrap
              DATE_TYPE={DATE_TYPE}
              rankList={rankList}
              formData={formData}
              handleEv={handleEv}
              tyate={typeState}
              myInfo={myInfo}
              setMyInfo={setMyInfo}
            />
          )}
          {popup && <LayerPopup setPopup={setPopup} dateType={dateType} />}
        </div>
      </div>
    </Layout>
  )
}
