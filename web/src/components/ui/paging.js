import React, {useState, useEffect} from 'react'
import styled from 'styled-components'

import {IMG_SERVER} from 'context/config'

const defaultPageLength = 10

export default props => {
  const {prevClickEvent, nextClickEvent, btnClickEvent, totalPage, currentPage, currentIdx} = props

  if (totalPage === undefined) {
    throw new Error('Need a total page')
  } else if (currentPage === undefined) {
    throw new Error('Need a current page')
  } else if (currentIdx === undefined) {
    throw new Error('Need a current idx')
  } else if (prevClickEvent === undefined) {
    throw new Error('Need a prev click event')
  } else if (nextClickEvent === undefined) {
    throw new Error('Need a next click event')
  } else if (btnClickEvent === undefined) {
    throw new Error('Need a btn click event')
  }

  const numberOfBtn = totalPage > defaultPageLength ? [...Array(defaultPageLength).keys()] : [...Array(totalPage).keys()]

  const prev = () => {
    prevClickEvent()
  }
  const next = () => {
    nextClickEvent()
  }
  const targetEvent = () => {
    btnClickEvent()
  }

  return (
    <Container>
      <Left onClick={prev} />
      {numberOfBtn.map(value => (
        <Page key={value} onClick={targetEvent} className={currentIdx === value + 1 ? 'active' : ''}>
          {value + 1}
        </Page>
      ))}
      <Right onClick={next} />
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  margin: 40px 0;
  width: 100%;
  justify-content: center;
  align-items: center;
`
const Left = styled.button`
  display: flex;
  width: 30px;
  height: 30px;
  justify-content: center;
  align-items: center;
  margin-right: 4px;
  cursor: pointer;
  background: url(${IMG_SERVER}/images/api/left.png);
  background-repeat: no-repeat;
  background-position: center;
`
const Right = styled.button`
  display: flex;
  width: 30px;
  height: 30px;
  justify-content: center;
  margin-left: 4px;
  cursor: pointer;
  background-image: url(${IMG_SERVER}/images/api/right.png);
  background-repeat: no-repeat;
  background-position: center;
`

const Page = styled.button`
  color: #e0e0e0;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  width: 36px;
  height: 36px;
  margin: 0 4px;

  &.active {
    color: #fff;
    border-color: #8556f6;
    background-color: #8556f6;
  }
`
