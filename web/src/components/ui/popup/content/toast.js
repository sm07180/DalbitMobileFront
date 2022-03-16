/**
 * @file toast.js
 * @brief toast 기능
 * @use context.action.toast({msg: '메세지'})
 */
import React, {useRef, useContext, useEffect, useState, useMemo} from 'react'
import styled from 'styled-components'
//context
import Utility from 'components/lib/utility'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

const lifeTime = 2800 // milisec
let msgArray = []
let copyArray = []

export default () => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
  const {msg} = globalState.message

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

      dispatch(setGlobalCtxMessage({
        type:"toast",
        msg: ''
      }))
      setLast(false)
    }
  }, [last, msgData])

  return (
    <>
      {msgData.length > 0 &&
        msgData.map((v, i) => {
          return (
            <React.Fragment key={i}>
              <Toast>
                <div dangerouslySetInnerHTML={{__html: Utility.nl2br(v.text)}}></div>
              </Toast>
            </React.Fragment>
          )
        })
      }
    </>
  )
}

const Toast = styled.div`
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform:translateX(-50%);
  opacity: 0;

  animation-name: toastFadeInOut;
  animation-duration: 2.8s;
  animation-timing-function: ease-in-out;

  width: calc(100% - 32px);
  max-width:460px;
  height: auto;
  padding: 10px;
  font-size: 16px;
  text-align: center;
  background-color: rgba(255,60,123, 0.9);
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
