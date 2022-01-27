import React from 'react'

import './genderItems.scss'

const GenderItems = (props) => {
  const {data,size} = props

  return (
    <em className={`gender ${data === 'm' ? 'male' : 'female'}`} style={{width:`${size}px`,height:`${size}px`}}></em>
  )
}

GenderItems.defaultProps = {
  size: 14,
}

export default GenderItems
