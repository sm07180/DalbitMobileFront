/**
 * @file /mlive/index.js
 * @brief 라이브방송
 */
import React, {useContext} from 'react'
//layout
import Layout from 'pages/common/layout/new_index'
//context
import {LiveProvider} from './store'
//components
//pages
import Content from './content'
//
export default props => {
  //---------------------------------------------------------------------
  //context
  /**
   *
   * @returns
   */
  //---------------------------------------------------------------------
  return (
    <LiveProvider>
      <Layout {...props}>
        <Content {...props} />
      </Layout>
    </LiveProvider>
  )
}
//---------------------------------------------------------------------
