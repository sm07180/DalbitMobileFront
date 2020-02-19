/**
 * @file main.js
 * @brief 메인페이지
 */
import React, {useContext, useMemo, useEffect} from 'react'
//context
import {Context} from 'context'
import Api from 'context/api'
//components
import Layout from 'pages/common/layout'
import Content from './content'

export default props => {
  //---------------------------------------------------------------------
  //context
  const context = useContext(Context)
  //useMemo
  const isLogin = useMemo(() => {
    return context.token.isLogin
  })
  //---------------------------------------------------------------------
  //fetch
  async function fetchData(obj) {
    const res = await Api.mypage({...obj})
    if (res.result === 'success') {
      context.action.updateMypage(res.data)
    }
  }
  //useEffect
  useEffect(() => {
    // if (isLogin) fetchData()
  }, [])
  //---------------------------------------------------------------------
  return (
    <Layout {...props} type="main">
      <Content />
    </Layout>
  )
}
