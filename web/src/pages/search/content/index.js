import React, {useState, useEffect, useContext} from 'react'
import styled from 'styled-components'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
import SearchTab from './searchTab'
import NoResult from './noResult'
import Page from './pagination'
import Total from './total' // 검색결과 통합
import Fill from './filter'

import {Context} from 'context'
import API from 'context/api'
export default props => {
  const context = useContext(Context)

  return (
    <Container>
      <SearchWrap>
        <h1>검색</h1>
        <Fill {...props} />
        {/* <Page /> */}
      </SearchWrap>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
`
const SearchWrap = styled.div`
  display: flex;
  width: 1210px;
  height: 100%;
  flex-direction: column;
  @media (max-width: 1240px) {
    width: 95%;
  }
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
