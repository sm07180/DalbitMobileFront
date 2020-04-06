/**
 * @title 검색바
 * @todos 디자인과 기획과 상이한부분이 있음
 */
import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
//context
import API from 'context/api'
// component
import Header from '../component/header.js'
import SearchBar from './search_bar'
import List from './search-list'
//
export default props => {
  //---------------------------------------------------------------------
  //useState
  const [fetch, setFetch] = useState(null)
  //---------------------------------------------------------------------

  //fetch
  async function fetchData(query) {
    const qs = location.href.split('?')[1] && decodeURIComponent(location.href.split('?')[1].split('=')[1])
    const res = await API.live_search({
      params: {
        search: query || qs,
        page: 1,
        records: 10
      }
    })
    if (res.result === 'success') {
      setFetch(res.data)
      console.log(res.data)
    }
  }
  //update
  function update(mode) {
    switch (true) {
      case mode.search !== undefined: //-------------------------------검색어
        const {query} = mode.search
        fetchData(query)
        break
      default:
        break
    }
  }
  //useEffect
  useEffect(() => {
    fetchData()
  }, [])
  //---------------------------------------------------------------------
  return (
    <Content>
      <Header>
        <div className="category-text">검색</div>
      </Header>
      {/* 검색바 */}
      <SearchBar update={update} />
      <h1>최근 본 달디</h1>
      <List fetch={fetch} />
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
