/**
 * @file /event/index.js
 * @brief 이벤트
 */
import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
//layout
import Layout from 'Pages/common/layout'
//context
//components
import Api from 'Context/api'
//
export default props => {
  //---------------------------------------------------------------------
  //useEffect
  useEffect(() => {}, [])
  //---------------------------------------------------------------------
  return (
    <Layout {...props}>
      <Content>이벤트</Content>
    </Layout>
  )
}

//---------------------------------------------------------------------

const Content = styled.section`
  min-height: 300px;
  background: #e1e1e1;
`
