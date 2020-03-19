import React, {useState, useEffect, useMemo} from 'react'
import styled from 'styled-components'
import {WIDTH_MOBILE, WIDTH_TABLET} from 'context/config'
import {IMG_SERVER} from 'context/config'
// 페이징 임시적으로 구현
export default props => {
  //------------------------------------------------------------ declare start
  const [page, setPage] = useState(1)
  const [iterator, setIterator] = useState([])

  //------------------------------------------------------------ func start
  const getData = index => {
    setPage(index)
    props.getBroadList({params: {roomType: props.type, page: index, records: 10, searchType: props.searchType}}, true)
  }

  const prev = () => {
    if (page === 1) return
    props.getBroadList({params: {roomType: props.type, page: props.paging.prev, records: 10, searchType: props.searchType}}, true)
    setPage(page - 1)
  }

  const next = () => {
    if (page === props.paging.totalPage) return
    props.getBroadList({params: {roomType: props.type, page: props.paging.next, records: 10, searchType: props.searchType}}, true)
    setPage(page + 1)
  }

  useEffect(() => {
    if (props.paging !== undefined) {
      let arr = []

      // pc 페이징 10개씩
      if ((props.paging.page - 1) % 10 === 0) {
        arr = []
        let j = props.paging.page
        for (j; j <= props.paging.totalPage; j++) {
          arr.push(j)
        }
        setIterator(arr)
      } else if (props.paging.page % 10 === 0) {
        arr = []
        let k = props.paging.page - 9
        for (k; k <= props.paging.totalPage; k++) {
          arr.push(k)
        }
        setIterator(arr)
      }
    }
  }, [props.paging])

  useEffect(() => {
    setPage(1)
    setIterator([''])
  }, [props.type])

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
              ? iterator.slice(0, 10).map((data, index) => {
                  return (
                    <Page key={index} onClick={() => getData(data)} active={page === data ? 'active' : ''}>
                      {props.paging !== undefined && data}
                    </Page>
                  )
                })
              : iterator.slice(0, 5).map((data, index) => {
                  return (
                    <Page key={index} onClick={() => getData(data)} active={page === data ? 'active' : ''}>
                      {props.paging !== undefined && data}
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
    height: 36px;
    justify-content: space-between;
  }
`
const Left = styled.button`
  display: flex;
  width: 30px;
  height: 30px;
  justify-content: center;
  margin-right: 5px;

  & > div {
    display: flex;
    width: 10px;
    height: 18px;
    background: url(${IMG_SERVER}/images/api/left.png) no-repeat;
  }
`
const Right = styled.button`
  display: flex;
  width: 30px;
  height: 30px;
  justify-content: center;
  margin-left: 5px;

  & > div {
    display: flex;
    width: 10px;
    height: 18px;
    background: url(${IMG_SERVER}/images/api/right.png) no-repeat;
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
  margin: 0px 2px 0px 2px;

  border-color: ${props => (props.active ? 'none' : '#e0e0e0')};
  background: ${props => (props.active ? '#8556f6' : '#fff')};
  color: ${props => (props.active ? '#fff' : '#bdbdbd')};
`
