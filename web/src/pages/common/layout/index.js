/**
 *
 *
 * document.dispatchEvent(new Event('native-goLogin'))
 * @todo useEffect
 mediaHandler : webRTC 통제 (브라우져,모바일웹, App(x))
 mediaPlayerStatus (bool: true/false) 
 */
/**
 *
 */
import React, {useMemo, useContext, useEffect} from 'react'
import styled from 'styled-components'
//context
import {Context} from 'context'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
//layout
import Header from 'pages/common/header'
import Footer from 'pages/common/footer'
import Gnb from 'pages/common/gnb'
import Popup from 'pages/common/popup'
import Message from 'pages/common/message'

const Layout = props => {
  const {children} = props
  const context = useContext(Context)
  //

  //---------------------------------------------------------------------
  return (
    <Container>
      {/* 헤더설정 */}
      <Header {...props} />
      {/* global navigation */}
      <Gnb {...props} />
      <main className={props.type == 'main' ? 'main' : 'sub'}>
        <article>{children}</article>
      </main>
      {/* 푸터설정 */}
      {<Footer Ftype="mainFooter" />}
      {/* 레이어팝업 */}
      <Popup {...props} />
      {/* 메시지팝업 */}
      <Message {...props} />
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
    padding-top: 80px;
    z-index: 1;
    @media (max-width: ${WIDTH_PC}) {
      width: 100%;
      padding-left: 0;
    }
    @media (max-width: ${WIDTH_PC_S}) {
      width: 100%;
    }
    @media (max-width: ${WIDTH_TABLET_S}) {
      padding-top: 56px;
      width: 100%;

      .on-cast & {
        padding-top: 0;
      }
    }
    /* 컨텐츠내용 */
    article {
      position: relative;
    }
  }
  /* main.sub {
    
  } */
`
