import React from 'react'
import styled from 'styled-components'
import {useHistory} from 'react-router-dom'

// static
import closeBtn from './ic_back.svg'

export default (props) => {
  const history = useHistory()

  const goBack = () => {
    return history.goBack()
  }

  return (
    <div className="header-wrap">
      <div className="child-bundle">{props.children}</div>
      <button className="close-btn" onClick={goBack}>
        <img src={closeBtn} alt="뒤로가기" />
      </button>
    </div>
  )
}
