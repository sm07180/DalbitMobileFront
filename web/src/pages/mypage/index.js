/**
 * @file /login/index.js
 * @brief 로그인
 */
import React, {useEffect, useState} from 'react'
//layout
import Layout from 'Pages/common/layout'
//context
//components
import Api from 'Context/api'
//
const User = () => {
  //---------------------------------------------------------------------

  useEffect(() => {}, [])
  //---------------------------------------------------------------------
  return (
    <Layout>
      <h1>
        <a href="/">로그인</a>
      </h1>

      <section>
        <div>test11112</div>
        <p></p>
      </section>
    </Layout>
  )
}
export default User
