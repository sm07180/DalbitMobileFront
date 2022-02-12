import React, {useState} from 'react'

// global components
// components
// contents
// css
import './checkList.scss'

const CheckList = (props) => {
  const {text, name, children, checkStatus, onClick} = props

  return (
    <>
      {/*<div className="infoCheckList">*/}
      {/*  <label className="inputLabel">*/}
      {/*    <input type="checkbox" className="blind" />*/}
      {/*    <span className="checkIcon"></span>*/}
      {/*    <p className="checkinfo">{text}</p>*/}
      {/*    {children}*/}
      {/*  </label>*/}
      {/*</div>*/}
      <span onClick={onClick}>{text}</span>
      <span>{`${checkStatus}`}</span>
    </>
  )
}

export default CheckList

CheckList.defaultProps = {
  onClick: () => {},
  text: '',
  checkStatus: false
}