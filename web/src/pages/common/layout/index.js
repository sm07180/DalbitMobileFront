/**
 *
 */
import React, {useEffect, useContext} from 'react'
import styled from 'styled-components'
//context
import {Context} from 'Context'
import {HEADER_HEIGHT} from 'Context/config'
//layout
import Header from 'Pages/common/header'
import Footer from 'Pages/common/footer'
import Gnb from 'Pages/common/gnb'
import Popup from 'Pages/common/popup'
//
const Layout = props => {
  //initalize
  const {children} = props
  //---------------------------------------------------------------------
  return (
    <Container>
      {/* 헤더설정 */}
      <Header />
      {/* global navigation */}
      <Gnb />
      <main>
        <article>{children}</article>
        {/* 푸터설정 */}
        <Footer />
      </main>
      {/* 레이어팝업 */}
      <Popup />
    </Container>
  )
}
export default Layout
//---------------------------------------------------------------------
const Container = styled.div`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  /* 메인페이지 */
  main {
    display: block;
    width: 100%;
    height: calc(100% - 50px);
    padding-left: 200px;
    box-sizing: border-box;
    z-index: 1;
    article {
      position: relative;
      padding-top: 50px;
      padding-bottom: 100px;
    }
  }
`
