import React from 'react'
import {useHistory} from 'react-router-dom'

import Api from 'context/api'
import {OS_TYPE} from 'context/config.js'
import qs from 'query-string'
import {Hybrid} from 'context/hybrid'

import '../style.scss'

export default (props) => {
  const history = useHistory()
  const customHeader = JSON.parse(Api.customHeader)
  const {webview} = qs.parse(location.search)

  let {goBack, type} = props
  if (goBack === undefined) {
    goBack = () => {
      if (webview === 'new') {
        return Hybrid('CloseLayerPopup')
      } else {
        return history.goBack()
      }
    }
  }

  return (
    <div className={`header`}>
      {props.leftCtn &&
       <div className="leftCtn">
        {props.leftCtn === 'backBtn' && 
          <button className="close-btn" onClick={goBack}>
            <img src='https://image.dallalive.com/svg/icon_back_black.svg' alt="뒤로가기" />
          </button>
        }
       </div>
      }
      {props.title && <h2 className={`headerTitle${props.title.length > 18 ? ' isLong' : ''}`}>{props.title}</h2>}
      {props.children}
    </div>
  )
}
