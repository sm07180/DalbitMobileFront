/**
 * @title
 */
import React, {useContext, useState} from 'react'
import styled from 'styled-components'
//context
import {Context} from '../store'

export default () => {
  //---------------------------------------------------------------------
  const store = useContext(Context)
  console.log(store)
  //---------------------------------------------------------------------
  return <Content>AJAX</Content>
}
//---------------------------------------------------------------------
const Content = styled.section``
