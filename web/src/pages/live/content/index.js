/**
 * @file chat.js
 * @brief 채팅
 * test
 */
import React, {useEffect, useContext, useState} from 'react'
import styled from 'styled-components'
//context
import {Context} from 'pages/live/store'
//components
import Api from 'context/api'

//
export default props => {
  //---------------------------------------------------------------------
  //context
  const store = useContext(Context)
  //useState
  const [roomId, setRoomId] = useState(null)
  const [fetch, setFetch] = useState(null)
  //---------------------------------------------------------------------
  //getBroadList
  async function getBroadList(obj) {
    const res = await Api.broad_list({...obj})
    //Error발생시
    if (res.result === 'fail') {
      console.log(res.message)
      return
    }
    setFetch(res.data)
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
    //Error발생시 (방이 입장되어 있을때)
    if (res.result === 'fail' && res.messageKey === 'broadcast.room.join.already') {
      const exit = await exitRoom(obj)
      if (exit.result === 'success') joinRoom(obj)
    }
    //Error발생시 (종료된 방송)
    if (res.result === 'fail' && res.messageKey === 'broadcast.room.end') alert(res.message)
    //정상진입이거나,방탈퇴이후성공일경우
    if (res.result === 'success') {
      console.log(res.data)
      const {roomNo} = res.data
      if (obj.type === 'cast') {
        props.history.push(`/cast`, res.data)
      } else {
        props.history.push(`/broadcast/${roomNo}`, res.data)
      }
    }
    return
  }

  //makeContents
  const makeContents = type => {
    if (fetch === null) return
    return fetch.list.map((list, idx) => {
      const {state, roomNo, bjProfImg, welcomMsg, bgImg, title} = list
      switch (state) {
        case 1: //-------------------방송중
          list.state = '방송중'
        case 2: //-------------------방송준비중
          list.state = '방송준비중'
        case 3: //-------------------통화중
          list.state = '통화중'
        case 4: //-------------------방송종료
          list.state = '방송종료'
        case 5: //-------------------비정상 (DJ종료상태)
          list.state = '종료된방송'
          break

        default:
          break
      }
      list.type = type
      return (
        <List
          key={idx}
          style={{backgroundImage: `url(${bgImg.thumb700x700})`}}
          onClick={() => {
            joinRoom(list)
          }}>
          <h3>[{list.state}]</h3>
          <h1>{title}</h1>
          <h2>{welcomMsg}</h2>
          <Profile>
            <img src={`${bjProfImg.url}`} alt="" />
          </Profile>
          <h3>{roomNo}</h3>
        </List>
      )
    })
  }
  //---------------------------------------------------------------------
  /**
   *
   * @returns
   */
  useEffect(() => {
    //방송방 리스트
    getBroadList({data: {page: 1, records: 30}})
    //fetchData({params: {roomType: 0, page: 1, records: 10}})
  }, [])
  //---------------------------------------------------------------------
  return (
    <Content>
      <div className="wrap">
        {/* <Button
          onClick={() => {
            //fetch
            async function fetchData(obj) {
              const res = await Api.broad_exit({...obj})
              console.log(res)
              alert(res.message)
            }
            fetchData({data: {roomNo: roomId}})
          }}>
          방나가기
        </Button> */}
        <h1>방송방 리스트 /broadcast/:title 이동</h1>
        {makeContents()}
        <hr></hr>
        <h1>방송방 리스트 /cast 이동</h1>
        {makeContents('cast')}
      </div>
    </Content>
  )
}
//---------------------------------------------------------------------
const Content = styled.div`
  max-width: 1920px;
  width: 100%;
  padding: 0 50px;
  box-sizing: border-box;
  hr {
    margin: 50px 0;
    border-bottom: 1px solid #000;
  }
  .wrap {
    min-height: 200px;
    background: #e1e1e1;
  }
`
const Button = styled.button`
  display: block;
  width: 100%;
  font-size: 16px;
  padding: 20px 0;
  color: #fff;
  background: #ff0000;
`
const List = styled.button`
  display: inline-block;
  margin: 10px;
  max-width: 150px;
  width: 150px;

  padding: 10px;
  vertical-align: top;
  background-size: cover;
  box-sizing: border-box;

  h1 {
    font-size: 14px;
    color: #ff0000;
  }
  h2 {
    font-size: 12px;
    color: blue;
  }
  h3 {
    display: block;
    font-size: 12px;
    color: #fff;
    background: #000;
  }
  img {
    width: 100%;
    height: auto;
    vertical-align: top;
  }
`
const Profile = styled.span`
  display: inline-block;
  width: 50px;
  height: 50px;

  img {
    width: 100%;
    height: auto;
    vertical-align: top;
  }
`
