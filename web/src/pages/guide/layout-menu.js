/**
 * @file layout-menu.js
 * @brief 가이드에서 사용되는 메뉴모음 context(store),hooks를 사용한다
 * @author 손완휘
 */
import React, {useContext, useState} from 'react'
import styled from 'styled-components'
//components
import {Context} from './store'
import useClick from '@/components/hooks/useClick'
//
export default props => {
  //---------------------------------------------------------------------
  //context
  const store = useContext(Context)
  //hooks
  const hooks1 = useClick(update, {menu: 'menu1'})
  const hooks2 = useClick(update, {menu: 'menu2'})
  const hooks3 = useClick(update, {menu: 'menu3'})
  //---------------------------------------------------------------------
  function update(mode) {
    switch (true) {
      case mode.menu !== undefined:
        store.action.updateCode(mode.menu)
        break
      default:
        break
    }
  }
  //---------------------------------------------------------------------
  return (
    <Menus>
      <h1>UI</h1>
      <button {...hooks1}>메뉴1</button>
      <hr />
      <h1>스타일가이드</h1>
      <button {...hooks1}>버튼</button>
      <button {...hooks2}>탭</button>
      <button {...hooks3}>기타</button>
      <hr />
      <h1>ajax</h1>
      <button>GET</button>
      <button>POST</button>
      <button>PUT</button>
      <button>DELETE</button>
      <hr />
    </Menus>
  )
}
//---------------------------------------------------------------------
const Menus = styled.nav`
  hr {
    display: block;
    width: 100%;
    border-bottom: 1px solid #ccc;
  }
  h1 {
    display: block;
    padding: 5px;
    color: #333;
    font-weight: normal;
    font-size: 20px;
    box-sizing: border-box;
  }
  button {
    display: block;
    margin-left: 10px;
    padding: 3px 10px;
    color: #111;
    font-size: 12px;
    &:hover {
      color: #fff;
      background: #111;
    }
  }
  background: #fff;
`
