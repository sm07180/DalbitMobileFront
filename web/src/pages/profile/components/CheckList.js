import React, {useState} from 'react'

// global components
// components
// contents
// css
import './checkList.scss'

const CheckList = (props) => {
  const {text, name, children, checkStatus, onClick} = props

  console.log(onClick);

  return (
    <>
      <label className="inputLabel">
        <input type="checkbox" onClick={onClick} className="blind" />
        <span className="checkIcon"></span>
        <p className="checkinfo">{text}</p>
        {children}
      </label>
      {/* <span onClick={onClick}>{text}</span>
      <span>{`${checkStatus}`}</span> */}
    </>
  )
}

export default CheckList

CheckList.defaultProps = {
  onClick: () => {},
  text: '',
  checkStatus: false
}