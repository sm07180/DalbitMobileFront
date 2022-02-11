import React, {useState} from 'react'

// global components
// components
// contents
// css
import './checkList.scss'

const CheckList = (props) => {
  const {text,name,children} = props
  const [btnActive,setBtnActive] = useState(false)
  
  const onCheckSelect = () => {
    setBtnActive(!btnActive)
  }

  return (
    <>
      <div className="infoCheckList">
        <label className="inputLabel">
          <input type="checkbox" className="blind" />
          <span className="checkIcon"></span>
          <p className="checkinfo">{text}</p>
          {children}
        </label>
      </div>
    </>
  )
}

export default CheckList
