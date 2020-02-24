/**
 * @file /store/index.js
 * @brief 스토어
 */
import React, {useEffect, useState, useContext} from 'react'
import styled from 'styled-components'
//layout
import Layout from 'pages/common/layout'
//context
import {Context} from 'context'
//components
import Api from 'context/api'
//
export default props => {
  const context = useContext(Context)

  //---------------------------------------------------------------------
  //useEffect
  useEffect(() => {}, [])
  //---------------------------------------------------------------------
  return (
    <Layout {...props}>
      <Content>
        <div>
          <button
            onClick={() => {
              context.action.alert({msg: 'MESSAGE'})
            }}>
            Alert
          </button>
        </div>
        <div>
          <button
            onClick={() => {
              context.action.confirm({msg: 'confirm'})
            }}>
            Confirm
          </button>
        </div>
      </Content>
    </Layout>
  )
}

//---------------------------------------------------------------------

const Content = styled.section`
  min-height: 300px;
  background: #e1e1e1;
  button {
    display: inline-block;
    margin: 10px;
    padding: 10px;
    background: #ff0000;
    color: #fff;
  }
`
