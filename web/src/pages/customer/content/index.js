import React, {useState, useEffect, useContext} from 'react'
import styled from 'styled-components'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'

import {Context} from 'context'
import API from 'context/api'
import Banner from './banner'
import Tab from './tab'
export default props => {
  const context = useContext(Context)

  return (
    <>
      <Container>
        <h1>고객센터</h1>
        <Banner />
        <Tab />
      </Container>
    </>
  )
}

const Container = styled.div`
  width: 1210px;
  margin: 0 auto;
  & h1 {
    margin: 40px 0;
    text-align: center;
    color: ${COLOR_MAIN};
    font-size: 28px;
    font-weight: 800;
    letter-spacing: -0.7px;
  }
  @media (max-width: 1240px) {
    width: 95%;
  }
`
