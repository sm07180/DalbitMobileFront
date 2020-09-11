import React, {useContext} from 'react'
import {useHistory} from 'react-router-dom'
//context
import {Context} from 'context'
import qs from 'query-string'

// static
import closeBtn from './ic_back.svg'
import {isHybrid, Hybrid} from 'context/hybrid'
export default (props) => {
  const history = useHistory()

  const globalCtx = useContext(Context)
  let {goBack, type} = props
  if (goBack === undefined) {
    goBack = () => {
      return history.goBack()
    }
  } else if (type === 'backClip') {
    const {webview} = qs.parse(location.search)
    if (globalCtx.clipPlayerInfo !== null) {
      Hybrid('ClipPlayerEnter')
    } else {
      if (webview && webview === 'new' && isHybrid()) {
        Hybrid('CloseLayerPopup')
      } else {
        if (locHash instanceof Object && locHash.state) {
          locHash.state.hash === '#layer' ? history.go(-2) : history.goBack()
        } else {
          history.goBack()
        }
      }
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
