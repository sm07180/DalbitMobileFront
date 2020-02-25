/**
 * @file layout-menu.js
 * @brief 가이드에서 사용되는 메뉴모음 context(store),hooks를 사용한다
 * @author 손완휘
 * @todo 메뉴추가 및 페이지추가, 디자인에 맞게 스타일링 다듬기
 */
import React, {useContext, useState} from 'react'
import styled from 'styled-components'
//components
import {Context} from './store'
import useClick from 'components/hooks/useClick'
//
export default props => {
  //---------------------------------------------------------------------
  //context
  const store = useContext(Context)
  //hooks
  //ui
  const alert = useClick(update, {menu: 'alert'})
  const guideResponsive = useClick(update, {menu: 'guide-responsive'})
  const styleButton = useClick(update, {menu: 'style-button'})
  const styleWebRtcTest = useClick(update, {menu: 'style-WebRtcTest'})
  const styleChart = useClick(update, {menu: 'style-chart'})
  const stylechatTest = useClick(update, {menu: 'style-chatTest'})

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
      <button {...alert}>Alert & Conform</button>
      <button {...styleButton}>메뉴1</button>
      <hr />
      <h1>스타일가이드</h1>
      <button {...guideResponsive}>반응형 가이드!</button>
      <button {...styleButton}>버튼</button>
      <button {...styleWebRtcTest}>WebRtc 테스트</button>
      <button {...hooks3}>기타</button>
      <button {...styleChart}>차트</button>
      <button {...stylechatTest}>채팅</button>
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
