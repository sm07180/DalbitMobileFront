import React, {useState, useEffect, useContext} from 'react'
import styled from 'styled-components'
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
        <Fill>
        </Fill>
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
  width: 70%;
  height: 100%;
  flex-direction: column;

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
