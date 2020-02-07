/**
 * @file /event/index.js
 * @brief 이벤트
 */
import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
//layout
import Layout from 'pages/common/layout'
//context
//components
import Api from 'context/api'
//
export default props => {
  //---------------------------------------------------------------------
  //useEffect
  useEffect(() => {}, [])
  //---------------------------------------------------------------------
  return (
    <Layout {...props}>
      <Content>
        <h1>&#x1F601;</h1>
        <h2>&#x1F3AC;</h2>
        <h3>&#x1F42D;</h3>
      </Content>
    </Layout>
  )
}

//---------------------------------------------------------------------

const Content = styled.section`
  min-height: 300px;
  background: #e1e1e1;
  h1 {
    font-size: 30px;
  }
  h2 {
    font-size: 50px;
  }
  h3 {
    font-size: 70px;
  }
`
