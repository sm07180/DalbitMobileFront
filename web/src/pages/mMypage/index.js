import React, {useEffect} from 'react'
import styled from 'styled-components'
import {Switch, Route} from 'react-router-dom'

// component
import Layout from 'pages/common/layout/new_index.js'

export default props => {
  return (
    <Layout {...props}>
      <Mypage></Mypage>
    </Layout>
  )
}

const Mypage = styled.div``
