import React, {useState, useEffect} from 'react'

// global components
import '../style.scss'

const SwitchList = (props) => {
  const {title, mark, allSwitch, setToast} = props

  const switchControl = (e) => {
    const switchs = document.querySelectorAll('input[name="switch"]');
    const on = document.querySelectorAll('input[name="switch"]:checked');
    const switchAll = document.querySelector('input[name="switchAll"]');
    
    if(e.target.name === "switchAll") {
      switchs.forEach((checkbox) => {
        checkbox.checked = e.target.checked
      })
      if(e.target.checked){
        setToast(`${title} 푸시를 받습니다.`)
      } else {
        setToast(`${title} 푸시를 받지 않습니다.`)
      }
    } else {
      if(e.target.checked){
        setToast(`${title} 푸시를 받습니다.`)
      } else {
        setToast(`${title} 푸시를 받지 않습니다.`)
      }
      if(switchs.length === on.length)  {
        switchAll.checked = true;
      }else {
        switchAll.checked = false;
      }
    }
  }

  return (
    <div className='switchList'>
      <div className='titleWrap'>
        {mark !== false && <span className='questionMark'></span>}
        <span className='title'>{title}</span>
      </div>
      <label className="inputLabel">
        <input type="checkbox" className={`blind`} name={allSwitch ? "switchAll" : "switch"} onChange={switchControl}/>
        <span className={`switchBtn`}></span>
      </label>
    </div>
  )
}

export default SwitchList
