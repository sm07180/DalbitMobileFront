/**
 * @file /live/index.js
 * @brief 라이브방송
 */
import React, {useEffect, useContext, useState} from 'react'

//layout
import Layout from 'pages/common/layout'
//context
import {Context} from 'context'
import {LiveProvider} from './store'
//components
import Api from 'context/api'
//pages
import Content from 'pages/live/content/'
//
export default props => {
  //---------------------------------------------------------------------
  //context
  const context = useContext(Context)

  /**
   *
   * @returns
   */

  useEffect(() => {
    //
  }, [])

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
