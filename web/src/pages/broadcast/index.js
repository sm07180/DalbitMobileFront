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
          Hybrid('RoomJoin', data)
          history.goBack()
        } else {
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
      console.log(code)
      sessionStorage.clear()
      if (code === '-4') {
        // const roomExit = await Api.broad_exit(obj)
        // if (roomExit.result === 'success') {
        //   const resRoomJoin = await Api.broad_join(obj)
        //   if (roomJoin.result === 'success') {
        //     return roomJoin.data
        //   }
        // }
        //   console.log(ctx.roomReady)
        //   ctx.action.updateRoomReady(false)
        //   props.history.goBack()
      } else if (code === '-2' || code === '-3' || code === '-5') {
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
