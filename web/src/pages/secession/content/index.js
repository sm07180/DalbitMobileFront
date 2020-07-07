import React, {useState, useEffect, useContext} from 'react'
import styled from 'styled-components'
//context
import {SecssionStore} from '../store'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
import Api from 'context/api'
import {Context} from 'context'
//components
import Exit from './exit'
import Header from 'components/ui/header'

//
const Index = props => {
  //---------------------------------------------------------------------
  //context
  const context = useContext(Context)
  const store = useContext(SecssionStore)
  Index.store = store
  //---------------------------------------------------------------------
  return (
    <Container>
      <Header>
        <div className="category-text">회원탈퇴</div>
      </Header>
      <Exit />
    </Container>
  )
}
export default Index
//---------------------------------------------------------------------
/**
 * @title 스토어객체
 */
export const Store = () => {
  return Index.store
}
//---------------------------------------------------------------------
const Container = styled.div`
  width: 740px;
  margin: 0 auto;
  @media (max-width: 1240px) {
    position: relative;
    width: 100%;
    padding: 0 16px;
  }

  .close-btn {
    position: absolute;
    top: 8px;
    left: 2px;
  }

  & h1 {
    margin: 40px 0;
    text-align: center;
    color: ${COLOR_MAIN};
    font-size: 28px;
    font-weight: 600;
    letter-spacing: -0.7px;
    @media (max-width: ${WIDTH_MOBILE}) {
      margin: 30px 0;
      font-size: 20px;
    }
  }
`
