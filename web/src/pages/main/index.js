/**
 * @file main.js
 * @brief 메인페이지
 */
import React from 'react'
//layout
import Layout from 'Pages/common/layout'
import styled from 'styled-components'
import CTOP from './content/content-top'
import CMiddle from './content/content-middle'
//components

const Main = () => {
  //---------------------------------------------------------------------
  //---------------------------------------------------------------------
  return (
    <Layout>
      <h1>
        <a href="/guide">메인페이지</a>
      </h1>
      <Section>
        <Wrap>
          <CTOP></CTOP>
          <CMiddle></CMiddle>
          <CBottom></CBottom>
        </Wrap>
      </Section>
    </Layout>
  )
}
export default Main

const Section = styled.section`
  width: 100%;
  background-color: orange;
`
const Wrap = styled.div`
  width: 80%;
  background-color: skyblue;
  margin: 0 auto;
`
const CBottom = styled.div`
  width: 100%;
  height: 300px;
  background-color: lightpink;
`
