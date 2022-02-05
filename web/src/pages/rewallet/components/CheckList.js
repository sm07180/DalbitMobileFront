import React from 'react'

// global components
// components
// contents
// css
import './checkList.scss'

const CheckList = (props) => {
  const {text,children} = props

  return (
    <>
      <div className="infoCheckList">
        <label className="inputLabel">
          <span className="checkIcon"></span>
          <p className="checkinfo">{text}</p>
          {children}
        </label>
      </div>
    </>
  )
}

export default CheckList
