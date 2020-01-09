/**
 * @file /login/index.js
 * @brief 로그인
 */
import React, {useEffect} from 'react'
//layout
import Layout from 'Pages/common/layout'
//context
//components
import Api from 'Context/api'
//
const User = () => {
  //---------------------------------------------------------------------
  //fetch
  async function fetchData(obj) {
    const res = await Api.login({
      data: {
        id: '010-1234-7412',
        password: '1234'
      }
    })

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
      </section>
    </Layout>
  )
}
export default User
