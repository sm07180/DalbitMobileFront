import React, {useMemo} from 'react'
import styled from 'styled-components'

import {IMG_SERVER} from 'context/config'

const PageBtnMaxLength = 5

export default props => {
  const {setPage, totalPage, currentPage} = props

  if (setPage === undefined) {
    throw new Error('Need a setPage func')
  } else if (totalPage === undefined) {
    throw new Error('Need a totalPage')
  } else if (currentPage === undefined) {
    throw new Error('Need a currentPage')
  }

  const removedLastDigitPageNumber = useMemo(() => Math.floor((currentPage - 1) / PageBtnMaxLength) * PageBtnMaxLength, [
    currentPage
  ])

  const NumberOfPageBtn = useMemo(() => {
    if (totalPage < removedLastDigitPageNumber + PageBtnMaxLength) {
      return totalPage % PageBtnMaxLength
    } else {
      return PageBtnMaxLength
    }
  })

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
    if (currentPage < totalPage) {
      changePage(currentPage + 1)
    }
  }

  return (
    <Container>
      <Left onClick={prev} />
      {[...Array(NumberOfPageBtn).keys()].map(value => {
        const pageNumber = removedLastDigitPageNumber + value + 1
        return (
          <Page
            key={value}
            onClick={() => changePage(pageNumber)} // !!!
            className={currentPage == pageNumber ? 'active' : ''}>
            {pageNumber}
          </Page>
        )
      })}
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
  user-select: none;

  &.active {
    color: #fff;
    border-color: #8556f6;
    background-color: #8556f6;
  }
`
