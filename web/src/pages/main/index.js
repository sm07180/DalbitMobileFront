/**
 * @file main.js
 * @brief 메인페이지
 */
import React, {useContext, useEffect} from 'react'
//context
import {Context} from 'context'
//components
import Layout from 'pages/common/layout'
import Content from './content'

export default props => {
  //---------------------------------------------------------------------
  //context
  const context = useContext(Context)
  //---------------------------------------------------------------------
  //useEffect
  useEffect(() => {}, [])
  //---------------------------------------------------------------------
  return (
    <Layout {...props} type="main">
      <Content />
    </Layout>
  )
}
