import React, {useState, useEffect, useMemo} from 'react'
import styled from 'styled-components'

import {IMG_SERVER} from 'context/config'

export default props => {
  const {setPage, records, totalPage, currentPage} = props
  const MaxPageNumber = useMemo(() => Math.ceil(totalPage / records), [totalPage])
  const shareByRecords = useMemo(() => Math.ceil(currentPage / records), [currentPage])
  console.log('share', shareByRecords, totalPage)

  if (records === undefined) {
    throw new Error('Need a records')
  } else if (totalPage === undefined) {
    throw new Error('Need a total page')
  } else if (currentPage === undefined) {
    throw new Error('Need a current page')
  } else if (setPage === undefined) {
    throw new Error('Need a setPage func')
  }

  const changePage = pageNumber => {
    if (currentPage !== pageNumber) {
      setPage(pageNumber)
    }
  }
  const prev = () => {
    if (currentPage !== 1) {
      changePage(currentPage - 1)
    }
  }
  const next = () => {
    if (currentPage < MaxPageNumber) {
      changePage(currentPage + 1)
    }
  }

  return (
    <Container>
      <Left onClick={prev} />
      {[...Array(MaxPageNumber < records ? MaxPageNumber : records).keys()].map(value => (
        <Page
          key={value}
          onClick={() => changePage(currentPage + value)}
          className={currentPage === value + 1 ? 'active' : ''}></Page>
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
