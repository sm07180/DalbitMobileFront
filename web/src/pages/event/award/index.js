import React from 'react'
import {useParams} from 'react-router-dom'

import AwardMain from './contents'
import AwardResult from './contents/result/result'
import Award2020 from './contents/honor/2020'
import './award.scss'

export default function awardEvent() {
  const params = useParams()

  const createContent = () => {
    const category = params instanceof Object ? params['type'] : ''
    // url dividing
    if (category === 'result') {
      return <AwardResult />
    } else if (category === '2020') {
      return <Award2020 />
    } else {
      return <AwardMain />
    }
  }

  return <div id="awardEventPage">{createContent()}</div>
}
