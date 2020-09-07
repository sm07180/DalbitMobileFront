import React from 'react'
import {useHistory} from 'react-router-dom'

// static
import closeBtn from './ic_back.svg'

export default (props) => {
  console.log(props)
  const history = useHistory()

  const goBack = () => {
    return history.goBack()
  }

  return (
    <div className="org header-wrap">
      {props.children}
      <button className="close-btn" onClick={goBack}>
        <img src={closeBtn} alt="뒤로가기" />
      </button>
    </div>
  )
}
