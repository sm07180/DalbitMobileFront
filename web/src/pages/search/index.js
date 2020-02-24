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
