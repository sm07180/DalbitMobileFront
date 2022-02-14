import React from 'react'

import './levelItems.scss'

const LevelItems = (props) => {
  const {data,grade} = props

  return (
    <em className={`level`}>Lv{data} {grade}</em>
  )
}

export default LevelItems
