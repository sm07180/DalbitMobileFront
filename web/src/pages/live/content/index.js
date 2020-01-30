/**
 * @file chat.js
 * @brief 채팅
 */
import React, {useEffect, useContext, useState} from 'react'
import styled from 'styled-components'
//context
import {Context} from 'pages/live/store'
//components
import Api from 'context/api'
//
export default props => {
  //---------------------------------------------------------------------
  //context
  const store = useContext(Context)
  /**
   *
   * @returns
   */
  useEffect(() => {
    //
  }, [])
  //---------------------------------------------------------------------
  return (
    <Content>
      <h1>리스트</h1>
    </Content>
  )
}
//---------------------------------------------------------------------
const Content = styled.div`
  min-height: 200px;
  background: #e1e1e1;
`
