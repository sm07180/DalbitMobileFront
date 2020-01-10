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
      <section>
        <div>라이브방송</div>
        <p>WEBRTC</p>
      </section>
    </Layout>
  )
}
export default User
