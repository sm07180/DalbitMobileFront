import React from 'react'
import {useHistory} from 'react-router-dom'

import Api from 'context/api'
import {OS_TYPE} from 'context/config.js'
import qs from 'query-string'
import {Hybrid} from 'context/hybrid'
// static
import closeBtn from './ic_back.svg'
import closeBtnWhite from './ic_back_white.png'

export default (props) => {
  const history = useHistory()
  const customHeader = JSON.parse(Api.customHeader)
  const {webview} = qs.parse(location.search)

  let {goBack, type, editorOpen, setCropper} = props
  if (goBack === undefined) {
    goBack = () => {
      if (webview === 'new') {
        return Hybrid('CloseLayerPopup')
      } else {
        return history.goBack()
      }
    }
  }

  const imgClose = () => {
    if (type === 'blackBg' || type === 'cropperPopup') {
      return closeBtnWhite
    } else {
      return closeBtn
    }
  }

  const BackType = () => {
    if (props.type === 'cropperPopup') {
      return (
        <button className="close-btn" onClick={() => setCropper(false)}>
          <img src={imgClose()} alt="뒤로가기1" />
        </button>
      )
    } else if (props.type !== 'noBack')
      return (
        <button className="close-btn" onClick={goBack}>
          <img src={imgClose()} alt="뒤로가기2" />
        </button>
      )
  }

  return (
    <div className={`new header-wrap ${type !== undefined ? type : ''}`}>
      {props.title ? (
        <h2 className={`header-title${props.title.length > 18 ? ' isLong' : ''}`}>{props.title}</h2>
      ) : (
        props.children
      )}
      {BackType()}
    </div>
  )
}
