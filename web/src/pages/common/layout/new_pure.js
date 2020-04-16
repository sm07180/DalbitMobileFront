/**
 *
 */
import React, {useMemo, useEffect, useContext, useState} from 'react'
import styled from 'styled-components'
import {NavLink} from 'react-router-dom'

//context
import {IMG_SERVER, WIDTH_TABLET, WIDTH_MOBILE} from 'context/config'
import {Context} from 'context'
import Footer from 'pages/common/footer'

//layout
import Popup from 'pages/common/popup'
import Message from 'pages/common/message'
import qs from 'query-string'

import {Hybrid, isHybrid} from 'context/hybrid'
import closeBtn from 'pages/menu/static/ic_close.svg'

const Layout = props => {
  const {logo_status} = props

  //context
  const context = useContext(Context)
  //initalize
  const {children} = props
  const {webview} = qs.parse(location.search)

  const clickCloseBtn = () => {
    if (isHybrid() && webview && webview === 'new') {
      Hybrid('CloseLayerPopup')
    } else {
      window.history.back()
    }
  }

  return (
    <Container className="pure">
      {/* 닫기버튼 */}

      {/* 헤더설정 */}
      {logo_status !== 'no' && (
        <Logo>
          <NavLink to="/" exact>
            <img src={`${IMG_SERVER}/images/api/logo_p_l.png`} className="logo" />
          </NavLink>
        </Logo>
      )}
      {/* global navigation */}
      <main>
        <article>{children}</article>
      </main>
      {/* 푸터설정 */}
      {/* <Footer Ftype="loginFooter"></Footer> */}
      {/* 레이어팝업 */}
      <Popup {...props} />
      {/* 메시지팝업 */}
      <Message {...props} />
    </Container>
  )
}
export default Layout
//---------------------------------------------------------------------
const CloseButton = styled.button`
  position: absolute;
  right: 8px;
  top: 18px;
  width: 30px;
  height: 30px;
  display: inline-block;
  text-indent: -9999px;
  &:before,
  &:after {
    position: absolute;
    top: 0;
    left: 15px;
    content: ' ';
    height: 30px;
    width: 1px;
    background-color: #959595;
  }
  &:before {
    transform: rotate(45deg);
  }
  &:after {
    transform: rotate(-45deg);
  }
`
const Logo = styled.div`
  padding: 70px 0 50px 0;
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
      width: 91.111%;
    }
  }
  .close-btn {
    position: absolute;
    right: 4.444%;
    top: 5px;
  }
  .logo {
    width: 150px;
  }
`
