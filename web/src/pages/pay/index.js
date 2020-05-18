/**
 * @file /mpay/index.js
 * @brief 안드로이드 전용 결제
 */
import React, {useContext} from 'react'
//context
import {PayProvider} from './store'
//layout
import Layout from 'pages/common/layout'
//components
import Content from './content'
//
export default (props) => {
  //---------------------------------------------------------------------
  //context
  if (__NODE_ENV === 'dev') {
    alert('success')
    alert(JSON.stringify(props, null, 1))
  }
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
