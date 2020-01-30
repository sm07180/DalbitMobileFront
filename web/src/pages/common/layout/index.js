/**
 *
 */
import React, {useEffect, useContext} from 'react'
import styled from 'styled-components'
//context
import {WIDTH_MOBILE} from 'context/config'
import {WIDTH_TABLET} from 'context/config'
import {WIDTH_PC} from 'context/config'
import {WIDTH_PC2} from 'context/config'
import {Context} from 'context'
import {HEADER_HEIGHT} from 'context/config'
//layout
import Header from 'pages/common/header'
import Footer from 'pages/common/footer'
import Gnb from 'pages/common/gnb'
import Popup from 'pages/common/popup'
//
const Layout = props => {
  //context
  const context = useContext(Context)
  //initalize
  const {children} = props
  //---------------------------------------------------------------------
  function update(event) {
    switch (event.type) {
      case 'react-gnb-open': //GNB 열기
        context.action.updateGnbVisible(true)
        break
      case 'react-gnb-close': //GNB 닫기
        context.action.updateGnbVisible(false)
        break
      default:
        break
    }
    console.log(event.type)
  }
  useEffect(() => {
    /**
     * @code document.dispatchEvent(new Event('react-gnb-open'))
     */
    document.addEventListener('react-gnb-open', update)
    document.addEventListener('react-gnb-close', update)
    return () => {
      document.removeEventListener('react-gnb-open', update)
      document.removeEventListener('react-gnb-close', update)
    }
  }, [])
  //---------------------------------------------------------------------
  return (
    <Container>
      {/* 헤더설정 */}
      <Header {...props} />
      {/* global navigation */}
      <Gnb />
      <main className={props.type == 'main' ? 'main' : 'sub'}>
        <article>{children}</article>
      </main>
      {/* 푸터설정 */}
      <Footer />
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
    @media (max-width: ${WIDTH_PC}) {
      width: 100%;
      padding-left: 0;
    }
    @media (max-width: ${WIDTH_PC2}) {
      width: 100%;
    }
    @media (max-width: ${WIDTH_TABLET}) {
      width: 100%;
    }
    @media (max-width: ${WIDTH_MOBILE}) {
      width: 100%;
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
