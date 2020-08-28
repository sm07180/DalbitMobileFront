/**
 * @file /mlive/index.js
 * @brief 라이브방송
 */
import React, {useContext, useEffect} from 'react'
import styled from 'styled-components'
import _ from 'lodash'
//context
import {LiveStore} from '../store'
//components
import Api from 'context/api'
//pages
import Live from './live-index'
import Filter from './live-filter'
import Header from 'components/ui/header'

const Index = props => {
  //---------------------------------------------------------------------
  //let
  let timer
  //context
  const store = useContext(LiveStore)
  Index.store = store

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
      if (windowBottom >= docHeight - 30 && _.hasIn(Index.store.broadList, 'paging.totalPage')) {
        //현재페이지와 전체페이지비교
        if (Index.store.broadList.paging.totalPage > Index.store.currentPage) {
          Index.store.action.updateCurrentPage(Index.store.currentPage + 1)
        }
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
  }, [])
  //---------------------------------------------------------------------
  return (
    <Content>
      <Header>
        <div className="category-text">실시간 LIVE</div>
      </Header>
      {/* 필터 */}
      <Filter />
      {/* 실시간라이브 */}
      <Live />
    </Content>
  )
}
export default Index
//---------------------------------------------------------------------
const Content = styled.div`
  display: block;
  width: 100%;
  padding: 0 16px;
  margin: 0 auto;
  box-sizing: border-box;

  .close-btn {
    position: absolute;
    top: 6px;
    left: 2%;
  }
`
//---------------------------------------------------------------------
/**
 * @title 스토어객체
 */
export const Store = () => {
  return Index.store
}
