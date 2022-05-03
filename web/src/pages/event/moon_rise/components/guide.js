import React from 'react'
import {guideImgArray} from '../constant'

export default function () {
  return (
    <React.Fragment>
      <div className="guide">
        {guideImgArray.map((guideItem, idx) => {
          return (
            <img
              alt={`가이드이미지${idx}`}
              src={`https://image.dallalive.com/event/moonrise/${guideItem}`}
              key={`guideimg${idx}`}
            />
          )
        })}
      </div>
    </React.Fragment>
  )
}
