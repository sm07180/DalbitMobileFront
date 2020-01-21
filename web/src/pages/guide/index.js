/**
 * @url /guide/
 * @brief 가이드페이지
 * @author 손완휘
 */

import React from 'react'
//layout
import Layout from './layout'
import Contents from './layout-contents'
//
import {checkMic} from 'Components/lib/webRTC'
export default props => {
  console.log(checkMic)

  //---------------------------------------------------------------------
  return (
    <Layout {...props}>
      <button
        onClick={() => {
          checkMic()
        }}>
        마이크체크
      </button>
      <Contents />
    </Layout>
  )
}
