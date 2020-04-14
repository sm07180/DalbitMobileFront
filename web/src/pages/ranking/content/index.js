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

const rankArray = ['dj', 'fan']
const dateArray = ['전일', '주간', '월간']
let currentPage = 1
let moreState = false

export default props => {
  //---------------------------------------------------------------------
  //let
  let timer
  //context
  const context = useContext(Context)

  //state
  const [rankType, setRankType] = useState('dj')
  const [dateType, setDateType] = useState(1)
  const [list, setList] = useState(-1)
  const [nextList, setNextList] = useState(false)
  //const [moreState, setMoreState] = useState(false)
  const [myRank, setMyRank] = useState('-')

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
    const {profImg, level, nickNm, memNo} = context.profile
    return (
      <div className="my-rank">
        <h3>
          <span>{myRank}</span>
        </h3>
        <Figure url={profImg.thumb120x120} memNo={memNo} link={`/menu/profile`} />
        <div
          onClick={() => {
            window.location.href = `/menu/profile`
          }}>
          <strong>Lv {level}</strong>
          <p>{nickNm}</p>
        </div>
      </div>
    )
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
      if (windowBottom >= docHeight - 30) {
        showMoreList()
      } else {
      }
    }, 50)
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
    fetch(rankType, dateType)
    return () => {
      currentPage = 1
    }
  }, [])

  const creatResult = () => {
    if (list === -1) {
      return null
    } else if (list === 0) {
      return <NoResult />
    } else {
      return <RankList list={list} />
    }
  }

  //---------------------------------------------------------------------
  return (
    <Contents>
      <h2>랭킹</h2>
      <div className="filter">
        <div className="rank-type">{createRankButton()}</div>
        <div className="date-type">{createDateButton()}</div>
      </div>
      {context.profile && creatMyRank()}
      {creatResult()}
      {/* {moreState && (
        <button
          className="more-btn"
          onClick={() => {
            showMoreList()
          }}>
          더보기
        </button>
      )} */}
    </Contents>
  )
}
//---------------------------------------------------------------------

const Contents = styled.div`
  width: 1210px;
  min-height: 300px;
  margin: 64px auto 0 auto;
  padding: 0 0 80px 0;
  h2 {
    padding-bottom: 60px;
    font-size: 28px;
    font-weight: 600;
    color: ${COLOR_MAIN};
    text-align: center;
  }

  /* 상단 filter 버튼들 */
  .filter {
    display: flex;
    justify-content: space-between;
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
    display: flex;
    margin-top: 18px;
    padding: 12px;
    border-radius: 10px;
    background: #f5f5f5;

    & > * {
      flex: 0 0 auto;
    }

    h3 {
      flex-basis: 80px;
      line-height: 80px;
      text-align: center;
      span {
        display: inline-block;
        width: 32px;
        line-height: 32px;
        border-radius: 50%;
        background: #424242;
        color: #fff;
        font-size: 14px;
        font-weight: 800;
        vertical-align: middle;
        transform: skew(-0.03deg);
        z-index: -1;
      }
    }

    div {
      overflow: hidden;
      max-width: calc(100% - 200px);
      padding: 15px 0 13px 0;
      cursor: pointer;
      strong {
        display: inline-block;
        color: ${COLOR_MAIN};
        font-size: 16px;
        font-weight: 800;
        transform: skew(-0.03deg);
      }
      p {
        overflow: hidden;
        width: 100%;
        margin-top: 10px;
        line-height: 24px;
        text-overflow: ellipsis;
        white-space: nowrap;
        transform: skew(-0.03deg);
      }
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
    .my-rank {
      margin-top: 8px;
      padding: 10px 5px;
      h3 {
        flex-basis: 42px;
        height: 65px;
        line-height: 65px;
        background-size: 30px !important;
        span {
          width: 24px;
          line-height: 24px;
          font-size: 10px;
        }
      }

      div {
        max-width: calc(100% - 125px);
        padding: 11px 0 9px 0;
        strong {
          font-size: 14px;
        }
        p {
          margin-top: 2px;
          font-size: 14px;
        }
      }
    }
  }
`
