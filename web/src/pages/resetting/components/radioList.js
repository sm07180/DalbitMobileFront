import React, {useState, useEffect} from 'react'

// global components
import './radioList.scss'

const RadioList = (props) => {
  const {title, listIndex, clickEvent, titleSelect, setTitleSelect} = props

  const onChange = (e) => {
    setTitleSelect({...titleSelect, val: e.target.value})
  }

  return (
    <label className='radioList' data-target-index={listIndex} onClick={clickEvent}>
      <div className='titleWrap'>
        <span className='title' value={title} onChange={onChange}>{title}</span>
      </div>
      <div className="radioBox">
        <input type="radio" className={`blind`} name="radioBox"/>
        <span className={`radioBtn`}/>
      </div>
    </label>
  )
}

export default RadioList
