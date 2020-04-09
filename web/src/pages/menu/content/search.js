/**
 * @title 검색바
 * @todos 디자인과 기획과 상이한부분이 있음
 */
import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
//context
import API from 'context/api'
import Room, {RoomJoin} from 'context/room'
// component
import Header from '../component/header.js'
import SearchBar from './search_bar'
import List from './search-list'
//
export default props => {
  //---------------------------------------------------------------------
  //useState
  const [member, setMember] = useState(null)
  const [live, setLive] = useState(null)
  //---------------------------------------------------------------------
  //fetch 사용자검색
  async function fetchMember(query) {
    if (query === undefined) return
    const qs = location.href.split('?')[1] && decodeURIComponent(location.href.split('?')[1].split('=')[1])
    const res = await API.member_search({
      params: {
        search: query || qs,
        page: 1,
        records: 10
      }
    })
    if (res.result === 'success') {
      setMember(res.data)
    }
  }
  //fetch (라이브검색)
  async function fetchLive(query) {
    if (query === undefined) return
    const qs = location.href.split('?')[1] && decodeURIComponent(location.href.split('?')[1].split('=')[1])
    const res = await API.live_search({
      params: {
        search: query || qs,
        page: 1,
        records: 10
      }
    })
    if (res.result === 'success') {
      setLive(res.data)
    }
  }
  //update
  function update(mode) {
    switch (true) {
      case mode.search !== undefined: //-------------------------------검색어
        const {query} = mode.search
        fetchMember(query)
        fetchLive(query)
        break
      case mode.select !== undefined: //-------------------------------검색결과 아이템선택
        const {roomNo, memNo, type} = mode.select
        //라이브중아님,사용자검색
        if (roomNo !== '' && roomNo !== '0' && type !== 'member') {
          RoomJoin(roomNo)
        } else {
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
  }, [])
  //---------------------------------------------------------------------
  return (
    <Content>
      <Room />
      <Header>
        <div className="category-text">검색</div>
      </Header>
      {/* 검색바 */}
      <SearchBar update={update} />
      <h1>사용자 검색</h1>
      <List update={update} type="member" fetch={member} />
      <h1>라이브 검색</h1>
      <List update={update} type="live" fetch={live} />
    </Content>
  )
}
//---------------------------------------------------------------------
const Content = styled.div`
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
`
