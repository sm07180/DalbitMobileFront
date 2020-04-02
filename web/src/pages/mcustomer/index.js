/**
 * @file 모바일/customer/index.js
 * @brief 고객센터
 * @todo
 */

import React, {useState, useEffect, useContext} from 'react'
import styled from 'styled-components'
import Layout from 'pages/common/layout/new_index.js'
import Content from './content'
//Context
import {CustomerProvider} from './store'

export default props => {
  //---------------------------------------------------------------------
  //title

  return (
    <Layout {...props}>
      <CustomerProvider>
        <Content {...props} />
      </CustomerProvider>
    </Layout>
  )
}
