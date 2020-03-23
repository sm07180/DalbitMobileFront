import React, {useState, useEffect, useMemo} from 'react'
import styled from 'styled-components'
import {WIDTH_MOBILE, WIDTH_TABLET} from 'context/config'
import {IMG_SERVER} from 'context/config'
// 페이징 임시적으로 구현
export default props => {
  //------------------------------------------------------------ declare start
  const [page, setPage] = useState(1)

  //------------------------------------------------------------ func start
  const getData = index => {
    // setPage(index)
  }

  const prev = () => {
    // setPage(page - 1)
  }

  const next = () => {
    // setPage(page + 1)
  }

  useEffect(() => {}, [])

  useEffect(() => {
    // setPage(1)
  }, [props.type])

  //------------------------------------------------------------ components start
  return (
    <Container>
      <Left onClick={() => prev()} />
      <Right onClick={() => next()} />
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  margin: 40px 0;
  width: 100%;
  justify-content: center;
`
const Left = styled.button`
  display: flex;
  width: 30px;
  height: 30px;
  justify-content: center;
  align-items: center;
  margin-right: 5px;
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
  margin-left: 5px;
  cursor: pointer;
  background-image: url(${IMG_SERVER}/images/api/right.png);
  background-repeat: no-repeat;
  background-position: center;
`

const Page = styled.button``
