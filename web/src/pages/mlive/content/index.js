/**
 * @file /mlive/index.js
 * @brief 라이브방송
 */
import React, {useContext} from 'react'
import styled from 'styled-components'
//context
import {LiveStore} from '../store'
//components
import Api from 'context/api'
//pages
import Live from './live-index'
import Filter from './live-filter'

const Index = props => {
  //---------------------------------------------------------------------
  //context
  const store = useContext(LiveStore)
  Index.store = store

  //---------------------------------------------------------------------
  return (
    <Content>
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
  padding-left: 16px;
  padding-right: 16px;
  background: #eee;
  box-sizing: border-box;
`
//---------------------------------------------------------------------
/**
 * @title 스토어객체
 */
export const Store = () => {
  return Index.store
}
