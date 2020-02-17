/**
 * @title 404페이지
 */
import React, {useEffect, useContext, useState} from 'react'
import styled from 'styled-components'

//context
import {Context} from 'context'

//etc
import Chat from './chat'

//pages
// import Guide from ' pages/common/layout/guide.js'

export default props => {
  //context
  const context = new useContext(Context)
  //const
  const {state} = props.location

  //makeContents
  const makeContents = () => {
    console.log(props)
    return JSON.stringify(state, null, 4)
  }

  return (
    <Content>
      <pre>
        <p>{makeContents()}</p>
      </pre>
      <Chat />
    </Content>
  )
}

const Content = styled.div`
  p {
    font-size: 14px;
  }
`
