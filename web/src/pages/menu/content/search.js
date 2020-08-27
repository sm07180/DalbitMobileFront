import React, {useEffect, useState, useContext} from 'react'
import styled from 'styled-components'
import {useHistory} from 'react-router-dom'
//context
import API from 'context/api'
import {Context} from 'context/index.js'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import Room, {RoomJoin} from 'context/room'
// component
import Header from 'components/ui/new_header.js'
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
    <div className="mainSearchWrap">
      <Room />
      <Header title="검색" />
      {/* 검색바 */}
      <div className="searchBarWrapper">
        <SearchBar update={update} />
      </div>
      <div className="contentWrap">
        {(query === '' || (live === null && member === null)) && <InitialSearch />}
        {query !== '' && (
          <div className="searchTab">
            {searchCategory.map((item, idx) => {
              return (
                <button
                  key={item.id}
                  className={btnIdx === item.id ? 'tabBtn tabBtn--active' : 'tabBtn'}
                  onClick={() => btnActive(item.id)}>
                  <span>{item.title}</span>
                </button>
              )
            })}
          </div>
        )}

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
      </div>
    </div>
  )
}
