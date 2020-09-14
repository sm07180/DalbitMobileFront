import React, {useContext} from 'react'
import styled from 'styled-components'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {Context} from 'context'
import qs from 'qs'
// static
import closeBtn from './ic_back.svg'
import Write from './ic_write.svg'
import {getUrlAndRedirect} from 'components/lib/link_control.js'

export default (props) => {
  const context = useContext(Context)
  const _parse = qs.parse(window.location.href, {ignoreQueryPrefix: true})
  const goBack = () => {
    if (sessionStorage.getItem('push_type') === 'Y') {
      sessionStorage.removeItem('push_type')
      return (window.location.href = '/')
    }
    // if (_parse.push_type !== undefined && typeof _parse.push_type === 'string') {
    //
    // }
    const {webview} = qs.parse(location.search)
    let referrer = document.referrer
    if (webview && webview === 'new' && isHybrid()) {
      sessionStorage.removeItem('webview')
      Hybrid('CloseLayerPopup')

      /*} else if (referrer.split('/')[4] === 'faq') {
      window.history.go(-2)*/
    } else {
      //window.history.go(-1)
      if (props.click == undefined) {
        getUrlAndRedirect()
        //팬관리 스테이트 초기화
        context.action.updateFanEdite(false)
      } else {
        props.click()
      }
    }
    /*if (props.click == undefined) {
      getUrlAndRedirect()
    } else {
      props.click()
    }*/
  }

  return (
    <div className="mypage header-wrap">
      {props.title ? (
        <h2 className={`header-title${props.title.length > 18 ? ' isLong' : ''}`}>{props.title}</h2>
      ) : (
        props.children
      )}
      <button className="close-btn" onClick={goBack}>
        <img src={closeBtn} alt="뒤로가기" />
      </button>
    </div>
  )
}
