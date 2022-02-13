// React
import React, {useEffect, useState} from 'react'

import FrameItems from 'components/ui/frameItems/frameItems'

import './photoFrame.scss'

const PhotoFrame = (props) => {
  const {size, data} = props
  const [outerSize, setOuterSize] = useState("")

  useEffect(() => {
    const outer = size * 1.35

    setOuterSize(outer)
  }, [])

  return (
    <div className='photoOuter' style={{width:outerSize, height:outerSize}}>
      <div className="photo" style={{width:size, height:size}}>
        {data.profImg && <img src={data.profImg.thumb500x500} alt={data.nickNm} /> }
        <FrameItems content={data} />
      </div>
    </div>
  )
}

export default PhotoFrame
