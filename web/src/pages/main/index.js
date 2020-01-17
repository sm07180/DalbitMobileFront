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
import {DEVICE_MOBILE} from 'Context/config'
//components

const Main = props => {
  console.log(props)
  //---------------------------------------------------------------------
  //---------------------------------------------------------------------
  return (
    <Layout {...props}>
      <h1>
        <a
          onClick={() => {
            props.history.push('/guide', {title: 'test', ddd: 'ccc'})
          }}>
          메인페이지
        </a>
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
`
const Wrap = styled.div`
  width: 1280px;
  margin: 0 auto;
  @media (max-width: 1440px) {
    width: 100%;
  }
  @media (max-width: 1000px) {
    width: 100%;
  }
  @media (max-width: ${DEVICE_MOBILE}) {
    width: 100%;
  }
`
const CBottom = styled.div`
  width: 100%;
  height: 300px;
`
