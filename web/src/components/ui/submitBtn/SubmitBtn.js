import React from 'react'

import './submitBtn.scss'

const SubmitBtn = (props) => {
  const {text, state} = props

  return (
    <button className={`submitBtn ${state ? state : ''}`}>{text}</button>
  )
}

export default SubmitBtn
