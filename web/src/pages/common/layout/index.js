/**
 *
 */
import React, {useEffect, useContext} from 'react'
import styled from 'styled-components'
//context
import {Context} from 'context'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
//layout
import Header from 'pages/common/header'
import Footer from 'pages/common/footer'
import Gnb from 'pages/common/gnb'
import Popup from 'pages/common/popup'
//
const Layout = props => {
  //context
  const context = useContext(Context)
  const {mediaHandler} = context
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
      <Footer Ftype="mainFooter" />

      {/* 미니멀 플레이어 */}
      {mediaHandler && mediaHandler.rtcPeerConn && <MediaPlayer />}

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
      padding-top: 64px;
      width: 100%;
    }
    @media (max-width: ${WIDTH_MOBILE_S}) {
      padding-top: 56px;
    }
    /* 컨텐츠내용 */
    article {
      position: relative;
    }
  }
  /* main.sub {
    
  } */
`
const MediaPlayer = styled.div`
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 100;
  width: 300px;
  height: 100px;
  box-shadow: 4px 4px 10px #aaa;
  background-color: #fff;
`
