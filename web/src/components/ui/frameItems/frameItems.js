// React
import React, { useEffect, useState } from 'react'

import './frameItems.scss'

const FrameItems = (props) => {
  const {content} = props
  const [frameImgPath, setFrameImgPath] = useState("");
  const [frameBgPath, setFrameBgPath] = useState("");

  useEffect(() => {
    let frame = ""; // 적용프래임
    let frameBg = ""; // 적용날개프래임

    //프래임 적용 하위로 갈수록 우선순위 높음
    if(content.holder !== '') {
      frame = content.holder
    }
    if(content.isSpecial) {
      if(content.specialDjCnt > 20){
        frame = "https://image.dalbitlive.com/frame/frame_starDJ-1.png";
      } else if (content.specialDjCnt > 10) {
        frame = "https://image.dalbitlive.com/frame/frame_starDJ-2.png";
      } else {
        frame = "https://image.dalbitlive.com/frame/frame_starDJ-3.png";
      }
    }
    setFrameImgPath(frame);
    
    //프래임 적용 하위로 갈수록 우선순위 높음
    if(content.holderBg !== '') {
      frameBg = content.holderBg
    }
    setFrameBgPath(frameBg);
  }, [content])
  return (
    <>
      <div className="frame" style={{backgroundImage:`url('${frameImgPath}')`}}></div>
      {/* <div className="frameBg" style={{backgroundImage:`url('${frameBgPath}')`}}></div> */}
    </>
  )
}

export default React.memo(FrameItems)
