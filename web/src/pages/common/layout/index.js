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

const Layout = props => {
  console.log(HEADER_HEIGHT)
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
    </Container>
  )
}
export default Layout
//---------------------------------------------------------------------
const Container = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;

  main {
    display: block;
    width: 100%;
    height: calc(100% - 50px);
    padding-left: 200px;
    box-sizing: border-box;

    article {
      position: relative;
      padding-bottom: 100px;
    }
  }
`
