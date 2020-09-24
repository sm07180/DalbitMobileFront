import Layout from 'pages/common/layout/new_layout'
import React from 'react'
import Content from './content'
//Context
import {PlayListProvider} from './store'

import './play_list.scss'

export default (props) => {
  //---------------------------------------------------------------------
  //title

  return (
    <PlayListProvider>
      <Content {...props} />
    </PlayListProvider>
  )
}
