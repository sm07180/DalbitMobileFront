/**
 * @title 404페이지
 */
import React, {useEffect, useContext, useState} from 'react'
import styled from 'styled-components'

//context
import {Context} from 'context'
import {BroadCastContext} from '../store'
//etc

//pages
// import Guide from ' pages/common/layout/guide.js'

export default props => {
  //---------------------------------------------------------------------
  //context
  const context = new useContext(Context) //global context
  const store = new useContext(BroadCastContext) //store

  //const
  const {state} = props.location
  //---------------------------------------------------------------------

  //makeContents
  const makeContents = () => {
    return JSON.stringify(state, null, 4)
  }
  //---------------------------------------------------------------------
  return (
    <Content>
      <pre>
        <p>{makeContents()}</p>
      </pre>
    </Content>
  )
}
//---------------------------------------------------------------------
const Content = styled.div`
  p {
    font-size: 12px;
  }
`
