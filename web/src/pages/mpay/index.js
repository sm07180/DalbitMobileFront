/**
 * @file /mpay/index.js
 * @brief 안드로이드 전용 결제
 */
import React, {useContext} from 'react'
//layout
import Layout from 'pages/common/layout/new_index'
//context
import {PayProvider} from './store'
//components
//pages
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
      <h1>111</h1>
    </PayProvider>
  )
}
//---------------------------------------------------------------------
