import React, {useEffect, useState, useContext} from 'react'
import styled from 'styled-components'
import {useHistory} from 'react-router-dom'
//context
import API from 'context/api'
import {Context} from 'context/index.js'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import Room, {RoomJoin} from 'context/room'
// component
import Header from '../component/header.js'
import SearchBar from './search_bar'
import List from './search-list'
import InitialSearch from './search_start'
import ArrowIcon from '../static/s_arrow.svg'
//flag
let currentPage = 1
let query = ''
let timer
let recordsVar = 3
//let moreState = false
export default (props) => {
  console.log()
  // ctx
  const context = useContext(Context)
  const history = useHistory()
  //State
  const [member, setMember] = useState(null)
  const [nextMember, setNextMember] = useState(null)
  const [live, setLive] = useState(null)
  const [nextLive, setNextLive] = useState(null)
  const [moreState, setMoreState] = useState(false)
  const [moreStateLive, setMoreStateLive] = useState(false)
  const [btnIdx, setBtnIdx] = useState(0)
  const [totalMemCnt, setTotalMemCnt] = useState(0)
  const [totalLiveCnt, setTotalLiveCnt] = useState(0)
  //---------------------------------------------------------------------
  //fetch 사용자검색
  async function fetchMember(query, next) {
    if (query === undefined) return
    if (query.length > 1) {
      currentPage = next ? ++currentPage : 1
      const qs = location.href.split('?')[1] && decodeURIComponent(location.href.split('?')[1].split('=')[1])
      const res = await API.member_search({
        params: {
          search: query || qs,
          page: currentPage,
          records: recordsVar
        }
      })
      if (res.result == 'success' && _.hasIn(res, 'data.list')) {
        if (res.data.list == false) {
          if (!next) {
            setTotalMemCnt(0)
            setMember(false)
          }
          setMoreState(false)
        } else {
          if (next) {
            if (res.data.hasOwnProperty('paging')) {
              setTotalMemCnt(res.data.paging.total)
            }

            setMoreState(true)
            setNextMember(res.data.list)
          } else {
            if (res.data.hasOwnProperty('paging')) {
              setTotalMemCnt(res.data.paging.total)
            }

            setMember(res.data.list)
            fetchMember(query, 'next')
          }
        }
      } else {
        context.action.alert({
          msg: res.message
        })
      }
    } else {
      context.action.alert({
        msg: '검색어를 두 글자 이상 입력해주세요'
      })
    }
  }
  async function fetchLive(query, next) {
    if (query === undefined) return
    if (query.length > 1) {
      currentPage = next ? ++currentPage : 1
      const qs = location.href.split('?')[1] && decodeURIComponent(location.href.split('?')[1].split('=')[1])
      const res = await API.broad_list({
        params: {
          search: query || qs,
          page: currentPage,
          records: 3
        }
      })
      if (res.result == 'success' && _.hasIn(res, 'data.list')) {
        if (res.data.list == false) {
          if (!next) {
            setTotalLiveCnt(0)
            setLive(false)
          }
          setMoreStateLive(false)
        } else {
          if (next) {
            if (res.data.hasOwnProperty('paging')) {
              setTotalLiveCnt(res.data.paging.total)
            }

            setMoreStateLive(true)
            setNextLive(res.data.list)
          } else {
            if (res.data.hasOwnProperty('paging')) {
              setTotalLiveCnt(res.data.paging.total)
            }
            setLive(res.data.list)
            fetchLive(query, 'next')
          }
        }
      } else {
        context.action.alert({
          msg: res.message
        })
      }
    } else {
      context.action.alert({
        msg: '검색어를 두 글자 이상 입력해주세요'
      })
    }
  }

  //update
  function update(mode) {
    switch (true) {
      case mode.search !== undefined: //-------------------------------검색어
        query = mode.search.query
        fetchMember(query)
        fetchLive(query)
        break
      case mode.select !== undefined: //-------------------------------검색결과 아이템선택
        const {roomNo, memNo, type} = mode.select
        //라이브중아님,사용자검색
        if (roomNo !== '' && roomNo !== '0') {
          if (context.adminChecker === true) {
            context.action.confirm_admin({
              //콜백처리
              callback: () => {
                RoomJoin({
                  roomNo: roomNo,
                  shadow: 1
                })
              },
              //캔슬콜백처리
              cancelCallback: () => {
                RoomJoin({
                  roomNo: roomNo,
                  shadow: 0
                })
              },
              msg: '관리자로 입장하시겠습니까?'
            })
          } else {
            RoomJoin({
              roomNo: roomNo
            })
          }
        } else if (roomNo === '0') {
          history.push(`/mypage/${memNo}/`)
        }
        break
      default:
        break
    }
  }
  //useEffect
  useEffect(() => {
    const qs = location.href.split('?')[1] && decodeURIComponent(location.href.split('?')[1].split('=')[1])
    if (qs !== undefined) fetchMember()
    if (qs !== undefined) fetchLive()

    return () => {
      currentPage = 1
    }
  }, [])

  const showMoreList = () => {
    if (query.length > 1 && btnIdx === 2) {
      setMember(member.concat(nextMember))
      fetchMember(query, 'next')
    } else return
  }
  const showMoreListLive = () => {
    if (query.length > 1 && btnIdx === 1) {
      setLive(live.concat(nextLive))
      fetchLive(query, 'next')
    } else return
  }
  useEffect(() => {
    window.addEventListener('scroll', scrollEvtHdr)
    return () => {
      window.removeEventListener('scroll', scrollEvtHdr)
    }
  }, [nextMember, nextLive])
  useEffect(() => {
    if (query !== '' && btnIdx === 2) {
      currentPage = 1
      recordsVar = 20
      fetchMember(query)
    }
    if (query !== '' && btnIdx === 1) {
      currentPage = 1
      recordsVar = 20
      fetchLive(query)
    }
  }, [btnIdx])
  const scrollEvtHdr = (event) => {
    if (timer) window.clearTimeout(timer)
    timer = window.setTimeout(function () {
      //스크롤
      const windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight
      const body = document.body
      const html = document.documentElement
      const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)
      const windowBottom = windowHeight + window.pageYOffset
      if (moreState && windowBottom >= docHeight - 200) {
        showMoreListLive()
        showMoreList()
      } else {
      }
    }, 10)
  }

  //---------------------------------------------------------------------
  useEffect(() => {
    if (query === '') {
      setMoreState(false)
      setMoreStateLive(false)
    }
  }, [query])
  const btnActive = (id) => {
    setBtnIdx(id)
  }

  useEffect(() => {
    if (btnIdx === 0 && query !== '') {
      currentPage = 1
      recordsVar = 3
      fetchMember(query)
      fetchLive(query)
    }
  }, [btnIdx])
  useEffect(() => {
    query = ''
  }, [])
  if (props.location.pathname.split('/')[2] !== 'search') query = ''
  return (
    <Content>
      <Room />
      <Header>
        <div className="category-text">검색</div>
      </Header>
      {/* 검색바 */}
      <div className="searchBarWrapper">
        <SearchBar update={update} />
      </div>
      {(query === '' || (live === null && member === null)) && <InitialSearch />}
      {query !== '' && (
        <div className="searchTab">
          {searchCategory.map((item, idx) => {
            return (
              <button
                key={item.id}
                className={btnIdx === item.id ? 'tabBtn tabBtn--active' : 'tabBtn'}
                onClick={() => btnActive(item.id)}>
                {item.title}
              </button>
            )
          })}
        </div>
      )}

      {/* {live && <h1>라이브 검색</h1>} */}
      {query !== '' && (btnIdx === 0 || btnIdx === 1) && (
        <div className="typeTitle">
          <span className="title">실시간 LIVE</span>
          {totalLiveCnt !== 0 && (
            <div className="more">
              <span className="more__cnt" onClick={() => btnActive(1)}>
                {totalLiveCnt && totalLiveCnt}
              </span>
              <button className="more__btn" onClick={() => btnActive(1)}></button>
            </div>
          )}
        </div>
      )}
      {query !== '' && (btnIdx === 0 || btnIdx === 1) && <List update={update} type="live" fetch={live} />}
      {query !== '' && (btnIdx === 0 || btnIdx === 2) && (
        <div className="typeTitle">
          <span className="title">DJ</span>
          {totalMemCnt !== 0 && (
            <div className="more">
              <span className="more__cnt" onClick={() => btnActive(2)}>
                {totalMemCnt && totalMemCnt}
              </span>
              <button className="more__btn" onClick={() => btnActive(2)}></button>
            </div>
          )}
        </div>
      )}
      {query !== '' && (btnIdx === 0 || btnIdx === 2) && <List update={update} type="member" fetch={member} />}
    </Content>
  )
}
//---------------------------------------------------------------------
const Content = styled.div`
  background-color: #fff;
  height: 100vh;
  .more {
    display: flex;
    align-items: center;
    &__cnt {
      font-size: 18px;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      letter-spacing: -0.36px;
      text-align: left;
      color: #632beb;
    }
    &__btn {
      display: block;
      width: 24px;
      height: 24px;
      background: url(${ArrowIcon});
    }
  }
  .typeTitle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    box-sizing: border-box;
    margin: 20px 0;
    .title {
      font-size: 18px;
      font-weight: 800;
      line-height: 1.17;
      letter-spacing: -0.36px;
      text-align: left;
      color: #000000;
    }
    .cnt {
      font-size: 18px;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      letter-spacing: -0.36px;
      text-align: left;
      color: #632beb;
    }
  }
  h1 {
    display: block;
    margin-bottom: 16px;
    font-size: 16px;
    font-weight: bolder;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.25;
    letter-spacing: -0.32px;
    text-align: left;
    color: #424242;
  }
  .more-btn-wrap {
    position: relative;
    &:before {
      display: block;
      position: absolute;
      left: calc(50% - 63px);
      width: 126px;
      height: 48px;
      background: #fff;
      content: '';
      z-index: 1;
    }
    &:after {
      position: absolute;
      right: 0;
      top: 23px;
      width: 100%;
      height: 1px;
      background: #e0e0e0;
      content: '';
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
    background: #fff;
    color: #616161;
    font-size: 14px;
    line-height: 46px;
    z-index: 1;
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
  .searchBarWrapper {
    padding: 10.5px 16px;
    box-sizing: border-box;
    background-color: #eee;
  }
  .searchTab {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #f5f5f5;
    margin-top: 16px;
    padding: 0 44px;
    box-sizing: border-box;
    .tabBtn {
      font-size: 14px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.43;
      letter-spacing: normal;
      text-align: center;
      color: #757575;
      padding-bottom: 8px;
      &--active {
        color: #632beb;
        font-weight: 600;
        border-bottom: 1px solid #632beb;
        padding-bottom: 7px;
      }
    }
  }
`
const searchCategory = [
  {
    id: 0,
    title: '통합검색'
  },
  {
    id: 1,
    title: '실시간 라이브'
  },
  {
    id: 2,
    title: 'DJ'
  }
]
