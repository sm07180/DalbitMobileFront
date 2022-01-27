import React from 'react'

import './levelItems.scss'

const LevelItems = (props) => {
  const {data,size} = props

  return (
    <em className={`level`} style={{height:`${size}px`}}>Lv{data}</em>
  )
}

LevelItems.defaultProps = {
  size: 18,
}

export default LevelItems
