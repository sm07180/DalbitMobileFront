/**
 * @file /login/index.js
 * @brief 로그인
 */
import React, {useEffect, useState} from 'react'
import {Helmet} from 'react-helmet'
//layout
import Layout from 'Pages/common/layout'
//context
//components
import Api from 'Context/api'
//
const User = () => {
  //---------------------------------------------------------------------
  //fetch
  async function fetchData(obj) {}

  useEffect(() => {
    fetchData()
  }, [])

  //---------------------------------------------------------------------
  return (
    <Layout>
      <section>
        <iframe width="700px" height="600px" src="https://v154.wawatoc.com:5443/WebRTCAppEE/audio_publish.html"></iframe>
        <div className="container">
          <h1>TEST</h1>
        </div>
      </section>
    </Layout>
  )
}
export default User
