import React from 'react'
import {useHistory} from 'react-router-dom'
import qs from 'query-string'
// static
import closeBtn from './ic_back.svg'

export default (props) => {
  const history = useHistory()
  const {webview} = qs.parse(location.search)

  const goBack = () => {
    if (webview === 'new') {
      return Hybrid('CloseLayerPopup')
    } else {
      return history.goBack()
    }
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
