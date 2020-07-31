import React, {useContext, useEffect, useState} from 'react'
import qs from 'query-string'
//context
import {Context} from 'context'
import Api from 'context/api'
//components
import Layout from 'pages/common/layout'

import RankListWrap from './rankListWrap'
import LevelList from './levelList'
import RankGuide from './guide/rank_guide'

//state
import './ranking.scss'
import hint from './static/hint.svg'
import closeBtn from './static/ic_back.svg'

const rankArray = ['dj', 'fan', 'level']

let moreState = false

export default (props) => {
  let currentPage = 1
  const [rankType, setRankType] = useState('dj')
  const [dateType, setDateType] = useState(0)
  const [nextList, setNextList] = useState(false)
  const [levelShowState, setLevelShowState] = useState(false)
  const [levelList, setLevelList] = useState([])

  // const {type, date} = qs.parse(location.search)

  // const [rankType, setRankType] = useState(type === null || type === undefined ? 'dj' : type)
  // const [dateType, setDateType] = useState(date === null || date === undefined ? 0 : Number(date))

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
  const [list, setList] = useState(0)

  const context = useContext(Context)
  const typeState = props.location.state

  const goBack = () => {
    window.history.back()
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
    window.addEventListener('popstate', popStateEvent)

    return () => {
      currentPage = 1
      window.removeEventListener('popstate', popStateEvent)
    }
  }, [])

  const levelListView = () => {
    async function feachLevelList() {
      const {result, data} = await Api.get_level_ranking()
      if (result === 'success') {
        const {list} = data
        setLevelList(list)
      } else {
        console.log('실패')
      }
    }
    feachLevelList()
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
          className={rankType === item ? 'rankTab__btn rankTab__btn--active' : 'rankTab__btn'}
          onClick={() => {
            setRankType(item)

            if (item === 'level') {
              setLevelShowState(true)
              levelListView()
            } else {
              setLevelShowState(false)
              currentPage = 1
              fetchRank(item, dateType)
            }
          }}>
          {createDateButtonItem()}
        </button>
      )
    })
  }

  async function fetchRank(type, dateType, next) {
    let res = ''
    currentPage = next ? ++currentPage : currentPage

    if (currentPage > 10) {
      return
    }
    if (type === 'dj') {
      res = await Api.get_dj_ranking({
        params: {
          rankType: dateType,
          page: currentPage,
          records: 50
        }
      })
    } else if (type === 'fan') {
      res = await Api.get_fan_ranking({
        params: {
          rankType: dateType,
          page: currentPage,
          records: 50
        }
      })
    }

    if (res.result === 'success' && _.hasIn(res, 'data.list')) {
      //조회 결과값 없을경우 res.data.list = [] 으로 넘어옴
      if (res.code === '0') {
        if (!next) setList(0)
        moreState = false
      } else {
        if (next) {
          moreState = true
          setNextList(res.data.list)
        } else {
          setList(res.data.list)
          fetchRank(type, dateType, 'next')
        }

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
      }
    } else if (res.result === 'success') {
    } else {
      context.action.alert({
        msg: res.massage
      })
    }
  }

  const setCurrentPage = () => {
    currentPage = 1
  }

  //가이드에 따른 분기
  const {title} = props.match.params
  if (title === 'guide') return <RankGuide></RankGuide>

  return (
    <>
      <Layout {...props} status="no_gnb">
        <div id="ranking-page">
          <div className="header">
            <h1 className="header__title">랭킹</h1>
            <button className="header__btnBack" onClick={goBack}>
              <img src={closeBtn} alt="뒤로가기" />
            </button>
          </div>

          <div>
            <div className="rankTopBox respansiveBox">
              <div className="rankTab">{createRankButton()}</div>

              <div className="rankTopBox__update">
                {myInfo.time}
                <button onClick={() => props.history.push('/rank/guide')} className="rankTopBox__img">
                  <img src={hint} alt="힌트보기" />
                </button>
              </div>
            </div>

            {levelShowState ? (
              <LevelList levelList={levelList}></LevelList>
            ) : (
              <RankListWrap
                dateType={dateType}
                setDateType={setDateType}
                rankType={rankType}
                setRankType={setRankType}
                list={list}
                typeState={typeState}
                fetchRank={fetchRank}
                myInfo={myInfo}
                setMyInfo={setMyInfo}
                nextList={nextList}
                setCurrentPage={setCurrentPage}></RankListWrap>
            )}

            {popup && <LayerPopup setPopup={setPopup} dateType={dateType} />}
          </div>
        </div>
      </Layout>
    </>
  )
}
