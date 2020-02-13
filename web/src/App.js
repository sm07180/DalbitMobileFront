/**
 * @file App.js
 * @brief React 최초실행시토큰검증및 필수작업
 * @notice
 * @flow
 * 
  @customHeader
    1.textarea (id="customHeader")
    2.cookie(get) 
    3.makeCustomHeader
  @token
    1.textarea (id="authToken")
    2.cookie(get)
    3.api/token 실행 (header에 1,2번포함)
 */
import React, {useMemo, useState, useEffect, useContext} from 'react'
//components
import Api from 'context/api'
//context
import {Context} from 'context'
//components
import Utility from 'components/lib/utility'
import Route from './Route'
import Interface from './Interface'

export default () => {
  //---------------------------------------------------------------------
  const DAY_COOKIE_PERIOD = '365'
  //context
  const context = useContext(Context)
  //useState
  const [ready, setReady] = useState(false)
  //SERVER->REACT (커스텀헤더)
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
    //---------------------------------------------
    //#1 서버에서 id="customHeader" 값을 넘겨받는다. @param:object
    const element = document.getElementById('customHeader1')
    if (element !== null && element.value.trim() !== '' && element.value !== undefined) return JSON.parse(element.value)
    //#2 쿠키로부터 'custom-header' 설정
    const cookie = Utility.getCookie('custom-header')
    if (cookie !== undefined && cookie !== null && typeof JSON.parse(cookie) === 'object') return JSON.parse(cookie)
    //#3 서버에서 내려주는 id="customHeader" 읽을수없는경우,고정값으로생성
    return makeCustomHeader()
  })
  //SERVER->REACT (authToken)
  const authToken = useMemo(() => {
    //#1 id="authToken" 읽을수없는경우,고정값으로생성 @param:string
    const element = document.getElementById('authToken')
    if (element !== null && typeof element.value === 'string') return element.value
    //#2 쿠키로부터 'custom-header' 설정
    const cookie = Utility.getCookie('authToken')
    if (cookie !== undefined && cookie !== '' && cookie !== null) return cookie
    return ''
  })
  //---------------------------------------------------------------------
  //fetch
  async function fetchData(obj) {
    const res = await Api.getToken({...obj})
    console.table(res.data)
    // result 성공/실패 여부상관없이,토큰없데이트
    Api.setAuthToken(res.data.authToken)
    context.action.updateToken(res.data)
    Utility.setCookie('authToken', res.data.authToken, DAY_COOKIE_PERIOD)
    //모든처리완료
    setReady(true)
  }
  //---------------------------------------------------------------------
  //useEffect token
  useEffect(() => {
    //#1 customHeader
    Api.setCustomHeader(JSON.stringify(customHeader))
    context.action.updateCustomHeader(customHeader)
    Utility.setCookie('custom-header', JSON.stringify(customHeader), DAY_COOKIE_PERIOD)
    console.table(customHeader)
    //#2 authToken
    fetchData({data: customHeader})
  }, [])
  //---------------------------------------------------------------------
  /**
   * @brief 정보체크이후 최종완료된 상태에서 Interface,Route진행
   */
  return (
    <React.Fragment>
      {ready && <Interface />}
      {ready && <Route />}
    </React.Fragment>
  )
}
