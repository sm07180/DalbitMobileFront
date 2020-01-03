/**
 *
 */
import React, {useEffect, useContext} from 'react'
import styled from 'styled-components'
//context
import {Context} from 'Context'
//layout
import Header from 'Pages/common/header'
import Footer from 'Pages/common/footer'

const Layout = props => {
  //initalize
  const {children} = props
  //---------------------------------------------------------------------
  return (
    <Container>
      {/* 헤더설정 */}
      <Header />
      <main>
        <article>{children}</article>
      </main>
      {/* 푸터설정 */}
      <Footer />
    </Container>
  )
}
export default Layout
//---------------------------------------------------------------------
const Container = styled.div`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
`
