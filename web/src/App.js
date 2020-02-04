/**
 * @file App.js
 * @brief React실행시토큰검증및 필수작업
 * @notice
 */
import React, {useMemo, useContext} from 'react'

//context
import {Context} from 'context'
/*-Route-*/
import Route from './Route'

export default () => {
  //context
  const context = useContext(Context)

  //SERVER & APP -> REACT
  const customHeader = useMemo(() => {
    const ele = document.getElementById('customHeader').value
    console.log(ele)
  })

  //---------------------------------------------------------------------
  return <Route />
}
