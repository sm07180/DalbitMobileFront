import React, {useState, useEffect, useContext, useRef} from 'react';

import './ranking.scss'
import hint from './static/ico-hint.png'
import Profile from './content/profile'
import RankList from './content/rankList'
import Ranktop  from './content/ranktop'
import LayerPopup from './content/layer_popup'

import {Context} from 'context';
import Api from 'context/api';

const rankArray = ['dj', 'fan']
const dateArray = ['오늘', '일간', '주간', ]
let currentPage = 1
let moreState = false

const index = (props) => {
let timer

const [rankType, setRankType] = useState('dj')
const [dateType, setDateType] = useState(1)
const [myProfile, setMyProfile] = useState([])
const [list, setList] = useState(-1)
const [myRank, setMyRank] = useState('-')
const [nextList, setNextList] = useState(false)
const [rankLists,setRankLists] = useState(-1)
const [popup, setPopup] = useState(false)

const popStateEvent = e => {
  if (e.state === null) {
    setPopup(false)
  } else if (e.state === 'layer') {
    setPopup(true)
  }
}

//
const context = useContext(Context)
const typeState = props.location.state
  async function fetch(type, dateType, next) {
    let res = ''
    currentPage = next ? ++currentPage : currentPage
    if (type == 'dj') {
      res = await Api.get_dj_ranking({
        params: {
          rankType: dateType,
          page: currentPage,
          records: 10
        }

      })
    } else if (type == 'fan') {
      res = await Api.get_fan_ranking({
        params: {
          rankType: dateType,
          page: currentPage,
          records: 10
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
          setRankLists(res.data.list)
          fetch(type, dateType, 'next')
        }
        setMyRank(res.data.myRank == 0 ? '-' : res.data.myRank)
      }
    } else {
      context.action.alert({
        msg: res.massage
      })
    }
  }

  const showMoreList = () => {
    if (moreState) {
      setRankLists(rankLists.concat(nextList))
      fetch(rankType, dateType, 'next')
    }
  }

  //---------------------------------------------------------------------
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


  useEffect(() => {
    //reload
    window.addEventListener('scroll', scrollEvtHdr)
    return () => {
      window.removeEventListener('scroll', scrollEvtHdr)
    }
  }, [nextList])


  const createRankButton = () => {
    return rankArray.map((item, index) => {
     
      return (
        <button href="#"
          key={index}
          className={`rankTab__btn ${rankType == item ? 'rankTab__btn--active' : ''}`}
          onClick={() => {
            currentPage = 1
            setRankType(item)
            fetch(item, dateType)
          }}>
          {item == 'dj' ? 'DJ' : '팬'}
        </button>
      )
    })
  }
  
  const createDateButton = () => {
    return dateArray.map((item, index) => {
      ++index
      return (
        <button
          key={index}
          className={`todayList__btn ${dateType == index ? 'todayList__btn--active' : ''}`}
          onClick={() => {
            currentPage = 1
            setDateType(index)
            fetch(rankType, index)
          }}>
          {item}
        </button>
      )
    })
  }

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
    if (typeState) {
      setRankType(typeState)
      fetch(typeState, dateType)
    } else {
      fetch(rankType, dateType)
    }
    creatMyRank()
    return () => {
      currentPage = 1
    }
  }, [])


  const creatResult = () => {
    if (rankLists === -1) {
      return null
    } else if (rankLists === 0) {
      return <NoResult />
    } else {
      return (
        <>
        <Ranktop rankLists={rankLists.slice(0, 3)} rankType={rankType}/>
      <RankList rankLists={rankLists.slice(3)} rankType={rankType}/>
        </>
      )  
    }
  }
  
  return (
    <>
      <div>
        <div className="rankTopBox respansiveBox">
          <div className="rankTab">
            {createRankButton()}
          </div>

          <div className="rankTopBox__update">
            16:00 
          
            <img src={hint}  onClick={() => setPopup(popup ? false : true)}/>
          </div>
        </div>

        <div className="todayList">
            {createDateButton()}
        </div>

      {myProfile && (
        <Profile
        myProfile={myProfile}
         link={`/menu/profile`}
         />
      )}

        <div className="userRanking">

        {creatResult()}
      
        {/* {creatResult()} */}
        </div>
      </div>

      {popup && <LayerPopup setPopup={setPopup} dateType={dateType} />}

    </>
  )
}

export default index
