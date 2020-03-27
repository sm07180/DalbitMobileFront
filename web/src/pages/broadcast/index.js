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
import {setSesstionStorage, getSesstionStorage} from 'components/lib/sesstionStorageCtl'
import {BroadCastStore} from './store'

const sc = require('context/socketCluster') //socketCluster

export default props => {
  const ctx = useContext(Context)
  const store = useContext(BroadCastStore)

  //---------------------------------------------------------------------
  const [readyRoom, setReadyRoom] = useState(false)
  const {roomNo} = qs.parse(location.search) //라우터로 들어올때 방번호
  async function socketConnect() {
    const conect = await sc.socketClusterBinding(roomNo)
  }
  async function fetchData(obj) {
    console.clear()
    console.log('join')
    const resRoomJoin = await Api.broad_join(obj) //방입장
    const {code, result, data, message} = resRoomJoin

    if (result === 'success') {
      console.log('방입장  = ' + data)
      if (data) {
        if (isHybrid()) {
          alert('hybrid')

          setReadyRoom(false)
          Hybrid('RoomJoin', data)
          //history.goBack()
          //setTimeout(() => {
          //  Hybrid('RoomJoin', data)
          //}, 100)
        } else {
          alert('no hybrid')
          //const resSocketConnect = sc.socketClusterBinding(roomNo, ctx)
          // console.log('resSocketConnect = ' + resSocketConnect)
          setReadyRoom(true)
          ctx.action.updateBroadcastTotalInfo(data)
          setSesstionStorage('userInfo', data)
          // store.action.updateRoomReady(true)
          //ctx.action.updateRoomReady(true)
        }
      }
    } else {
      sessionStorage.clear()
      if (code === '-1' || code === '-2' || code === '-3' || code === '-4' || code === '-5' || code === '-6') {
        ctx.action.alert({
          callback: () => {
            props.history.goBack()
          },
          msg: message
        })
      }
    }
  }

  //useEffect
  useEffect(() => {
    // const res = document.addEventListener('socketSendData2', state => {
    //   //비정상 방
    //   if (state.detail === 'SUBSCRIBEFAIL') {
    //     setReadyRoom(false)
    //     props.history.push('./live')
    //   } else if (state.detail === 'SUBSCRIBE') {
    //     setReadyRoom(true)
    //     //fetchData({data: {roomNo}})
    //   }

    //   //settopTipMessageData(data.detail)
    //   return () => document.removeEventListener('socketSendData2')
    // })
    //sc.socketClusterBinding(roomNo)
    const {state} = props.location
    if (state === undefined || state === null) {
    } else {
      ctx.action.updateRoomInfo(state)
    }
    if (ctx.reloadType == 0) {
      //reload 방지
      if (props.history.action === 'POP') {
        setReadyRoom(true)
      } else {
        fetchData({data: {roomNo}})
      }
    } else {
      setReadyRoom(true)
    }
    console.log(isHybrid())
    // if (getSesstionStorage('userInfo')) {
    //   //setReadyRoom(true)
    //   ctx.action.updateRoomReady(true)
    // } else {
    //   console.log(ctx.roomReady)
    //   sc.socketClusterBinding(roomNo)

    //   fetchData({data: {roomNo}})
    // }
    // const {state} = props.location
    // if (state === undefined || state === null) {
    // } else {
    //   ctx.action.updateRoomInfo(state)
    // }
    // console.log(props)
    // if (getSesstionStorage('userInfo')) {
    //   setReadyRoom(true)
    //   //store.action.updateRoomReady(true)
    // } else {
    //   console.log(readyRoom)
    //   socketConnect()
    //   //fetchData({data: {roomNo}})
    // }
  }, [])
  //---------------------------------------------------------------------
  return (
    <BroadCastProvider>
      <Layout {...props}>{readyRoom && <Content {...props} />}</Layout>
    </BroadCastProvider>
  )
}
//---------------------------------------------------------------------
