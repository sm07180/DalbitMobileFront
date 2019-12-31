/**
 *
 */
import React, {useEffect, useContext} from 'react'
import styled from 'styled-components'
//context
import {Context} from '@/context'
//layout
import Header from '@/pages/common/header'
import Footer from '@/pages/common/footer'

const Layout = props => {
  //initalize
  const {children} = props
  const store = useContext(Context)
  //---------------------------------------------------------------------

  //---------------------------------------------------------------------
  return (
    <Container>
       {/* 헤더설정 */}
      <Header/>
       <main>
        <article>{children}</article>
        </main>
      {/* 푸터설정 */}
      <Footer/>
    </Container>
  )
}
export default Layout
//
const Container =styled.div `
  width:100%;
  height:100%;
  box-sizig:border-box;
  main{
    border:1px solid #111;
  }
`