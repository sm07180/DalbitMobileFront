import React, {useHistory, useContext} from 'react'
import Header from 'components/ui/new_header.js'
import {Context} from 'context'
import Layout from 'pages/common/layout'

export default () => {
  const global_ctx = useContext(Context)
  return (
    <Layout status="no_gnb">
      <div id="clipOpen">
        <Header title="클립 오픈 안내" />
        <p>zz</p>
      </div>
    </Layout>
  )
}
