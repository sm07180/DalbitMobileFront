/**
 * @file toast.js
 * @brief toast 기능
 * @use context.action.toast({msg: '메세지'})
 */
import React, {useRef, useContext, useEffect} from 'react'
import styled from 'styled-components'
//context
import {Context} from 'context'

const lifeTime = 2500 // milisec

export default (props) => {
  //---------------------------------------------------------------------
  //context
  const context = useContext(Context)
  const {msg} = context.message

  useEffect(() => {
    setTimeout(() => {
      context.action.toast({visible: false})
    }, [lifeTime])
  }, [])

  //---------------------------------------------------------------------
  return <Toast>{msg}</Toast>
}
//---------------------------------------------------------------------
const Toast = styled.section`
  position: fixed;
  bottom: 16px;
  left: 16px;
  width: calc(100% - 32px);
  border-radius: 12px;
  height: auto;
  padding: 16px;
  text-align: center;
  font-size: 16px;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  z-index: 120;
`
