/**
 * @file App.js
 * @brief React 최초실행시토큰검증및 필수작업
 * @notice
 */
import React, {useMemo, useState, useEffect, useContext} from 'react'
//components
import Api from 'context/api'
//context
import {Context} from 'context'
/*-Route-*/
import Route from './Route'

export default () => {
  //---------------------------------------------------------------------
  //context
  const context = useContext(Context)
  //useState
  const [ready, setReady] = useState(false)

  //SERVER & APP -> REACT
  const customHeader = useMemo(() => {
    const element = document.getElementById('customHeader')
    if (element === null) return
    if (element.value === null || element.value === '') return
    return typeof JSON.parse(element.value) === 'object' && JSON.parse(element.value)
  })
  //---------------------------------------------------------------------
  //fetch
  async function fetchData(obj) {
    const res = await Api.getToken({...obj})
    if (res.result === 'success') {
      //update
      Api.setAuthToken(res.data.authToken)
      context.action.updateToken(res.data)
      //ready
      console.table(res.data)
      setReady(true)
    }
  }
  //useEffect
  useEffect(() => {
    fetchData({data: customHeader})
  }, [])
  //---------------------------------------------------------------------
  /**
   * @brief 정보체크이후 최종완료된 상태에서 Route진행
   */
  return <React.Fragment>{ready && <Route />}</React.Fragment>
}
