import React, {useState, useEffect} from 'react'

// global components
import './switchList.scss'

const SwitchList = (props) => {
  const {title, mark, allSwitch, action} = props  

  return (
    <div className='switchList'>
      <div className='titleWrap'>
        {mark !== false && <span className='questionMark'></span>}
        <span className='title'>{title}</span>
      </div>
      <label className="inputLabel">
        <input type="checkbox" className={`blind`} name={allSwitch ? "switchAll" : "switch"} onChange={action}/>
        <span className={`switchBtn`}></span>
      </label>
    </div>
  )
}

export default SwitchList
