/**
 *
 */
import React, {useEffect, useContext, useState} from 'react'
//context
import {Context} from 'context'
import Api from 'context/api'
import {Hybrid} from 'context/hybrid'
//components

export default props => {
  //---------------------------------------------------------------------
  //context
  const context = useContext(Context)
  /**
   * @brief 로그인,이벤트처리핸들러
   */
  function update() {
    switch (true) {
      case true:
        console.clear()
        console.log(context.message)
        break
      default:
        break
    }
  }
  //makeContents
  const makeContents = () => {
    if (context.message.visible) {
      console.log(context.message)
    }
  }

  //---------------------------------------------------------------------
  return <React.Fragment>{makeContents()}</React.Fragment>
}
