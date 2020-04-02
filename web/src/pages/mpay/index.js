/**
 * @file /mpay/index.js
 * @brief 안드로이드 전용 결제
 */
import React, {useContext} from 'react'
//context
import {PayProvider} from './store'
//layout
import Layout from 'pages/common/layout/new_index'
//components
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
    <PayProvider>
      <Layout {...props} status="no_gnb">
        <Content {...props} />
      </Layout>
    </PayProvider>
  )
}
//---------------------------------------------------------------------
