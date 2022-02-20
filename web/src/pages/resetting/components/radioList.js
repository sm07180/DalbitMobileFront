import React, {useState, useEffect} from 'react'

// global components
import './radioList.scss'

const RadioList = (props) => {
  const {title, listIndex, clickEvent} = props

  return (
    <label className='radioList' data-target-index={listIndex} onClick={clickEvent}>
      <div className='titleWrap'>
        <span className='title'>{title}</span>
      </div>
      <div className="radioBox">
        <input type="radio" className={`blind`} name="radioBox"/>
        <span className={`radioBtn`}/>
      </div>
    </label>
  )
}

export default RadioList
