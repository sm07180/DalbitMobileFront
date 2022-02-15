/**
 * @file toast.js
 * @brief toast 기능
 * @use context.action.toast({msg: '메세지'})
 */
import React, {useRef, useContext, useEffect, useState, useMemo} from 'react'
import styled from 'styled-components'
//context
import {Context} from 'context'
import Utility from 'components/lib/utility'

const lifeTime = 2800 // milisec
let msgArray = []
let copyArray = []

export default () => {
  const context = useContext(Context)
  const {msg} = context.message

  const [last, setLast] = useState(false)

  useEffect(() => {
    if (msg && msg !== '') {
      msgArray.push({
        text: msg,
        state: true
      })
      copyArray.push(msg)
    }
  }, [msg])

  const msgData = useMemo(() => {
    if (last === true) {
      return []
    }
    if (msg && msg !== '') {
      if (copyArray.length > 0) {
        return [
          ...msgArray,
          {
            text: msg,
            state: true
          }
        ]
      } else {
        return [
          {
            text: msg,
            state: true
          }
        ]
      }
    } else {
      return []
    }
  }, [msg, last])

  useEffect(() => {
    if (msgData.length > 0) {
      setTimeout(() => {
        copyArray.shift()
        if (copyArray.length === 0) {
          msgArray = []
          setLast(true)
        }
      }, lifeTime)
    }
  }, [msgData])

  useEffect(() => {
    if (last === true && msgData.length === 0) {
      context.action.toast({
        message: ''
      })
      setLast(false)
    }
  }, [last, msgData])

  return (
    <>
      {
        msgData.length > 0 &&
          msgData.map((v, i) => {
            return (
              <React.Fragment key={i}>
                <Toast>
                  <div dangerouslySetInnerHTML={{__html: Utility.nl2br(v.text)}}></div>
                </Toast>
              </React.Fragment>
            )
          })
        // Memozized(msgData)
      }
    </>
  )
}

const Toast = styled.div`
  position: fixed;
  bottom: 32px;
  left: 16px;
  opacity: 0;

  animation-name: toastFadeInOut;
  animation-duration: 2.8s;
  animation-timing-function: ease-in-out;

  width: calc(100% - 32px);
  height: auto;
  padding: 10px;
  font-size: 16px;
  text-align: center;
  background-color: rgba(99, 43, 235, 0.9);
  color: #fff;
  border-radius: 12px;
  z-index: 120;

  @keyframes toastFadeInOut {
    0% {
      bottom: -50px;
    }
    15% {
      bottom: 24px;
      opacity: 1;
    }
    90% {
      bottom: 24px;
      opacity: 1;
    }
    100% {
      bottom: 50px;
      opacity: 0;
    }
  }
`