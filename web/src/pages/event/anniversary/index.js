import React from 'react'
import {useParams} from 'react-router-dom'

import Layout from 'pages/common/layout'
import AnniversaryMain from './contents'
// import AnniversaryResult from './contents/result/result'
// import Anniversary2021 from './contents/honor/2021'
import './anniversary.scss'

export default function anniversaryEvent() {
  return <div id="anniversaryEventPage"><AnniversaryMain /></div>
}