import React from 'react'

import './gender.scss'

const Gender = (props) => {
  const {data,text,size} = props

  return (
    <em className={`${data.gender === 'm' ? 'male' : 'female'}`} style={{width:`${size}px`,height:`${size}px`}}></em>
  )
}

Gender.defaultProps = {
  size: 14,
}

export default Gender
