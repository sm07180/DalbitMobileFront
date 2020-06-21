/**
 * @file 모바일/customer/index.js
 * @brief 고객센터
 * @todo
 */

import Layout from 'pages/common/layout/new_layout'
import React from 'react'
import Content from './content'
//Context
import {CustomerProvider} from './store'

export default props => {
  //---------------------------------------------------------------------
  //title

  return (
    <CustomerProvider>
      <Content {...props} />
    </CustomerProvider>
  )
}
