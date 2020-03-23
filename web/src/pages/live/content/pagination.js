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
    setPage(index)
  }

  const prev = () => {
    setPage(page - 1)
  }

  const next = () => {
    setPage(page + 1)
  }

  useEffect(() => {}, [])

  useEffect(() => {
    setPage(1)
  }, [props.type])

  //------------------------------------------------------------ components start
  return (
    <Container>
      <Left onClick={() => prev()} />
      {/* <div className="page"> */}
      {/* </div> */}
      <Right onClick={() => next()} />
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  margin: 40px 0;
  width: 100%;
  justify-content: center;

  .page {
    display: flex;
    height: 36px;
    justify-content: space-between;
  }
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

const Page = styled.button`
  display: flex;
  width: 36px;
  height: 36px;
  border-style: solid;
  border-width: 1px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 400;
  line-height: 2.14;
  letter-spacing: -0.35px;
  margin: 0px 2px 0px 2px;

  border-color: ${props => (props.active ? 'none' : '#e0e0e0')};
  background: ${props => (props.active ? '#8556f6' : '#fff')};
  color: ${props => (props.active ? '#fff' : '#bdbdbd')};
`
