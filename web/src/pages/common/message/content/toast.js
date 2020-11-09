/**
 * @file toast.js
 * @brief toast 기능
 * @use context.action.toast({msg: '메세지'})
 */
import React, {useRef, useContext, useEffect, useState} from 'react'
import styled from 'styled-components'
//context
import {Context} from 'context'
import Utility from 'components/lib/utility'

const lifeTime = 2500 // milisec

// let timer

export default (props) => {
  //---------------------------------------------------------------------
  //context
  const context = useContext(Context)
  const {msg} = context.message

  const [msgData, setMsgData] = useState([])

  // useEffect(() => {
  //   setTimeout(() => {
  //     context.action.toast({visible: false})
  //   }, [lifeTime])
  // }, [])
  useEffect(() => {
    if (msgData.length === 0) {
      setMsgData([{text: msg, state: true}])
    } else {
      setMsgData((previous) => {
        return [
          ...previous,
          {
            text: msg,
            state: true
          }
        ]
      })
    }
  }, [msg])

  useEffect(() => {
    if (msgData.length > 0) {
      if (msgData.every((v) => !v.state)) {
        context.action.toast({visible: false})

        return
      }

      setTimeout(() => {
        setMsgData(
          msgData.filter((v, i, self) => {
            if (i === 0) {
              return false
            }
            return v
          })
        )
        // setMsgData(
        //   msgData.map((v, i) => {
        //     if (i === 0) {
        //       v.state = false
        //     }
        //     return v
        //   })
        // )
      }, lifeTime)

      console.log(msgData)
    }
  }, [msgData])

  useEffect(() => {
    if (context.message.visible === false) {
      console.log('와주라')
      setMsgData([])
    }
  }, [context.message.visible])
  //---------------------------------------------------------------------
  return (
    <>
      {msgData.length > 0 &&
        // msgData.map((v, i) => {
        //   return (
        //     <React.Fragment key={i}>
        //       <Toast className={v.state === false && 'un'}>
        //         <div dangerouslySetInnerHTML={{__html: Utility.nl2br(v.text)}}></div>
        //       </Toast>
        //     </React.Fragment>
        //   )
        // })
        Memozized(msgData)}
    </>
  )
}

function check(prev, cur) {
  console.log('안녕...', prev)
  console.log(cur)

  return false
}
function CreateToast(arr) {
  return (
    <>
      {arr.map((v, i) => {
        return (
          <React.Fragment key={i}>
            <Toast className={v.state === false && 'un'}>
              <div dangerouslySetInnerHTML={{__html: Utility.nl2br(v.text)}}></div>
            </Toast>
          </React.Fragment>
        )
      })}
    </>
  )
}

const Memozized = (arr) => React.memo(CreateToast(arr), check)
//---------------------------------------------------------------------
const Toast = styled.section`
  &.un {
    display: none;
  }

  position: fixed;
  bottom: 32px;
  left: 16px;
  opacity: 0;

  animation-name: toastFadeInOut;
  animation-duration: 2.4s;
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
    20% {
      bottom: 24px;
      opacity: 1;
    }
    80% {
      bottom: 24px;
      opacity: 1;
    }
    100% {
      bottom: 50px;
      opacity: 0;
    }
  }
`
