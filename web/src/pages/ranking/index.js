/**
 * @file /ranking/index.js
 * @brief 랭킹 페이지
 */
import React, {useEffect, useState, useContext, useRef} from 'react'
import styled from 'styled-components'
//layout
import Layout from 'pages/common/layout'
//context
import {Context} from 'context'
import {RankingProvider} from './store'
//pages
import Contents from './content'

export default props => {
  //context
  const context = useContext(Context)

  return (
    <RankingProvider>
      <Layout {...props}>
        <Contents />
      </Layout>
    </RankingProvider>
  )
}

//---------------------------------------------------------------------

const Content = styled.section`
  min-height: 300px;
  background: #e1e1e1;
`
