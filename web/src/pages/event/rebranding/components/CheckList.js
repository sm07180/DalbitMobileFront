import React from 'react'

// global components
// components
// contents
// css
import './checkList.scss'

const CheckList = (props) => {
  const {text, children, onClick} = props

  return (
      <label className="inputLabel">
        <input type="checkbox" className="blind"
               onChange={onClick}/>
        <span className="checkIcon"/>
        <p className="checkInfo">{text}</p>
        {children}
      </label>
  )
}

export default CheckList

CheckList.defaultProps = {
  onClick: () => {},
  text: '',
}