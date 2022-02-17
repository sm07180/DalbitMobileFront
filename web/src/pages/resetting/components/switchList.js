import React, {useState, useEffect} from 'react'

// global components
import './switchList.scss'

const SwitchList = (props) => {
  const {title, mark, allSwitch, action, allCheck} = props

  return (
    <div className='switchList'>
      <div className='titleWrap'>
        {mark !== false && <span className='questionMark'/>}
        <span className='title'>{title}</span>
      </div>
      <label className="inputLabel">
        <input type="checkbox" className={`blind`} name={allSwitch ? "switchAll" : "switch"} onChange={action}/>
        {allCheck === 1 ? <span className="switchBtnOn"/> : <span className="switchBtn"/>}
      </label>
    </div>
  )
}

export default SwitchList
