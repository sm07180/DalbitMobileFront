/**
 * @file main.js
 * @brief 메인페이지
 */
import React, {useMemo, useEffect} from 'react'
//components
import Api from 'context/api'
//components
import Layout from 'pages/common/layout'
import Content from './content'

export default props => {
  //---------------------------------------------------------------------

  useEffect(() => {}, [])
  //---------------------------------------------------------------------
  return (
    <Layout {...props} type="main">
      <Content />
    </Layout>
  )
}
