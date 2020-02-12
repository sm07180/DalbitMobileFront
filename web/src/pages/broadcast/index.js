/**
 * @file /event/index.js
 * @brief 이벤트
 */
import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
//layout
import Layout from 'pages/common/layout'
//context
import {Context} from 'context'
//components
import Api from 'context/api'
import Chat from './content/chat'
import Host from './content/host'
import Listener from './content/listener'
import Content from './content'
//
export default props => {
  //const
  const {title} = props.match.params
  console.log(title)
  //---------------------------------------------------------------------
  function setRoute() {
    switch (title) {
      case 'chat': //--------------------------------채팅
        return <Chat {...props} />
      case 'host': //--------------------------------Host
        return <Host {...props} />
      case 'listener': //----------------------------listener
        return <Listener {...props} />

      default:
        return <Content />
    }
  }
  //useEffect
  useEffect(() => {}, [])
  //---------------------------------------------------------------------
  return <Layout {...props}>{setRoute()}</Layout>
}
//---------------------------------------------------------------------
