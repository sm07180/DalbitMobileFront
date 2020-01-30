/**
 * @file /login/index.js
 * @brief 로그인
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
      <Content>CAST</Content>
    </Layout>
  )
}

//---------------------------------------------------------------------

const Content = styled.section`
  min-height: 300px;
  background: #e1e1e1;
`
