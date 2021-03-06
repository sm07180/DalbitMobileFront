/**
 * @file /secession/index.js
 * @brief 설정
 * @todo
 */

import React, {useState, useEffect, useContext} from 'react'
import Layout from 'pages/common/layout'
import Content from './content'
//Context
import {SecssionProvider} from './store'

export default props => {
  //---------------------------------------------------------------------

  return (
    <Layout {...props} status="no_gnb">
      <SecssionProvider>
        <Content {...props} />
      </SecssionProvider>
    </Layout>
  )
}
