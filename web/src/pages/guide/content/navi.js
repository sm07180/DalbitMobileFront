/**
 * @title 가이드페이지-메뉴구성
 */
import React, {useState} from 'react'
import styled from 'styled-components'

export default () => {
  //---------------------------------------------------------------------
  const [state, setState] = useState(0)
  //---------------------------------------------------------------------
  function 
  //---------------------------------------------------------------------

  return (
    <Menus>
      <h1>UI</h1>
      <a href="#">메뉴1</a>
      <a href="#">사이틀</a>
      <a href="#">사이틀</a>
      <a href="#">사이틀</a>
      <a href="#">사이틀</a>
    </Menus>
  )
}
//---------------------------------------------------------------------
const Menus = styled.nav`
  h1 {
    display: block;
    font-size: 20px;
  }
  a {
    display: block;
    font-size: 14px;
    padding: 10px;
  }
  background: #fff;
`
