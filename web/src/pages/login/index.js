/**
 * @file /login/index.js
 * @brief 로그인
 */
import React, {useEffect, useState, useContext} from 'react'
import styled from 'styled-components'

//layout
import Layout from 'pages/common/layout/pure'
import Auth from 'pages/common/auth'

export default props => {
  //---------------------------------------------------------------------
  //useEffect
  useEffect(() => {}, [])
  //---------------------------------------------------------------------
  return (
    <Layout {...props}>
      <Auth {...props}></Auth>
    </Layout>
  )
}
