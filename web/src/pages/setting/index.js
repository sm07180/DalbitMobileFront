/**
 * @file /setting/index.js
 * @brief 설정
 * @todo
 */

import React, {useState, useEffect, useContext} from 'react'
import styled from 'styled-components'
import Layout from 'pages/common/layout/new_index.js'
import Content from './content'
//Context
import {SettingProvider} from './store'

export default props => {
  //---------------------------------------------------------------------

  return (
    <Layout {...props}>
      <SettingProvider>
        <Content {...props} />
      </SettingProvider>
    </Layout>
  )
}
