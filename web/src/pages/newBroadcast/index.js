import React, {useEffect, useState, useContext} from 'react'

//layout
import Layout from 'pages/common/layout'

//context
import {BroadcastProvider} from './store.js'

//components
import Content from './content'

export default props => {
  return (
    <BroadcastProvider>
      <Layout {...props}>
        <Content />
      </Layout>
    </BroadcastProvider>
  )
}
