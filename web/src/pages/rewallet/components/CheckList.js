import React, {useState} from 'react'

// global components
// components
// contents
// css
import './checkList.scss'

const CheckList = (props) => {
  const {text,name,children, onClick} = props
  const [btnActive,setBtnActive] = useState(false)
  
  const onCheckSelect = () => {
    setBtnActive(!btnActive)
  }

  return (
    <>
      <div className="infoCheckList">
        <label className="inputLabel">
          <input type="checkbox" className="blind" onClick={onClick}/>
          <span className="checkIcon"></span>
          <p className="checkInfo">{text}</p>
          {children}
        </label>
      </div>
    </>
  )
}

CheckList.defaultProps = {
  onClick:()=>{}
}
export default CheckList
