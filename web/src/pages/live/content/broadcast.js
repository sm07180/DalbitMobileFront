/**
 * @file broadcast.js
 * @brief 방송
 */
import React, {useEffect, useContext, useState} from 'react'
import styled from 'styled-components'
//context
import {Context} from 'Pages/live/store'
//components
import Api from 'Context/api'
//
export default props => {
  //---------------------------------------------------------------------
  //context
  const store = useContext(Context)
  console.log(store)

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
      <h1>WEBRTC</h1>
    </Content>
  )
}
//---------------------------------------------------------------------
const Content = styled.div`
  min-height: 200px;
  background: #eee;
`
