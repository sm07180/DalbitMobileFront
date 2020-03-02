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
  //state
  const [result, setResult] = useState(false)
  //검색결과가 있냐없냐를 result 값의 true/false로 벨리데이션을 setstate 해서 resultType의 값 변화에 따라 탭을 호출할껀지 결과없음을 호출할껀지..
  const [resultType, setResultType] = useState(0)
  //Click-function
  const checkResult = () => {
    if (!result) {
      setResultType(2)
    } else {
      setResultType(1)
    }
  }

  // const [broadList, setBroadList] = useState(null)
  // const [list, setPosts] = useState([])
  // async function fetchData(obj) {
  //   const res = await API.broad_list({
  //     url: '/broad/list',
  //     method: 'get'
  //   })
  //   if (res.result === 'success') {
  //     setBroadList(res.data)
  //   }
  //   console.log(res)
  //   console.log(res.data.list)
  //   setPosts(res.data.list)
  // }

  // useEffect(() => {
  //   fetchData({
  //     data: {
  //       roomType: '',
  //       page: 1,
  //       records: 10
  //     }
  //   })
  // }, [])
  return (
    <Container>
      <SearchWrap>
        <Fill onClick={checkResult} setValue={setResult} />
        {resultType === 1 ? <SearchTab /> : ''}
        {resultType === 2 ? <NoResult /> : ''}
        <Page />
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
const SearchBar = styled.div`
  display: flex;
  width: 100%;
  height: 68px;
  border-style: solid;
  border-color: #8556f6;
  border-width: 3px;
  justify-content: space-between;
  align-items: center;
  padding-left: 20px;
  padding-right: 10px;

  & > input {
    width: 95%;
    height: 100%;
    font-size: 24px;
    font-weight: 600;
    line-height: 1;
    letter-spacing: -0.6px;
    text-align: left;
    color: #8556f6;
    outline: none;
  }
`
const Icon = styled.button`
  display: flex;
  width: 48px;
  height: 48px;
  background: url('https://devimage.dalbitcast.com/svg/ic_search_normal.svg');
`
