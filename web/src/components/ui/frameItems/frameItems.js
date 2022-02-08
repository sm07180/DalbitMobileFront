// React
import React from 'react'

import './frameItems.scss'

const FrameItems = (props) => {
  const {content, frameBg } = props
  return (
    <>
      {content.holder !== '' || content.holderBg !== '' ?
        <>
          <div className="frame" style={{backgroundImage:`url('${content.holder}')`}}></div>
          {frameBg && <div className="frameBg" style={{backgroundImage:`url('${content.holderBg}')`}}></div>}
        </>
        :
        <></>
      }
    </>
  )
}

export default React.memo(FrameItems)
