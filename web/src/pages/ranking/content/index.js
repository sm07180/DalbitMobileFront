/**
 * @file /ranking/content/index.js
 * @brief 랭킹
 */
import React, {useState, useEffect, useContext, useRef} from 'react'
import styled from 'styled-components'

//context
import {Context} from 'context'
import Api from 'context/api'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_TABLET_S, WIDTH_PC_S, WIDTH_TABLET, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
import _ from 'lodash'

//component
import RankList from './rankList'
import Figure from './Figure'
import NoResult from 'components/ui/noResult'
import Header from 'components/ui/header'
import LayerPopup from './layer_popup'

//static
import iconQ from '../static/ic_question.svg'

const rankArray = ['dj', 'fan']
//const dateArray = ['일간', '주간', '월간']
const dateArray = ['일간', '주간']
let currentPage = 1
let moreState = false

export default props => {
  //---------------------------------------------------------------------
  //let
  let timer
  //context
  const context = useContext(Context)

  const typeState = props.location.state

  //state
  const [rankType, setRankType] = useState('dj')
  const [dateType, setDateType] = useState(1)
  const [list, setList] = useState(-1)
  const [nextList, setNextList] = useState(false)
  const [popup, setPopup] = useState(false)
  //const [moreState, setMoreState] = useState(false)
  const [myRank, setMyRank] = useState('-')
  const [myProfile, setMyProfile] = useState(false)

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

  //---------------------------------------------------------------------
  //map
  const createRankButton = () => {
    return rankArray.map((item, index) => {
      return (
        <button
          key={index}
          className={rankType == item ? 'on' : 'off'}
          onClick={() => {
            currentPage = 1
            setRankType(item)
            fetch(item, dateType)
          }}>
          {item == 'dj' ? 'DJ랭킹' : '팬랭킹'}
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
          className={dateType == index ? 'on' : 'off'}
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

  //---------------------------------------------------------------------
  //fetch
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
      if (res.data.list == false) {
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
      setList(list.concat(nextList))
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
  //---------------------------------------------------------------------
  //useEffect
  useEffect(() => {
    //reload
    window.addEventListener('scroll', scrollEvtHdr)
    return () => {
      window.removeEventListener('scroll', scrollEvtHdr)
    }
  }, [nextList])

  useEffect(() => {
    if (typeState) {
      setRankType(typeState)
      fetch(typeState, dateType)
    } else {
      fetch(rankType, dateType)
    }

    creatMyRank()

    window.addEventListener('popstate', popStateEvent)

    return () => {
      currentPage = 1
      window.removeEventListener('popstate', popStateEvent)
    }
  }, [])

  const creatResult = () => {
    if (list === -1) {
      return null
    } else if (list === 0) {
      return <NoResult />
    } else {
      return <RankList list={list} rankType={rankType} />
    }
  }

    //---------------------------------------------------------------------
  return (
    <Contents>
      <Header>
        <div className="category-text">랭킹</div>
      </Header>
      <div className="filter">
        <div className="rank-type">{createRankButton()}</div>
        <div className="date-type">{createDateButton()}</div>
      </div>
      {myProfile && (
        <div className="my-rank">
          <div className="figure-wrap">
            <Figure url={myProfile.profImg.thumb120x120} memNo={myProfile.memNo} link={`/menu/profile`} />
          </div>
          <h3 className="flag">
            <span>{myRank}</span>
          </h3>
          <div className="text">
            <span>
              Lv {myProfile.level} {myProfile.nickNm}
            </span>
          </div>
          <button className="rank-info-btn" onClick={() => setPopup(popup ? false : true)}>
            <img src={iconQ} alt="랭킹 산정 방법" />
          </button>
        </div>
      )}
      {creatResult()}

      {popup && <LayerPopup setPopup={setPopup} dateType={dateType} />}
    </Contents>
  )
}
//---------------------------------------------------------------------

const Contents = styled.div`
  width: 1210px;
  min-height: 300px;
  margin: 0 auto;
  padding: 0 0 80px 0;
  h2 {
    padding-bottom: 60px;
    font-size: 28px;
    font-weight: 600;
    color: ${COLOR_MAIN};
    text-align: center;
  }

  .close-btn {
    position: absolute;
    top: 6px;
    left: 2%;
  }

  /* 상단 filter 버튼들 */
  .filter {
    display: flex;
    justify-content: space-between;
    margin-top: 15px;
    & > div {
      button {
        line-height: 40px;
      }
      &.rank-type button {
        color: #bdbdbd;
        font-size: 20px;
        &.on {
          color: #424242;
          font-weight: 800;
        }
      }
      &.rank-type button + button {
        margin-left: 10px;
      }
      &.date-type button {
        width: 68px;
        border: 1px solid #e5e5e5;
        border-radius: 40px;
        color: #757575;

        &.on {
          border-color: ${COLOR_MAIN};
          color: ${COLOR_MAIN};
        }
      }
      &.date-type button + button {
        margin-left: 6px;
      }
    }
  }

  /* 내 랭킹 */
  .my-rank {
    position: relative;
    margin-top: 66px;
    height: 88px;
    border-radius: 24px;
    background-image: linear-gradient(to right, #632beb, #8556f6);

    .rank-info-btn {
      position: absolute;
      right: 9px;
      top: 3px;
      width: 30px;
      height: 30px;
    }

    .figure-wrap {
      position: relative;
      padding-top: 1px;
      text-align: center;
      figure {
        display: inline-block;
        margin: -42px 0 0 0;
        width: 83px;
        height: 83px;
      }

      figure:after {
        display: block;
        position: absolute;
        left: calc(50% - 51px);
        top: -47px;
        width: 102px;
        height: 94px;
        background: url(${IMG_SERVER}/images/api/r_crown.svg) no-repeat;
        content: '';
      }
    }

    .flag {
      position: relative;
      width: 88px;
      height: 34px;
      margin: -22px auto 0 auto;
      background: url(${IMG_SERVER}/images/api/r_flag.svg) no-repeat;
      text-align: center;
      z-index: 2;
      span {
        display: block;
        margin-top: -5px;
        padding-top: 3px;
        padding-right: 4px;
        font-size: 14px;
        color: #573500;
        font-weight: 600;
        letter-spacing: -0.35px;
      }
    }

    .text {
      padding-top: 2px;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
      text-align: center;
    }
  }

  .more-btn {
    display: block;
    position: relative;
    width: 113px;
    margin: 40px auto;
    padding-right: 28px;
    border: 1px solid #e0e0e0;
    border-radius: 46px;
    color: #616161;
    font-size: 14px;
    line-height: 46px;
    &:after {
      display: block;
      position: absolute;
      right: 24px;
      top: 11px;
      width: 12px;
      height: 12px;
      border-left: 2px solid ${COLOR_MAIN};
      border-top: 2px solid ${COLOR_MAIN};
      transform: rotate(-135deg);
      content: '';
    }
  }

  @media (max-width: 1260px) {
    width: 91.11%;
  }

  @media (max-width: ${WIDTH_TABLET_S}) {
    h2 {
      padding-bottom: 16px;
      font-size: 24px;
    }
    .filter {
      & > div {
        button {
          line-height: 26px;
        }
        &.rank-type button {
          font-size: 16px;
        }
        &.date-type button {
          width: 48px;
          font-size: 14px;
        }
      }
    }
  }
`
