import React, {useContext, useState, useEffect} from 'react'
import {useHistory} from 'react-router-dom'
//context
import {Context} from 'context'
import qs from 'query-string'

// static
import closeBtn from './ic_back.svg'
import {isHybrid, Hybrid} from 'context/hybrid'

export default (props) => {
  const history = useHistory()
  const [popup, setPopup] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  const globalCtx = useContext(Context)
  let {goBack, type, locHash} = props
  console.log(type)

  if (goBack === undefined && type === undefined) {
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
  //function모바일 레어어 실행
  useEffect(() => {
    if (popup) {
      if (window.location.hash === '') {
        window.history.pushState('layer', '', '/#layer')
        setScrollY(window.scrollY)
      }
    } else if (!popup) {
      if (window.location.hash === '#layer') {
        // window.history.back()
        history.goBack()
        setTimeout(() => window.scrollTo(0, scrollY))
      }
    }
  }, [popup])
  useEffect(() => {
    window.addEventListener('popstate', popStateEvent)
    return () => {
      window.removeEventListener('popstate', popStateEvent)
    }
  }, [])
  //팝업실행
  const popStateEvent = (e) => {
    if (e.state === null) {
      setPopup(false)
      context.action.updateMypageReport(false)
      context.action.updateClose(false)
      context.action.updateCloseFanCnt(false)
      context.action.updateCloseStarCnt(false)
      context.action.updateCloseGoodCnt(false)
    } else if (e.state === 'layer') {
      setPopup(true)
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
