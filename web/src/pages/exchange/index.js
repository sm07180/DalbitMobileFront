/**
 * @file /exchange/index.js
 * @brief 달 교환 페이지
 */
import React from 'react'
import styled from 'styled-components'
//layout
import Layout from 'pages/common/layout'
//context

//components
import Contents from './content'
import Header from 'components/ui/new_header.js'

export default (props) => {
  //---------------------------------------------------------------------
  return (
    <Layout {...props} status="no_gnb">
      <Content>
        <Header title="달 교환" />
        {/* 교환아이템 */}
        <Contents {...props} />
      </Content>
    </Layout>
  )
}
//---------------------------------------------------------------------
const Content = styled.section`
  min-height: 300px;
  height: 100%;
  margin: 0 auto;
  padding: 0 0 120px 0;
  background: #eeeeee;
`
