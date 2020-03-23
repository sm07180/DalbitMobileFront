import React, {useState, useEffect, useContext} from 'react'
import styled from 'styled-components'
//context
import {CustomerStore} from '../store'
import {Context} from 'context'

import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
//components
import Banner from './banner'
import Tab from './tab'

const Index = props => {
  //---------------------------------------------------------------------
  //context
  const store = useContext(CustomerStore)
  Index.store = store
  //Store = Index.store
  //---------------------------------------------------------------------
  //makeContents
  const makeContents = () => {
    switch (store.menuCode) {
      case 'notice': //------------------------레이어팝업(alert & system)
        return <h1>notice</h1>
      case 'faq':
        return <h1>faq</h1>
      case '1on1':
        return <h1>1on1</h1>
      case 'broadcast_guide':
        return <h1>broadcast_guide</h1>
    }
  }
  //---------------------------------------------------------------------
  return (
    <Container>
      <h1>고객센터</h1>
      <Banner />
      {/* 탭설정 */}
      <Tab />
      {/* 컨텐츠설정 */}
      {makeContents()}
    </Container>
  )
}
export default Index
//---------------------------------------------------------------------
//context
export const Store = () => {
  return Index.store
}
//---------------------------------------------------------------------
const Container = styled.div`
  width: 1210px;
  margin: 0 auto;
  & h1 {
    margin: 40px 0;
    text-align: center;
    color: ${COLOR_MAIN};
    font-size: 28px;
    font-weight: 800;
    letter-spacing: -0.7px;
  }
  @media (max-width: 1240px) {
    width: 95%;
  }
`
