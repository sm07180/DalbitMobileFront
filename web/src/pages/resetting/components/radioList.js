import React, {useState, useEffect} from 'react'

// global components
import '../style.scss'

const RadioList = (props) => {
  const {title, clickEvent} = props

  return (
    <label className='radioList' onClick={clickEvent}>
      <div className='titleWrap'>
        <span className='title'>{title}</span>
      </div>
      <div className="radioBox">
        <input type="radio" className={`blind`} name="radioBox"/>
        <span className={`radioBtn`}></span>
      </div>
    </label>
  )
}

export default RadioList
