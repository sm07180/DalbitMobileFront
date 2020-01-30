/**
 * @file /login/index.js
 * @brief 로그인
 */
import React, {useEffect, useState, useContext} from 'react'
import styled from 'styled-components'

//layout
import Layout from 'pages/common/layout/pure'
import SnsLogin from 'pages/common/auth'

export default props => {
  return (
    <Layout {...props}>
      <SnsLogin {...props}></SnsLogin>
    </Layout>
  )
}
