import React from 'react'

import '../dallaClip.scss'

const HotClipList = (props) => {

  const {hotClipList} = props

  return (
    <>
      <div className="hotClip">
        <div className="hotClipImg"></div>
        <div className="hotClipData">
          <div className="hotClipRank">{hotClipList.rank}</div>
          <div className="hotClipTitle">
            <span className="hotClipSubject">커버/노래</span>
            {hotClipList.title}
          </div>
          <div className="hotClipSubTit">
            {hotClipList.name}
          </div>
        </div>
      </div>
    </>
  )
}

export default HotClipList
