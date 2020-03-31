/**
 * @file /event/index.js
 * @brief 이벤트
 */
import React, {useEffect, useState, useContext} from 'react'
//layout
import Layout from 'pages/common/layout'
//context
import {Context} from 'context'
import {BroadCastProvider} from './store'
//components
import Content from './content'
import qs from 'query-string'
import Api from 'context/api'
import {isHybrid, Hybrid} from 'context/hybrid'
import {BroadCastStore} from './store'

const sc = require('context/socketCluster') //socketCluster

export default props => {
  const ctx = useContext(Context)
  const store = useContext(BroadCastStore)

  //---------------------------------------------------------------------
  const [readyRoom, setReadyRoom] = useState(false)
  const {roomNo} = qs.parse(location.search) //라우터로 들어올때 방번호
  async function fetchData(obj) {
    console.clear()
    console.log('join')
    const resRoomJoin = await Api.broad_join(obj) //방입장
    const {code, result, data, message} = resRoomJoin
    //alert('roomNo = ' + roomNo)
    if (result === 'success') {
      console.log('방입장  = ' + data)
      ctx.action.updateBroadcastTotalInfo(data)
      ctx.action.updateRoomInfo(data)
      const TotalInfo = JSON.stringify(data)
      localStorage.setItem('BroadTotalInfo', TotalInfo)
      if (data) {
        if (isHybrid()) {
          alert('hybrid = ' + data)
          Hybrid('RoomJoin', data)
          setReadyRoom(false)
          if (window.location.pathname !== '/') {
            // 메인에서 방송방으로 접근시 예외 처리
            props.history.goBack()
          }
        } else {
          alert('no hybrid')

          setReadyRoom(true)
        }
      }
      localStorage.setItem('currentRoomNo', roomNo)
    } else {
      alert('code = ' + code)
      //참여 성공(0) ,회원 아닐시(-1),해당방 미존재(-2),종료된 방송(-3),이미 참여(-4),입장 제한(-5),나이 제한(-6)
      if (code !== '-1') {
        if (code === '-4') {
          //alert('code = ' + code)
          if (isHybrid()) {
            //alert('EnterRoom')
            setReadyRoom(false)
            //Hybrid('EnterRoom', '')
            //   //props.history.goBack()
          } else {
            //   alert('asdasdasdasd')
            //   context.action.updateReloadType(3)
            setReadyRoom(true)
            props.history.push('/broadcast/' + '?roomNo=' + roomNo)
          }
        } else {
          ctx.action.alert({
            callback: () => {
              props.history.goBack()
            },
            msg: message
          })
        }
      }
    }
  }

  //useEffect
  useEffect(() => {
    const {state} = props.location
    if (state === undefined || state === null) {
    } else {
      ctx.action.updateRoomInfo(state)
    }
    if (ctx.reloadType == 0) {
      //reload 방지
      // if (props.history.action === 'POP') {
      //   setReadyRoom(true)
      // } else {
      fetchData({data: {roomNo}})
      //}
    } else {
      setReadyRoom(true)
    }
    console.log(isHybrid())
  }, [])
  //---------------------------------------------------------------------
  return (
    <BroadCastProvider>
      <Layout {...props}>{readyRoom && <Content {...props} />}</Layout>
    </BroadCastProvider>
  )
}
//---------------------------------------------------------------------
