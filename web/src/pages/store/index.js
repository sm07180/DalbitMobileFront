/**
 * @file /store/index.js
 * @brief 스토어
 */
import React, {useContext} from 'react'
import styled from 'styled-components'
import _ from 'lodash'
//layout
import Layout from 'pages/common/layout'
//context
import {Context} from 'context'

//components
import Contents from './content'
import Header from 'components/ui/new_header'
//
export default (props) => {
  //---------------------------------------------------------------------
  //context
  const context = useContext(Context)
  const {profile} = context
  //---------------------------------------------------------------------
  return (
    <>
      <Header title="스토어" />
      <Content>
        <Contents {...props} />
      </Content>
    </>
  )
}
//---------------------------------------------------------------------
const Content = styled.section`
  min-height: calc(100vh - 40px);
  padding: 0 16px;
  background: #eeeeee;
`
