/**
 * @title 가이드페이지
 */
import React, {useContext, useState, useEffect} from 'react'
import styled from 'styled-components'
//pages
import Layout from './layout'
import Ajax from './content/guide-ajax'
//context
import {Context} from './store'
//
export default () => {
  //---------------------------------------------------------------------
  //context
  const context = useContext(Context)
  //state
  const [code, setCode] = useState('default')
  //---------------------------------------------------------------------
  //update
  function update(mode) {
    switch (mode) {
    }
  }
  //makeContents
  const makeContents = () => {
    switch (code) {
      case 'guide':
        break
      default:
        return <Ajax />
    }
  }
  return (
    <Layout>
      <h1>{code}</h1>
      {makeContents()}
    </Layout>
  )
}
//---------------------------------------------------------------------
const Wrap = styled.div`
  background: blue;
`
