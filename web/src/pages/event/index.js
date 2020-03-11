/**
 * @file /event/index.js
 * @brief 이벤트
 * @todo 이벤트 클릭이벤트 페이지 추후 작업
 */

import React, {useState, useEffect, useContext} from 'react'
import styled from 'styled-components'
import Layout from 'pages/common/layout'
import Content from './content'

export default props => {
  return (
    <Layout {...props}>
      <Content {...props} />
    </Layout>
  )
}
