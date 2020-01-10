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
  const [fetch, setFetch] = useState(null)
  //fetch
  async function fetchData(obj) {
    const res = await Api.login_authenticate({
      data: {
        id1: '010-1234-7412',
        password: '1234'
      }
    })
    setFetch(res)
    console.log(res)
  }
  useEffect(() => {
    fetchData()
  }, [])
  //---------------------------------------------------------------------
  return (
    <Layout>
      <h1>
        <a href="/">로그인</a>
      </h1>

      <section>
        <div>console확인</div>
        <p></p>
      </section>
    </Layout>
  )
}
export default User
