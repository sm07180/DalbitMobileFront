import React, {useReducer, useEffect, useState, useContext} from 'react'
import DoExchange from './content/do_exchange'
import Result from '../remoneyExchange/content/result'
import Message from 'pages/common/message'
import Api from 'context/api'
import {Context} from 'context'
import './index.scss'

export default function MoneyExchange(props) {
  const context = useContext(Context)
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
          {/* <DoExchange /> */}
          <Result />
        </div>
      )}
      <Message />
    </>
  )
}