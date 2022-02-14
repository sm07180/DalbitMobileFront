// React
import React from 'react'

import './frameItems.scss'

const FrameItems = (props) => {
  const {content} = props
  return (
    <>
      {content.holder !== '' || content.holderBg !== '' ?
        <>
          <div className="frame" style={{backgroundImage:`url('${content.holder}')`}}></div>
          <div className="frameBg" style={{backgroundImage:`url('${content.holderBg}')`}}></div>
        </>
        :
        <></>
      }
    </>
  )
}

export default React.memo(FrameItems)
