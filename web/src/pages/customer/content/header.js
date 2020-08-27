import React, {useEffect, useContext} from 'react'
import styled from 'styled-components'
import {useHistory} from 'react-router-dom'
// static
import closeBtn from './static/ic_back.svg'
import {Store} from './index'
import {Context} from 'context'
export default (props) => {
  const history = useHistory()
  const context = useContext(Context)

  const goBack = () => {
    if (context.noticeIndexNum.split('/')[3] !== undefined) {
      return history.push('/')
    } else {
      return history.goBack()
    }
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
