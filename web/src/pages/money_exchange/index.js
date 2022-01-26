import React, {useReducer, useEffect, useState, useContext} from 'react'
import DoExchange from './content/do_exchange'
import Result from './content/result'
import Message from 'pages/common/message'
import Api from 'context/api'
import {Context} from 'context'
import './index.scss'
import Layout from 'pages/common/layout/new_layout'

function exchangeReducer(state, action) {
  switch (action.type) {
    case 'status':
      return {
        ...state,
        status: action.value
      }
    case 'result':
      return {
        ...state,
        status: 2,
        data: action.value
      }
    default:
      throw new Error()
  }
}

export default function MoneyExchange(props) {
  const context = useContext(Context)
  const [exchangeState, exchangeDispatch] = useReducer(exchangeReducer, {status: 0})

  const [auth, setAuth] = useState(false)
  useEffect(() => {
    async function fetchSelfAuth() {
      let myBirth
      const baseYear = new Date().getFullYear() - 11
      const myInfoRes = await Api.mypage()
      if (myInfoRes.result === 'success') {
        myBirth = myInfoRes.data.birth.slice(0, 4)
      }
      if (myBirth > baseYear) {
        setAuth(false)
        context.action.alert({
          msg: `만 14세 미만 미성년자 회원은\n서비스 이용을 제한합니다.`,
          callback: () => props.history.push('/'),
          cancleCallback: () => props.history.push('/')
        })
      } else {
        const res = await Api.self_auth_check({})
        if (res.data.company === '기타') {
          setAuth(false)
          context.action.alert({
            msg: `휴대폰 본인인증을 받지 않은 경우\n환전이 제한되는 점 양해부탁드립니다`,
            callback: () => props.history.push('/'),
            cancleCallback: () => props.history.push('/')
          })
        } else {
          setAuth(true)
        }
      }
    }
    fetchSelfAuth()
  }, [])

  return (
    <>
      {auth && (
        <div id="exchangePage">
          {exchangeState.status === 0 && <DoExchange state={exchangeState} dispatch={exchangeDispatch} />}
          {exchangeState.status === 2 && <Result state={exchangeState} dispatch={exchangeDispatch} />}
        </div>
      )}
      <Message />
    </>
  )
}