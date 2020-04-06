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
//
export default props => {
  //---------------------------------------------------------------------
  //fetch
  async function fetchData() {
    const qs = location.href.split('?')[1] && decodeURIComponent(location.href.split('?')[1].split('=')[1])
    const res = await API.live_search({
      params: {
        search: qs,
        page: 1,
        records: 10
      }
    })
    if (res.result === 'success') {
    }
    console.log(res)
  }
  //useEffect
  useEffect(() => {
    fetchData()
  }, [])
  //---------------------------------------------------------------------
  return (
    <div>
      <Header>
        <div className="category-text">검색</div>
      </Header>
      {/* 검색바 */}
      <SearchBar />
      <div>검색영역</div>
    </div>
  )
}
//---------------------------------------------------------------------
