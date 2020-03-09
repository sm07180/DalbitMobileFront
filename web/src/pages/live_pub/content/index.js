import React, {useEffect, useContext, useState} from 'react'
import styled from 'styled-components'
import {WIDTH_MOBILE} from 'context/config'
import Api from 'context/api'
import {Context} from 'context'
import {isHybrid, Hybrid} from 'context/hybrid'
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
    console.log('## obj :', obj)
    const res = await Api.broad_list({...obj})
    //Error발생시
    if (res.result === 'fail') {
      console.log(res.message)
      return
    }

    //데이터 없을시
    if (res.code === '0') {
      setList(false)
    }
    console.log('## res :', res)
    setList(res.data)
  }

  const commonData = async obj => {
    const res = await Api.splash({})
    if (res.result === 'success') {
      console.log('## res :', res.data)
      context.action.updateCommon(res.data)
    }
  }

  //exitRoom
  async function exitRoom(obj) {
    const res = await Api.broad_exit({data: {...obj}})
    if (res.result === 'success') {
      return res
    }
    alert(res.message)
  }

  //joinRoom
  async function joinRoom(obj) {
    const {roomNo} = obj
    const res = await Api.broad_join({data: {roomNo: roomNo}})
    console.log('roomNo = ' + roomNo)
    //Error발생시 (방이 입장되어 있을때)
    if (res.result === 'fail' && res.messageKey === 'broadcast.room.join.already') {
      const exit = await exitRoom(obj)
      if (exit.result === 'success') joinRoom(obj)
    }
    //Error발생시 (종료된 방송)
    if (res.result === 'fail' && res.messageKey === 'broadcast.room.end') alert(res.message)
    //정상진입이거나,방탈퇴이후성공일경우
    if (res.result === 'success') {
      if (isHybrid()) {
        Hybrid('RoomJoin', res.data)
      } else {
        //하이브리드앱이 아닐때
        const {roomNo} = res.data
        context.action.updateBroadcastreToken(res.data)
        props.history.push(`/broadcast?roomNo=${roomNo}`, res.data)
      }
    }
    return
  }

  useEffect(() => {
    getBroadList({params: {roomType: '', page: 1, records: 10}})
    commonData()
  }, [])

  useEffect(() => {}, [list])
  //----------------------------------------------------------- components start
  console.log('## context :', context)
  return (
    <Container>
      <Title title={'라이브'} />
      <Wrap>
        <MainContents>
          {list.list ? (
            <>
              <TopRank broadList={list} joinRoom={joinRoom} />
              <Live broadList={list} joinRoom={joinRoom} getBroadList={getBroadList} />
            </>
          ) : (
            <div>데이터 없음 ㅇㅅㅇ</div>
          )}

          {/* {list.list !== undefined && <TopRank broadList={list} joinRoom={joinRoom} />}
          {list.list !== undefined && <Live broadList={list} joinRoom={joinRoom} getBroadList={getBroadList} />} */}
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
