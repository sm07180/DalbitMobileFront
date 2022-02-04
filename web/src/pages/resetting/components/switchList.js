import React, {useState, useEffect, useContext} from 'react'

// global components

import '../style.scss'

const SwitchList = (props) => {
  const {title, mark, on} = props
  const [switchOn, setSwitchOn] = useState(false);

  const switchAction = () => {
    setSwitchOn(!switchOn);
  }

  return (
    <div className='switchList'>
      <div className='titleWrap'>
        {mark && <span className='questionMark'></span>}
        <span className='title'>{title}</span>
      </div>
      <span className={`switchBtn ${switchOn ? "active" : ""}`} onClick={switchAction}></span>
    </div>
  )
}

export default SwitchList
