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
  opacity: 0;

  animation-name: toastFadeInOut;
  animation-duration: 2.4s;
  animation-timing-function: ease-in-out;

  width: calc(100% - 32px);
  border-radius: 12px;
  height: auto;
  padding: 10px;
  text-align: center;
  font-size: 16px;
  background-color: rgba(99, 43, 235, 0.9);
  color: #fff;
  z-index: 120;

  @keyframes toastFadeInOut {
    0% {
      bottom: -50px;
    }
    20% {
      bottom: 16px;
      opacity: 1;
    }
    80% {
      bottom: 16px;
      opacity: 1;
    }
    100% {
      bottom: 32px;
      opacity: 0;
    }
  }
`
