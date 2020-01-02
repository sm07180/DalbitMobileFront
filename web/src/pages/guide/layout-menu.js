/**
 * @title 가이드페이지-메뉴구성
 */
import React, {useState} from 'react'
import styled from 'styled-components'
//components
import useClick from '@/components/hooks/useClick'

export default props => {
  //---------------------------------------------------------------------
  const [state, setState] = useState(0)
  //hooks
  const hooks1 = useClick(update, {menu: 'menu1'})
  const hooks2 = useClick(update, {menu: 'menu2'})
  const hooks3 = useClick(update, {menu: 'menu3'})
  //---------------------------------------------------------------------
  function update(mode) {
    switch (true) {
      case mode.menu !== undefined: //----------------메뉴변경
        console.log(mode.menu)
        break
    }
  }
  //---------------------------------------------------------------------
  return (
    <Menus>
      <h1>UI</h1>
      <a href="#" {...hooks1}>
        메뉴1
      </a>
      <a href="#" {...hooks2}>
        >AJAX sample
      </a>
      <a href="#" {...hooks3}>
        >사이틀
      </a>
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
