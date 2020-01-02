/**
 * @title 가이드페이지-메뉴구성
 */
import React, {useContext, useEffect, useState} from 'react'
import styled from 'styled-components'
//components
import {Context} from './store'
//pages
import StyleButton from './content/style-button'
import StyleTab from './content/style-tab'
//
export default props => {
  //---------------------------------------------------------------------
  //context
  const store = useContext(Context)
  //---------------------------------------------------------------------
  //makeContents
  const makeContents = () => {
    switch (store.menuCode) {
      case 'menu1':
        return <StyleButton />
      case 'menu2':
        return <StyleTab />
      default:
        return <h1>없음</h1>
    }
  }
  //---------------------------------------------------------------------
  return <Contents>{makeContents()}</Contents>
}
//---------------------------------------------------------------------
const Contents = styled.section`
  display: block;
  padding: 10px;
  border: 1px solid #111;
  box-sizing: border-box;
`
