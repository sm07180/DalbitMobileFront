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
const sc = require('context/socketCluster') //socketCluster

export default props => {
  const ctx = useContext(Context)
  //---------------------------------------------------------------------
  const [readyRoom, setReadyRoom] = useState(false)
  const {roomNo} = qs.parse(location.search) //라우터로 들어올때 방번호
  async function socketConnect() {}

  async function fetchData(obj) {
    const resRoomJoin = await Api.broad_join(obj) //방입장
    const {code, result, data, message} = resRoomJoin

    if (result === 'success') {
      console.log('방입장  = ' + data)
      if (data) {
        if (isHybrid()) {
          Hybrid('RoomJoin', data)
          props.history.goBack()
        } else {
          //const resSocketConnect = sc.socketClusterBinding(roomNo, ctx)
          // console.log('resSocketConnect = ' + resSocketConnect)
          ctx.action.updateBroadcastTotalInfo(data)
          setReadyRoom(true)
        }
      }
    } else {
      console.log(code)
      if (code === '-4') {
        //props.history.push('/broadcast/' + '?roomNo=' + roomNo)
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
  //useEffect
  useEffect(() => {
    // const {state} = props.location
    // if (state === undefined || state === null) {
    // } else {
    //   ctx.action.updateRoomInfo(state)
    // }

    fetchData({data: {roomNo}})
  }, [])
  //---------------------------------------------------------------------
  return (
    <BroadCastProvider>
      <Layout {...props}>{readyRoom && <Content {...props} />}</Layout>
    </BroadCastProvider>
  )
}
//---------------------------------------------------------------------
