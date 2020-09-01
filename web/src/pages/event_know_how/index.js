import React from 'react'
import {KnowHowProvider} from './store'

import KnowHowMain from './component/knowhow_main'
import AttendAdd from './component/attend_add'
import './index.scss'

export default function EventKnowHow() {
  return (
    <KnowHowProvider>
      <div id="EventKnowHow">
        <KnowHowMain />
      </div>
    </KnowHowProvider>
  )
}
