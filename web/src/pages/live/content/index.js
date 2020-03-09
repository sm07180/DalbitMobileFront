/**
 * @file chat.js
 * @brief 채팅
 * test
 */
import React, {useEffect, useContext, useState} from 'react'
import styled from 'styled-components'
//context
import {isHybrid, Hybrid} from 'context/hybrid'
//import {Context} from 'pages/live/store'
import {Context} from 'context'
//components
import Api from 'context/api'

//
export default props => {
  //---------------------------------------------------------------------
  //context
  //const store = useContext(Context)
  const context = useContext(Context)
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
    if (res.result === 'success') {
      console.log(res.data)
      setFetch(res.data)
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

  //makeContents
  const makeContents = type => {
    if (fetch === null) return
    return fetch.list.map((list, idx) => {
      let mode = '해당사항없음'
      const {state, roomNo, gstProfImg, bjProfImg, welcomMsg, bgImg, title} = list
      if (state === 1) mode = '라이브중'
      if (state === 2) mode = '2'
      if (state === 3) mode = '3'
      if (state === 4) mode = '4'
      if (state === 5) mode = '비정상종료'
      //
      if (state === 1 || state === '1') {
        return (
          <List
            key={idx}
            style={{backgroundImage: `url(${bgImg.url})`}}
            onClick={() => {
              joinRoom(list)
            }}>
            <h3>[{mode}]</h3>
            <h1>{title}</h1>
            <h2>{welcomMsg}</h2>
            {gstProfImg.thumb190x190 !== '' && (
              <Profile>
                <img src={`${gstProfImg.thumb190x190}`} alt="" />
              </Profile>
            )}
            <h3>{roomNo}</h3>
          </List>
        )
      }
    })
  }
  //---------------------------------------------------------------------
  /**
   *
   * @returns
   */
  useEffect(() => {
    //방송방 리스트
    getBroadList({params: {roomType: '', page: 1, records: 10}})
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

        {makeContents()}
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
  min-height: 100px;
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
