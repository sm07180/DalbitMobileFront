import React from 'react'
import {useHistory} from 'react-router-dom'

import Api from 'context/api'
import {OS_TYPE} from 'context/config.js'
// static
import closeBtn from './ic_back.svg'

export default (props) => {
  const history = useHistory()
  const customHeader = JSON.parse(Api.customHeader)

  let {goBack, type} = props
  if (goBack === undefined) {
    goBack = () => {
      return history.goBack()
    }
  }

  return (
    <div className={`new header-wrap ${type !== undefined ? type : ''}`}>
      {props.description === 'clip' && <span className="clipIcon"></span>}
      {props.title ? (
        <h2 className={`header-title${props.title.length > 18 ? ' isLong' : ''}`}>{props.title}</h2>
      ) : (
        props.children
      )}
      {(props.type !== 'noBack' || customHeader['os'] === OS_TYPE['Desktop']) && (
        <button className="close-btn" onClick={goBack}>
          <img src={closeBtn} alt="뒤로가기" />
        </button>
      )}
    </div>
  )
}
