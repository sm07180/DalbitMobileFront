import React from 'react'

import './levelItems.scss'

const LevelItems = (props) => {
  const {data,grade,size} = props

  return (
    <em className={`level`} style={{height:`${size}px`}}>Lv{data} {grade}</em>
  )
}

LevelItems.defaultProps = {
  size: 18,
}

export default LevelItems
