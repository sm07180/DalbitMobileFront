/**
 * @file /secession/index.js
 * @brief 설정
 * @todo
 */

import React, {useState, useEffect, useContext} from 'react'
import Layout from 'pages/common/layout/new_index.js'
import Content from './content'
//Context
import {SecssionProvider} from './store'

export default props => {
  //---------------------------------------------------------------------

  return (
    <Layout {...props}>
      <SecssionProvider>
        <Content {...props} />
      </SecssionProvider>
    </Layout>
  )
}
