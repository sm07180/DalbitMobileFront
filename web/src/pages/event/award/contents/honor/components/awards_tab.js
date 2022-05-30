import React from 'react'

import {AWARD_PAGE_TYPE} from '../constant'

export default function AwardsTab(props) {
  const {pageType, toggleTab} = props

  return (
    <div className="awradTab">
      <button onClick={() => toggleTab(AWARD_PAGE_TYPE.DJTOP)}>
        <img
          src={`https://image.dallalive.com/event/award_rank/tab_dj_${pageType === AWARD_PAGE_TYPE.DJTOP ? 'on' : 'off'}@2x.png`}
          alt="DJ TOP7"
        />
      </button>
      <button onClick={() => toggleTab(AWARD_PAGE_TYPE.FANTOP)}>
        <img
          src={`https://image.dallalive.com/event/award_rank/tab_fan_${
            pageType === AWARD_PAGE_TYPE.FANTOP ? 'on' : 'off'
          }@2x.png`}
          alt="FAN TOP20"
        />
      </button>
    </div>
  )
}
