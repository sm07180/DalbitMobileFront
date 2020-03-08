import React, {useState, useEffect, useMemo} from 'react'
import styled from 'styled-components'
import {WIDTH_MOBILE, WIDTH_TABLET} from 'context/config'
const test = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
const mTest = [0, 1, 2, 3, 4]
//페이징 구현해야함 - 모듈 쓰세요 ~
export default props => {
  //------------------------------------------------------------ declare start
  const [page, setPage] = useState(0)
  const [sendPage, setSendPage] = useState(1)

  //------------------------------------------------------------ func start
  const getData = index => {
    setPage(index)
    setSendPage(index + 1)
  }

  const prev = () => {
    if (page === 0) return
    setPage(page - 1)
  }

  const next = () => {
    if (page === 9) return
    setPage(page + 1)
  }

  //------------------------------------------------------------ components start

  return (
    <Container>
      <div className="wrap">
        <div className="pagination">
          <Left onClick={() => prev()}>
            <div></div>
          </Left>
          <div className="page">
            {window.innerWidth > 600
              ? test.map((data, index) => {
                  return (
                    <Page key={index} onClick={() => getData(index)} active={page === index ? 'active' : ''}>
                      {index + 1}
                    </Page>
                  )
                })
              : mTest.map((data, index) => {
                  return (
                    <Page key={index} onClick={() => getData(index)} active={page === index ? 'active' : ''}>
                      {index + 1}
                    </Page>
                  )
                })}
          </div>
          <Right onClick={() => next()}>
            <div></div>
          </Right>
        </div>
      </div>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 200px;
  justify-content: center;

  .wrap {
    display: flex;
    width: 60%;
    height: 60%;
    justify-content: center;
    align-items: flex-end;

    @media (max-width: ${WIDTH_MOBILE}) {
        width: 80%;
    }
  }

  .pagination {
    display: flex;
    width: 40%;
    height: 100%;
    align-items: center;
    justify-content: center;
    @media (max-width: ${WIDTH_MOBILE}) {
        width: 90%;
    }
  }

  .page {
    display: flex;
    width: 100%;
    height: 36px;
    justify-content: space-between;

    /* & > button {
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

      border-color: ${props => (props.active ? 'none' : '#e0e0e0')};
      background: ${props => (props.active ? '#8556f6' : '#fff')};
      color: ${props => (props.active ? '#fff' : '#bdbdbd')};
    } */
  }
`
const Left = styled.button`
  display: flex;
  width: 36px;
  height: 37px;

  & > div {
    display: flex;
    width: 10px;
    height: 18px;
    background: url('https://devimage.dalbitcast.com/images/api/left.png') no-repeat;
  }
`
const Right = styled.button`
  display: flex;
  width: 36px;
  height: 37px;
  justify-content: flex-end;

  & > div {
    display: flex;
    width: 10px;
    height: 18px;
    background: url('https://devimage.dalbitcast.com/images/api/right.png') no-repeat;
  }
`
const Page = styled.button`
  display: flex;
  width: 36px;
  height: 36px;
  border-style: solid;
  /* border-color: #e0e0e0; */
  border-width: 1px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 400;
  line-height: 2.14;
  letter-spacing: -0.35px;
  /* color: #bdbdbd; */

  border-color: ${props => (props.active ? 'none' : '#e0e0e0')};
  background: ${props => (props.active ? '#8556f6' : '#fff')};
  color: ${props => (props.active ? '#fff' : '#bdbdbd')};
`
