/**
 * @title 검색바
 * @todos 디자인과 기획과 상이한부분이 있음
 */
import React, {useEffect, useState, useContext} from 'react'
import styled from 'styled-components'
//context
import API from 'context/api'
import {Context} from 'context/index.js'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import Room, {RoomJoin} from 'context/room'
// component
import Header from '../component/header.js'
import SearchBar from './search_bar'
import List from './search-list'
let currentPage = 1
let query = ''
export default (props) => {
  // ctx
  const context = useContext(Context)
  //State
  const [member, setMember] = useState(null)
  const [nextMember, setNextMember] = useState(null)
  const [live, setLive] = useState(null)
  const [moreState, setMoreState] = useState(false)
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
          records: 12
        }
      })
      if (res.result == 'success' && _.hasIn(res, 'data.list')) {
        if (res.data.list == false) {
          if (!next) {
            setMember(false)
          }
          setMoreState(false)
        } else {
          if (next) {
            setMoreState(true)
            setNextMember(res.data.list)
          } else {
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
  //fetch (라이브검색)
  async function fetchLive(query) {
    /*if (query === undefined) return
    const qs = location.href.split('?')[1] && decodeURIComponent(location.href.split('?')[1].split('=')[1])
    const res = await API.live_search({
      params: {
        search: query || qs,
        page: 1,
        records: 12
      }
    })
    if (res.result === 'success') {
      setLive(res.data)
    }*/
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
          RoomJoin(roomNo)
          // console.log('조인')
        } else if (roomNo === '0') {
          window.location.href = `/mypage/${memNo}/`
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
    if (query.length > 1) {
      setMember(member.concat(nextMember))
      fetchMember(query, 'next')
    } else return
  }
  //---------------------------------------------------------------------
  console.log()
  return (
    <Content>
      <Room />
      <Header>
        <div className="category-text">검색</div>
      </Header>
      {/* 검색바 */}
      <SearchBar update={update} />
      {member && <h1>사용자 검색</h1>}
      <List update={update} type="member" fetch={member} />
      {moreState && (
        <div className="more-btn-wrap">
          <button
            className="more-btn"
            onClick={() => {
              showMoreList()
            }}>
            더보기
          </button>
        </div>
      )}
      {/* {live && <h1>라이브 검색</h1>}
      <List update={update} type="live" fetch={live} /> */}
    </Content>
  )
}
//---------------------------------------------------------------------
const Content = styled.div`
  background-color: #fff;
  height: 100vh;
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
`
