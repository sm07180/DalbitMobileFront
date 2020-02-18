/**
 *
 */
import React, {useEffect, useContext, useState} from 'react'
//context
import {Context} from 'context'
//contents
import Content from './content'
//
export default props => {
  //---------------------------------------------------------------------
  /**
   * @brief 로그인이벤트처리핸들러
   */
  function update(mode) {
    switch (true) {
      case mode.menu !== undefined:
        break
      default:
        break
    }
  }
  //useEffect
  useEffect(() => {}, [])
  //---------------------------------------------------------------------
  return (
    <React.Fragment>
      <Content {...props} />
    </React.Fragment>
  )
}
