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
//
import Api from 'context/api'

let getBoradInfo = false

export default props => {
  //context
  const ctx = useContext(Context)
  //const
  if (!ctx.broadcastTotalInfo && !getBoradInfo) {
    ;(async () => {
      getBoradInfo = true
      const roomNo = location.href.split('?')[1].split('=')[1]
      const res = await Api.broad_join({data: {roomNo: roomNo}})
      if (res.result === 'success') {
        ctx.action.updateBroadcastTotalInfo(res.data)
      }
    })()
  }

  //---------------------------------------------------------------------
  /**
   * @
   */
  function setRoute() {
    return <Content {...props} />
  }
  //useEffect
  useEffect(() => {
    const {state} = props.location
    if (state === undefined || state === null) {
    } else {
      ctx.action.updateRoomInfo(state)
    }
  }, [])
  //---------------------------------------------------------------------
  return <BroadCastProvider>{ctx.broadcastTotalInfo && <Layout {...props}>{setRoute()}</Layout>}</BroadCastProvider>
}
//---------------------------------------------------------------------
