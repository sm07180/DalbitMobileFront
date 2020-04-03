/**
 *
 */
import React, {useMemo, useEffect, useContext, useState} from 'react'
import styled from 'styled-components'
import {NavLink} from 'react-router-dom'
//context
import {isHybrid, Hybrid} from 'context/hybrid'
import {IMG_SERVER, WIDTH_TABLET, WIDTH_MOBILE} from 'context/config'
import {Context} from 'context'
import Footer from 'pages/common/footer'
//layout
import Popup from 'pages/common/popup'
import Message from 'pages/common/message'
//
const Layout = props => {
  const [show, setShow] = useState(false)
  //context
  const context = useContext(Context)
  //initalize
  const {children} = props

  // ~~/navigator/?router=/login 형태로 넘어올때
  const isNavigator = useMemo(() => {
    return isHybrid()
    // if (props.location.state === undefined) return false
    // if (props.location.state.type !== undefined && props.location.state.type === 'native-navigator') return true
  })
  //---------------------------------------------------------------------

  useEffect(() => {}, [])
  //---------------------------------------------------------------------
  return (
    <Container className="pure">
      {/* 닫기버튼 */}
      {isNavigator && (
        <CloseButton
          onClick={() => {
            Hybrid('CloseLayerPopup', '')
          }}>
          닫기
        </CloseButton>
      )}

      {/* 헤더설정 */}
      <Logo>
        <NavLink to="/new" exact>
          <img src={`${IMG_SERVER}/images/api/logo_p_l.png`} />
        </NavLink>
      </Logo>
      {/* global navigation */}
      <main>
        <article>{children}</article>
      </main>
      {/* 푸터설정 */}
      <Footer Ftype="loginFooter"></Footer>
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
  padding: 60px 0 50px 0;
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
