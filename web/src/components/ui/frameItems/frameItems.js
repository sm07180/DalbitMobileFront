// React
import React from 'react'

import './frameItems.scss'

const FrameItems = (props) => {
  const {content} = props


  const commonFrame = ({badgeSpecial, specialDjCnt, holder, holderBg}) => {
    let frameUrl = holder;
    if (specialDjCnt > 20){
      frameUrl = "https://image.dallalive.com/frame/frame_starDJ-profile3.png";
    } else if (badgeSpecial === 1){
      frameUrl = specialDjCnt > 10 ? "https://image.dallalive.com/frame/frame_starDJ-profile2.png" : "https://image.dallalive.com/frame/frame_starDJ-profile1.png";
    } else {
      frameUrl = holder;
    }
    return (
      <>
        <div className="frame" style={{backgroundImage:`url('${frameUrl}')`}}></div>
        {/* <div className="frameBg" style={{backgroundImage:`url('${holderBg}')`}}></div> */}
      </>
    )
  }

  return (
    <>
      {commonFrame(content)}
    </>
  )
}

export default React.memo(FrameItems)
