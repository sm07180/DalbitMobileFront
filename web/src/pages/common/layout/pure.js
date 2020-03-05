/**
 *
 */
import React, {useMemo, useEffect, useContext, useState} from 'react'
import styled from 'styled-components'
import {NavLink} from 'react-router-dom'
//context
import {Hybrid} from 'context/hybrid'
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
    if (props.location.state === undefined) return false
    if (props.location.state.type !== undefined && props.location.state.type === 'native-navigator') return true
    return false
  })
  //---------------------------------------------------------------------

  useEffect(() => {
    console.log(isNavigator)
  }, [])
  //---------------------------------------------------------------------
  return (
    <Container className="pure">
      {/* 닫기버튼 */}
      {isNavigator && (
        <CloseButton
          onClick={() => {
            Hybrid('CloseLayerPopup')
          }}>
          닫기
        </CloseButton>
      )}

      {/* 헤더설정 */}
      <Logo>
        <NavLink to="/" exact>
          <img src={`${IMG_SERVER}/images/api/ic_logo_normal.png`} />
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
  right: 30px;
  top: 30px;
  display: inline-block;
  padding: 10px;
  background: #000;
  color: #fff;
`
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
