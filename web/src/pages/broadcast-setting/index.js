/**
 * @file /event/index.js
 * @brief 이벤트
 */
import React, {useEffect, useState, useContext} from 'react'
import styled from 'styled-components'
//layout
import Layout from 'pages/common/layout'
//context
import {Context} from 'context'
//components
import Content from './content'
//
export default props => {
  //const
  const {title} = props.match.params
  const context = useContext(Context)

  //---------------------------------------------------------------------

  //useEffect
  useEffect(() => {}, [])
  //---------------------------------------------------------------------
  return (
    <Layout {...props}>
      <Content {...props} />
    </Layout>
  )
}
//---------------------------------------------------------------------
