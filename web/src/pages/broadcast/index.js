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
export default props => {
  //context
  const context = useContext(Context)
  //const
  const {title} = props.match.params
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
