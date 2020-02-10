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
//components
import Utility from 'components/lib/utility'
import Route from './Route'

export default () => {
  //---------------------------------------------------------------------
  //context
  const context = useContext(Context)
  //useState
  const [ready, setReady] = useState(false)

  //SERVER & APP -> REACT
  const customHeader = useMemo(() => {
    //makeCustomHeader
    const makeCustomHeader = () => {
      const info = {
        os: '3',
        locale: 'KR',
        deviceId: Utility.createUUID(),
        language: 'ko',
        deviceToken: 'make_custom_header'
      }
      return info
    }
    const element = document.getElementById('customHeader')
    if (element === null) {
      return makeCustomHeader()
    }

    if (element.value === null || element.value === '') return
    return typeof JSON.parse(element.value) === 'object' && JSON.parse(element.value)
  })
  //---------------------------------------------------------------------
  //fetch
  async function fetchData(obj) {
    const res = await Api.getToken({...obj})
    if (res.result === 'success') {
      //context Update
      Api.setAuthToken(res.data.authToken)
      context.action.updateToken(res.data)
      //ready
      // console.table(res.data)
      setReady(true)
    }
  }
  //---------------------------------------------------------------------
  //useEffect
  useEffect(() => {
    console.log('1')
    //console.table(customHeader)
    //context Update
    Api.setCustomHeader(JSON.stringify(customHeader))
    console.log('2')
    context.action.updateCustomHeader(customHeader)
    console.log('3')

    //
    fetchData({data: customHeader})
    console.log('4')
  }, [])
  //---------------------------------------------------------------------
  /**
   * @brief 정보체크이후 최종완료된 상태에서 Route진행
   */
  return (
    <React.Fragment>
      {ready && console.log('Route')}
      {ready && <Route />}
    </React.Fragment>
  )
}
