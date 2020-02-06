/**
 *
 */
import React, {useEffect, useContext, useState} from 'react'
import styled from 'styled-components'
import Toggle from '../footer/toggle-footer'
//context
import {IMG_SERVER, WIDTH_TABLET, WIDTH_MOBILE} from 'context/config'
import {Context} from 'context'
import {HEADER_HEIGHT} from 'context/config'
import Footer from 'pages/common/footer'
//layout
import Popup from 'pages/common/popup'
//
const Layout = props => {
  const [show, setShow] = useState(false)
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
      <Footer Ftype="loginFooter"></Footer>
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
  /* 메인페이지 */
  main {
    display: block;
    margin: 0 auto;
    width: 400px;
    z-index: 1;
    /* 컨텐츠내용 */
    article {
      position: relative;
    }
  }
  @media (max-width: ${WIDTH_MOBILE}) {
    main {
      width: 90%;
    }
  }
`
