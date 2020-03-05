/**
 * @file /event/index.js
 * @brief 이벤트
 */
import React, {useEffect, useState, useContext} from 'react'
import styled from 'styled-components'
//layout
import Layout from 'pages/common/layout'
//context
import {BroadCastProvider} from './store'
//components
import {Context} from 'context'
import Api from 'context/api'
import Listener from './content/listener'
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
    switch (title) {
      case 'listener': //----------------------------listener
        return <Listener {...props} />
      default:
        return <Content {...props} />
    }
  }
  //useEffect
  useEffect(() => {
    const {state} = props.location
    if (state === null || state === undefined) return
    //context Update
    //context.action.updateRoomInfo(state)
  }, [])
  //---------------------------------------------------------------------
  return (
    <BroadCastProvider>
      <Layout {...props}>{setRoute()}</Layout>
    </BroadCastProvider>
  )
}
//---------------------------------------------------------------------
