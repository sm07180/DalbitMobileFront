/**
 * @file /event/index.js
 * @brief 이벤트
 */
import React, {useEffect, useState, useContext} from 'react'

//layout
import Layout from 'pages/common/layout'
//context
import {Context} from 'context'

//components
import Content from './content'
//
export default props => {
  const context = useContext(Context)

  //본인인증체크여부
  if (!context.state.selfAuth) {
    props.history.push('/user/selfAuth', {
      type: 'cast'
    })
  }

  return (
    <>
      {context.state.selfAuth ? (
        <Layout {...props}>
          <Content {...props} />
        </Layout>
      ) : (
        <></>
      )}
    </>
  )
}
//---------------------------------------------------------------------
