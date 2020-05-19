/**
 * @file /mpay/index.js
 * @brief 안드로이드 전용 결제
 */
import React, {useContext} from 'react'
//context
import {PayProvider} from './store'
//layout
import Layout from 'pages/common/layout'
//components
import {Hybrid} from 'context/hybrid'

import Content from './content'
import _ from 'lodash'
//
export default (props) => {
  //---------------------------------------------------------------------
  //context
  if (__NODE_ENV === 'dev' && _.hasIn(props, 'location.state.result')) {
    if (props.location.state.result === 'success') {
      alert('### 결제완료_화면디자인필요 ###')
      alert(props.location.state.message)
      alert(JSON.stringify(props.location.state, null, 1))
      Hybrid('CloseLayerPopup')
      window.location.href = '/'
      //--------------------결제완료
    }
  }
  /**
   *
   * @returns
   */
  //---------------------------------------------------------------------
  return (
    <PayProvider>
      <Layout {...props} status="no_gnb">
        <Content {...props} />
      </Layout>
    </PayProvider>
  )
}
//---------------------------------------------------------------------
