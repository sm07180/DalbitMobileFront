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
import {osName} from 'react-device-detect'
//components
import Api from 'context/api'
//context
import {Hybrid} from 'context/hybrid'
import {Context} from 'context'
//components
import Utility from 'components/lib/utility'
import Route from './Route'
import Interface from './Interface'
// socketCluster 연결
import SocketCluster from 'context/socketCluster'

export default () => {
  //---------------------------------------------------------------------
  //context
  const context = useContext(Context)
  //useState
  const [ready, setReady] = useState(false)
  //SERVER->REACT (커스텀헤더)
  const customHeader = useMemo(() => {
    //makeCustomHeader
    const makeCustomHeader = () => {
      //#3-1 하이브리드앱이 아닌 모바일웹 or PC 접속
      let _os = '3'
      if (osName === 'Android') _os = '1'
      if (osName === 'iOS') _os = '2'
      const info = {
        os: _os,
        locale: 'temp_KR',
        deviceId: Utility.createUUID(),
        language: 'ko',
        deviceToken: 'make_custom_header'
      }
      return info
    }
    //---------------------------------------------
    //#1 서버에서 id="customHeader" 값을 넘겨받는다. @param:object
    const element = document.getElementById('customHeader')
    if (element !== null && element.value.trim() !== '' && element.value !== undefined) return JSON.parse(element.value)
    //#2 쿠키로부터 'custom-header' 설정
    const cookie = Utility.getCookie('custom-header')
    if (cookie !== undefined && cookie !== 'null' && typeof JSON.parse(cookie) === 'object') {
      let temp = JSON.parse(cookie)
      temp.appVersion = '1.0.1'
      temp.locale = 'KR'
      return temp
    }
    //#3 서버에서 내려주는 id="customHeader" 읽을수없는경우,고정값으로생성
    return makeCustomHeader()
  })
  //SERVER->REACT (authToken)
  const authToken = useMemo(() => {
    //#1 id="authToken" 읽을수없는경우,고정값으로생성 @param:string
    const element = document.getElementById('authToken')
    if (element !== null && typeof element.value === 'string' && element.value !== '') return element.value
    //#2 쿠키로부터 'custom-header' 설정
    const cookie = Utility.getCookie('authToken')
    if (cookie !== undefined && cookie !== '' && cookie !== null) return cookie
    return ''
  })
  //isHybrid체크
  const isHybrid = useMemo(() => {
    return customHeader.isFirst !== undefined ? 'Y' : 'N'
  })
  // //Native->REACT
  // const nativeInfo = useMemo(() => {
  //   if (customHeader.isFirst === undefined) return {}
  //   //최초앱구동실행
  //   if (customHeader.isFirst === 'Y') {
  //     Utility.setCookie('native-player-info', '', -1)
  //   } else if (customHeader.isFirst === 'N') {
  //     alert('customHeader.isFirst : ')
  //     //  && Utility.getCookie('native-player-info') !== undefined
  //     context.action.updateMediaPlayerStatus(true)
  //     // return JSON.parse(Utility.getCookie('native-player-info'))
  //   }
  //   return customHeader.isFirst
  // })
  //---------------------------------------------------------------------
  //fetch
  async function fetchData(obj) {
    const res = await Api.getToken({...obj})
    if (res.result === 'success') {
      console.table(res.data)
      // result 성공/실패 여부상관없이,토큰없데이트
      if (res.data.isLogin) {
        const profileInfo = await Api.profile({params: {memNo: res.data.memNo}})
        if (profileInfo.result === 'success') {
          context.action.updateProfile(profileInfo.data)
        }
      }
      context.action.updateToken(res.data)
      //하이브리드일때
      if (isHybrid === 'Y') {
        if (customHeader.isFirst !== undefined && customHeader.isFirst === 'Y') {
          //active
          Hybrid('GetLoginToken', res.data)
        } else {
          if (res.data.authToken !== authToken) Hybrid('GetLoginToken', res.data)
        }
      }
      //모든처리완료
      setReady(true)
    } else {
      console.log('토큰에러')
    }
  }
  //---------------------------------------------------------------------
  //useEffect token
  useEffect(() => {
    //#1 customHeader
    const _customHeader = {...customHeader, isHybrid: isHybrid}
    context.action.updateCustomHeader(_customHeader)
    console.table(_customHeader)
    //#2 authToken 토큰업데이트
    Api.setAuthToken(authToken)
    fetchData({data: _customHeader})
    //-----##TEST
    console.log('### version 2.2')
    /**
     * @새창에서도 실행되므로 주의요망
     */
    if (isHybrid === 'Y') {
      alert('isHybrid_ ' + isHybrid + ' , isFirst_ ' + customHeader.isFirst)
      //최초앱구동실행
      if (customHeader.isFirst === 'Y') {
        Utility.setCookie('native-player-info', '', -1)
      } else if (customHeader.isFirst === 'N') {
        const _cookie = Utility.getCookie('native-player-info')
        if (_cookie !== undefined) {
          alert('창1')
        }
      }
    }
  }, [])
  //---------------------------------------------------------------------
  /**
   * @brief 정보체크이후 최종완료된 상태에서 Interface,Route진행
   */
  return (
    <React.Fragment>
      {ready && <Interface />}
      {ready && <Route />}
      {ready && window.location.pathname === '/' && <SocketCluster />}
    </React.Fragment>
  )
}
