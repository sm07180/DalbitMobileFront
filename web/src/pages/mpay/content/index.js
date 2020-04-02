/**
 * @file /mlive/index.js
 * @brief 라이브방송
 */
import React, {useContext, useEffect} from 'react'
import styled from 'styled-components'
import _ from 'lodash'
//context & store
import Api from 'context/api'
import {Context} from 'context'
import {PayStore} from '../store'
//components
import Pay from 'pages/store/content/index'
const Index = props => {
  //---------------------------------------------------------------------
  const context = useContext(Context)
  //context

  const store = useContext(PayStore)
  Index.store = store

  //---------------------------------------------------------------------
  //useEffect
  useEffect(() => {}, [])
  //---------------------------------------------------------------------
  return (
    <Content>
      <h1>안드로이드 결제</h1>
      <div>
        <button
          onClick={() => {
            alert('2')
            context.action.updatePopup('CHARGE', {
              name: selected.name,
              price: selected.price
            })
          }}>
          테스트
        </button>
      </div>
      <Pay {...props} />
    </Content>
  )
}
export default Index
//---------------------------------------------------------------------
const Content = styled.div`
  display: block;
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
