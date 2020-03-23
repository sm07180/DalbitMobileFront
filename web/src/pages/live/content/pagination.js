import React, {useState, useEffect, useMemo} from 'react'
import styled from 'styled-components'
import {WIDTH_MOBILE, WIDTH_TABLET} from 'context/config'
import {IMG_SERVER} from 'context/config'
// 페이징 임시적으로 구현
export default props => {
  const {current, total, records} = props

  const prev = () => {
    if (total <= records) return
  }

  const next = () => {
    if (total <= records) return
  }

  const clickPageBtn = pageIdx => {
    if (total <= records) return
    props.setCurrentPage(pageIdx)
  }

  useEffect(() => {}, [])

  //------------------------------------------------------------ components start
  return (
    <Container>
      <Left onClick={() => prev()} />
      {[...Array(Math.ceil(total / records)).keys()].map(value => {
        return (
          <Page key={value} className={current === value + 1 ? 'active' : ''} onClick={() => clickPageBtn(value + 1)}>
            {value + 1}
          </Page>
        )
      })}
      <Right onClick={() => next()} />
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
