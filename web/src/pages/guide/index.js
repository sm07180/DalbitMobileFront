/**
 * @url /guide/
 * @brief 가이드페이지
 * @author 손완휘
 */

import React, {useEffect} from 'react'
//layout
import Layout from './layout'
import Contents from './layout-contents'
//
import {checkMic} from 'Components/lib/webRTC'

export default props => {
  //---------------------------------------------------------------------
  function test(evt) {
    console.log('do submitting stuff')
  }
  document.addEventListener('REACT-callback', test)

  //---------------------------------------------------------------------
  return (
    <Layout {...props}>
      <button
        onClick={() => {
          //checkMic()
          window.callbackFunc()
        }}>
        마이크체크
      </button>
      <Contents />
    </Layout>
  )
}
