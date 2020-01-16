/**
 *
 */
import React, {useEffect, useContext} from 'react'
import styled from 'styled-components'
//context
import {DEVICE_MOBILE} from 'Context/config'
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
      <Popup {...props} />
    </Container>
  )
}
export default Layout
//---------------------------------------------------------------------
const Container = styled.div`
  width: 100%;
  /* 메인페이지 */
  main {
    display: block;
    width: 100%;
    /* height: calc(100% - 50px); */
    padding-top: 103px;
    z-index: 1;
    @media (max-width: ${DEVICE_MOBILE}) {
      padding-left: 0;
    }
    /* 컨텐츠내용 */
    article {
      position: relative;
    }
  }
`
