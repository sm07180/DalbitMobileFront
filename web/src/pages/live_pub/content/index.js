import React, {useEffect, useContext, useState} from 'react'
import styled from 'styled-components'
import {WIDTH_MOBILE} from 'context/config'
import Api from 'context/api'
import {Context} from 'context'
//components
import Title from './title'
import TopRank from './topRank'
import Live from './live'
import Pagination from './pagination'

export default props => {
  //----------------------------------------------------------- declare start
  const [list, setList] = useState([])
  const context = useContext(Context)
  //----------------------------------------------------------- func start
  const getBroadList = async obj => {
    const res = await Api.broad_list({...obj})
    //Error발생시
    if (res.result === 'fail') {
      console.log(res.message)
      return
    }
    setList(res.data)
  }

  const commonData = async obj => {
    const res = await Api.splash({})
    if (res.result === 'success') {
      console.log('## res :', res.data)
      context.action.updateCommon(res.data)
    }
  }

  useEffect(() => {
    getBroadList({params: {roomType: '', page: 1, records: 10}})
    commonData()
  }, [])
  //----------------------------------------------------------- components start
  console.log('## context :', context)
  return (
    <Container>
      <Title title={'라이브'} />
      <Wrap>
        <MainContents>
          {list.list !== undefined && <TopRank broadList={list} />}
          {list.list !== undefined && <Live broadList={list} />}
        </MainContents>
      </Wrap>
      <Pagination />
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

const MainContents = styled.div`
  @media (max-width: ${WIDTH_MOBILE}) {
    width: 100%;
    align-items: flex-start;
  }
  display: flex;
  width: 80%;
  height: 100%;
  align-items: flex-start;
  flex-direction: column;
`
const Wrap = styled.div`
  display: flex;
  width: 90%;
  height: 100%;
  justify-content: center;
`
