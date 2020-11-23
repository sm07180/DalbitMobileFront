import React from 'react'
// //components
import Layout from 'pages/common/layout'
import Header from 'components/ui/new_header'

export default () => {
  return (
    <>
      <Layout>
        <Header title="장기 미접속 회원 휴면회원 전환 안내" />
        <div id="customerOut"></div>
      </Layout>
    </>
  )
}
