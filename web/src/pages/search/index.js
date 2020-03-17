import React, {useState, useEffect, useContext} from 'react'
import styled from 'styled-components'
import Layout from 'pages/common/layout'
import Content from './content'
import {Context} from 'context'

export default props => {
  const context = useContext(Context)
  return (
    <Layout {...props}>
      <Content {...props} />
    </Layout>
  )
}
