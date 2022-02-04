import React from 'react'

import './submitBtn.scss'

const SubmitBtn = (props) => {
  const {text, state, onClick} = props

  return (
    <button className={`submitBtn ${state ? state : ''}`} onClick={onClick}>{text}</button>
  )
}

export default SubmitBtn
