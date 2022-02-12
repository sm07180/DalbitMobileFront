import React from 'react'

// global components
// components
// contents
// css
import './checkList.scss'

const CheckList = (props) => {
  const {text, name, children, checkStatus, onClick} = props

  return (
    <div className="infoCheckList">
      <label className="inputLabel">
        <input type="checkbox" className="blind" checked={checkStatus}
               onChange={onClick}/>
        <span className="checkIcon"/>
        <p className="checkinfo">{text}</p>
        {children}
      </label>
    </div>
  )
}

export default CheckList

CheckList.defaultProps = {
  onClick: () => {},
  text: '',
  checkStatus: false
}