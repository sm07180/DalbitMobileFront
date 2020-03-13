/**
 * @file /event/index.js
 * @brief 이벤트
 */
import React, {useEffect, useState, useContext} from 'react'

//layout
import Layout from 'pages/common/layout'
//context
//components
import Content from './content'
//
export default props => {
  return (
    <Layout {...props}>
      <Content {...props} />
    </Layout>
  )
}
//---------------------------------------------------------------------
