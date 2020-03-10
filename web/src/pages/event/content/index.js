import React, {useState, useEffect, useContext} from 'react'
import styled from 'styled-components'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
// import SearchTab from './searchTab'
// import NoResult from './noResult'
// import Page from './pagination'
// import Total from './total'
// import Fill from './filter'
import Tab from './tab'

import {Context} from 'context'
import API from 'context/api'
export default props => {
  const context = useContext(Context)

  return (
    <>
      <Container>
        <h1>이벤트</h1>
        <Tab {...props} />
        {/* <Pagination /> */}
        {/* <Fill {...props} /> */}
        {/* <Page /> */}
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
const SearchWrap = styled.div`
  display: flex;
  width: 1210px;
  height: 100%;
  flex-direction: column;
 
  /* @media (max-width: ${WIDTH_TABLET_S}) {
    width: 90%;
  }
  @media (max-width: ${WIDTH_MOBILE}) {
    width: 90%;
  } */
  & h1 {
    margin: 40px 0;
    text-align: center;
    color: #8556f6;
    font-size: 28px;
    font-weight: 600;
    letter-spacing: -0.7px;
  }
  .searchBar {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 189px;

    & > span {
      display: flex;
      width: 100%;
      height: 111px;
      justify-content: center;
      align-items: center;
      font-size: 28px;
      font-weight: 600;
      line-height: 0.86;
      letter-spacing: -0.7px;
      color: #8556f6;
    }
  }
`
