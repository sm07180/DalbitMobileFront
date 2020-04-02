/**
 * @file /mlive/index.js
 * @brief 라이브방송
 */
import React, {useContext, useEffect} from 'react'
import styled from 'styled-components'
import _ from 'lodash'
//context
import {PayStore} from '../store'
//components
import Api from 'context/api'

const Index = props => {
  //---------------------------------------------------------------------
  //let
  let timer
  //context
  const store = useContext(PayStore)
  Index.store = store

  //---------------------------------------------------------------------
  //useEffect
  useEffect(() => {}, [])
  //---------------------------------------------------------------------
  return (
    <Content>
      <div>안드로이드 결제</div>
    </Content>
  )
}
export default Index
//---------------------------------------------------------------------
const Content = styled.div`
  display: block;
  margin-top: 60px;
  padding-left: 16px;
  padding-right: 16px;
  box-sizing: border-box;
`
//---------------------------------------------------------------------
/**
 * @title 스토어객체
 */
export const Store = () => {
  return Index.store
}
