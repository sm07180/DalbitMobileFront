/**
 *
 */
import React, {useEffect, useContext} from 'react'
import styled from 'styled-components'
//context
import {WIDTH_TABLET} from 'Context/config'
import {Context} from 'Context'
import {HEADER_HEIGHT} from 'Context/config'
//layout
import Header from 'Pages/common/header'
import Footer from 'Pages/common/footer'
import Gnb from 'Pages/common/gnb'
import Popup from 'Pages/common/popup'
//
const Layout = props => {
  //context
  const context = useContext(Context)
  //initalize
  const {children} = props
  //---------------------------------------------------------------------
 
  useEffect(() => {
   
  }, [])
  //---------------------------------------------------------------------
  return (
    <Container>
      {/* 헤더설정 */}
      로고
      {/* global navigation */}
      
      <main className={props.type == 'main' ? 'main' : 'sub'}>
        <article>{children}</article>
      </main>
      {/* 푸터설정 */}
      <footer>
      Copyrightⓒ2020 by (주)인포렉스. All rights reserved.
        </footer>
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
    z-index: 1;
    @media (max-width: ${WIDTH_TABLET}) {
      padding-left: 0;
    }
    /* 컨텐츠내용 */
    article {
      position: relative;
    }
  }
  main.sub {
    padding-top: 80px;
  }
`
