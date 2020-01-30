/**
 *
 */
import React, {useEffect, useContext} from 'react'
import styled from 'styled-components'
import Toggle from './toggle-footer'
//context
import {IMG_SERVER, WIDTH_TABLET, WIDTH_MOBILE} from 'Context/config'
import {Context} from 'Context'
import {HEADER_HEIGHT} from 'Context/config'
//layout
import Popup from 'Pages/common/popup'
//
const Layout = props => {
  //context
  const context = useContext(Context)
  //initalize
  const {children} = props
  //---------------------------------------------------------------------

  useEffect(() => {}, [])
  //---------------------------------------------------------------------
  return (
    <Container>
      {/* 헤더설정 */}
      <Logo>
        <img src={`${IMG_SERVER}/images/api/ic_logo_normal.png`} />
      </Logo>
      {/* global navigation */}
      <main>
        <article>{children}</article>
      </main>
      {/* 푸터설정 */}
      <Footer>
        <Toggle />
      </Footer>

      {/* 레이어팝업 */}
      <Popup {...props} />
    </Container>
  )
}
export default Layout
//---------------------------------------------------------------------
const Logo = styled.div`
  margin: 60px 0 50px 0;
  text-align: center;
`
const Container = styled.div`
  width: 400px;
  margin: 0 auto;
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
  @media (max-width: ${WIDTH_MOBILE}) {
    width: 90%;
  }
`
const Footer = styled.footer`
  text-align: center;
`
