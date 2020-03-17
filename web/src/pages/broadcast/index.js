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

export default props => {
  //context
  const context = useContext(Context)
  //const
  const roomNo = location.href.split('?')[1].split('=')[1]
  ;(async () => {
    const res = await Api.broad_join({data: {roomNo: roomNo}})
    if (res.result === 'success') {
      context.action.updateBroadcastTotalInfo(res.data)
    }
  })()

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
      alert('props.location.state')
    } else {
      context.action.updateRoomInfo(state)
    }
  }, [])
  //---------------------------------------------------------------------
  return (
    <BroadCastProvider>
      <Layout {...props}>{setRoute()}</Layout>
    </BroadCastProvider>
  )
}
//---------------------------------------------------------------------
