import React from 'react'
import {KnowHowProvider} from './store'

import Layout from 'pages/common/layout'

import KnowHowMain from './component/knowhow_main'
import AttendAdd from './component/attend_add'
import './index.scss'

export default function EventKnowHow() {
  return (
    <KnowHowProvider>
      <Layout status={'no_gnb'}>
        <div id="EventKnowHow">
          <KnowHowMain />
        </div>
      </Layout>
    </KnowHowProvider>
  )
}
