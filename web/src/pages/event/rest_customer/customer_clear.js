import React from 'react'
// //components
import Layout from 'pages/common/layout'
import Header from 'components/ui/new_header'

export default () => {
  return (
    <>
      <Layout>
        <Header title="휴면회원 안내" />
        <div id="customerOut"></div>
      </Layout>
    </>
  )
}
