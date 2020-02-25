/**
 *
 *
 * document.dispatchEvent(new Event('native-goLogin'))
 */
import React, {useEffect, useContext, useState} from 'react'
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
// etc
import SignalingHandler from 'components/lib/SignalingHandler'
// image
import stopSvg from 'images/ic_close_b.svg'

const Layout = props => {
  //context
  const context = useContext(Context)
  const {mediaHandler, mediaPlayerStatus} = context
  //initalize
  const {children} = props
  //---------------------------------------------------------------------

  useEffect(() => {
    if (!mediaHandler) {
      const mediaHandler = new SignalingHandler()
      mediaHandler.setGlobalStartCallback(() => context.action.updateMediaPlayerStatus(true))
      mediaHandler.setGlobalStopCallback(() => context.action.updateMediaPlayerStatus(false))
      context.action.updateMediaHandler(mediaHandler)
    }
    return () => {}
  }, [])
  //---------------------------------------------------------------------

  let pathCheck = window.location.pathname.indexOf('/broadcast') < 0 ? true : false
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
      <Footer Ftype="mainFooter" />

      {/* 미디어 플레이어 */}
      {pathCheck && mediaPlayerStatus && mediaHandler && mediaHandler.rtcPeerConn && (
        <MediaPlayerWrap>
          <MediaPlayer>
            {mediaHandler.type === 'listener' && (
              <>
                <img style={{width: '60px', borderRadius: '50%'}} src={mediaHandler.connectedHostImage} />
                <img
                  src={stopSvg}
                  style={{
                    cursor: 'pointer',
                    marginLeft: 'auto',
                    width: '36px',
                    height: '36px'
                  }}
                  onClick={() => {
                    console.log(mediaHandler)
                    if (mediaHandler.rtcPeerConn) {
                      mediaHandler.stop()
                    }
                  }}
                />
              </>
            )}
          </MediaPlayer>
        </MediaPlayerWrap>
      )}
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
    }
    /* 컨텐츠내용 */
    article {
      position: relative;
    }
  }
  /* main.sub {
    
  } */
`
const MediaPlayerWrap = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 20px;
  width: 100%;
  z-index: 100;
`
const MediaPlayer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  padding: 14px 32px;
  box-sizing: border-box;
  width: 90%;
  border-radius: 44px;
  background-color: rgba(0, 0, 0, 0.85);
  color: #fff;

  @media (max-width: 780px) {
    width: 100%;
  }
`
