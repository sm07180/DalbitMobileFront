/**
 * @file /live/index.js
 * @brief 라이브방송
 */
import React, {useEffect, useContext, useState} from 'react'
import styled from 'styled-components'
//layout
import Layout from 'pages/common/layout'
//context
import {Context} from 'context'
import {LiveProvider} from './store'
//components
import Api from 'context/api'
//pages
import Content from 'pages/live/content/'
import BroadCast from 'pages/live/content/broadcast'
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
    const value = document.getElementById('CUSTOMHEADER').value
    alert(value)
  }, [])

  //---------------------------------------------------------------------
  return (
    <LiveProvider>
      <Layout {...props}>
        <Content />
      </Layout>
    </LiveProvider>
  )
}
//---------------------------------------------------------------------
