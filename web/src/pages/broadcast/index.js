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
  const ctx = useContext(Context)
  //---------------------------------------------------------------------

  //useEffect
  useEffect(() => {
    const {state} = props.location
    if (state === undefined || state === null) {
    } else {
      ctx.action.updateRoomInfo(state)
    }
  }, [])
  //---------------------------------------------------------------------
  return (
    <BroadCastProvider>
      <Layout {...props}>
        <Content {...props} />
      </Layout>
    </BroadCastProvider>
  )
}
//---------------------------------------------------------------------
