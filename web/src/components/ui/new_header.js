import React from 'react'
import {useHistory} from 'react-router-dom'

// static
import closeBtn from './ic_back.svg'

export default (props) => {
  const history = useHistory()

  let {goBack} = props
  if (goBack === undefined) {
    goBack = () => {
      return history.goBack()
    }
  }

  return (
    <div className="new header-wrap">
      {props.title ? (
        <h2 className={`header-title${props.title.length > 18 ? ' isLong' : ''}`}>{props.title}</h2>
      ) : (
        props.children
      )}

      <button className="close-btn" onClick={goBack} style={{zIndex: 48}}>
        <img src={closeBtn} alt="뒤로가기" />
      </button>
    </div>
  )
}
