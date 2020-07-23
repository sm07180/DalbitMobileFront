import React from 'react'
import styled from 'styled-components'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import qs from 'qs'
import {useHistory} from 'react-router-dom'
// static
import closeBtn from './ic_back.svg'

import {getUrlAndRedirect} from 'components/lib/link_control.js'
import {Hybrid, isHybrid} from 'context/hybrid'

export default (props) => {
  const _parse = qs.parse(window.location.href, {ignoreQueryPrefix: true})

  const goBack = () => {
    if (sessionStorage.getItem('push_type') === 'Y') {
      sessionStorage.removeItem('push_type')
      return (window.location.href = '/')
    }
    const {webview} = qs.parse(location.search)
    let referrer = document.referrer
    // if (_parse.push_type !== undefined && typeof _parse.push_type === 'string') {
    //
    // }

    /*if (props.click == undefined) {
      getUrlAndRedirect()
    } else {
      props.click()
    }*/
    if (webview && webview === 'new' && isHybrid()) {
      Hybrid('CloseLayerPopup')
    } else if (referrer.split('/')[4] === 'faq') {
      window.history.go(-2)
    } else {
      window.history.go(-1)
    }
  }

  return (
    <Header className="header-wrap">
      <div className="child-bundle">{props.children}</div>
      <div></div>
      <img className="close-btn" src={closeBtn} onClick={goBack} />
    </Header>
  )
}

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #d2d2d2;
  /* padding: 14px 0; */
  box-sizing: border-box;
  /* margin-bottom: 10px; */
  width: calc(100% + 32px);
  margin-left: -16px;
  padding: 12px 16px;

  .write-btn {
    position: absolute;
    right: 16px;
    color: ${COLOR_MAIN};
    font-weight: bold;
    font-size: 17px;
  }
  .child-bundle {
    display: flex;
    flex-direction: row;
    align-items: center;

    .category-text {
      color: #000;
      font-size: 18px;
      letter-spacing: -0.45px;
      font-weight: 800;
      text-align: center;
    }
  }

  .close-btn {
    display: block;
    width: 36px;
  }
`
