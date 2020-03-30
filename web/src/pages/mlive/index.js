/**
 * @file /mlive/index.js
 * @brief 라이브방송
 */
import React, {useContext} from 'react'
//layout
import Layout from 'pages/common/layout'
//context
import {LiveProvider} from './store'
//components
//pages
import Gnb from 'pages/common/newGnb'
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
      {/* GNB */}
      <Gnb />
      <Content {...props} />
    </LiveProvider>
  )
}
//---------------------------------------------------------------------
