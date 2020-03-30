/**
 * @file /mlive/index.js
 * @brief 라이브방송
 */
import React, {useContext} from 'react'
import styled from 'styled-components'
//context
import {COLOR_MAIN} from 'context/color'
//components
import Api from 'context/api'
//pages
//
export default props => {
  //---------------------------------------------------------------------
  return (
    <Content>
      <h1>실시간 LIVE</h1>
    </Content>
  )
}
//---------------------------------------------------------------------
const Content = styled.div`
  & > h1 {
    margin-top: 24px;
    font-size: 28px;
    font-weight: 600;
    color: ${COLOR_MAIN};
    text-align: left;
  }
`
//---------------------------------------------------------------------
