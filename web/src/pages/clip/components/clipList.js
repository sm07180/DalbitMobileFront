import React from 'react'

import '../dallaClip.scss'



const ClipList = (props) => {

  const {clipList} = props

  return (
    <>
      <div className="clipList">
        <div className="clipListPhoto"></div>
        <div className="clipListTitle">{clipList.title}</div>
        <div className="clipListUser">{clipList.name}</div>
      </div>
    </>
  )
}

export default ClipList
