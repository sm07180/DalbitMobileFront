/**
 * @file /event/index.js
 * @brief 이벤트
 */
import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
//layout
import Layout from 'pages/common/layout'
//context
import {Context} from 'context'
//components
import Api from 'context/api'
import Content from './content'
//
export default props => {
  //---------------------------------------------------------------------
  //useEffect
  useEffect(() => {}, [])
  //---------------------------------------------------------------------
  return (
    <Layout {...props}>
      <Content />
    </Layout>
  )
}
//---------------------------------------------------------------------
