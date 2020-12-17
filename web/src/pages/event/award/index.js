import React from 'react'
import {useParams} from 'react-router-dom'

import Layout from 'pages/common/layout'
import AwardMain from './contents'
import AwardResult from './contents/result'
import './award.scss'

export default function awardEvent() {
  const params = useParams()

  const createContent = () => {
    const category = params instanceof Object ? params['type'] : ''
    // url dividing
    if (category === 'result') {
      return <AwardResult />
    } else {
      return <AwardMain />
    }
  }

  return <div id="awardEventPage">{createContent()}</div>
}
