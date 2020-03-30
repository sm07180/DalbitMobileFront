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
import {osName, isAndroid, isIPad13} from 'react-device-detect'

//components
import Api from 'context/api'
//context
import {Context} from 'context'
import {Hybrid} from 'context/hybrid'
//components
import Utility from 'components/lib/utility'
import Route from './Route'
import Interface from './Interface'
// socketCluster 연결
import SocketCluster from 'context/socketCluster'

const App = () => {
  const context = useContext(Context)
  App.context = () => context

  //useState
  const [ready, setReady] = useState(false)

  const customHeader = useMemo(() => {
    //# 쿠키로부터 'custom-header' 설정
    const cookie = Utility.getCookie('custom-header')
    if (cookie !== undefined && cookie !== 'null' && typeof JSON.parse(cookie) === 'object') {
      let temp = JSON.parse(cookie)
      temp.appVersion = '1.0.1'
      temp.locale = Utility.locale()
      return temp
    }

    //# 서버에서 내려주는 id="customHeader" 읽을수없는경우,고정값으로생성
    const makeCustomHeader = () => {
      //#3-1 하이브리드앱이 아닌 모바일웹 or PC 접속
      let _os = '3'
      if (osName === 'Android') _os = '1'
      if (osName === 'iOS') _os = '2'
      if (isAndroid) _os = '1'
      if (isIPad13) _os = '2'

      const info = {
        os: _os,
        locale: 'temp_KR',
        deviceId: Utility.createUUID(),
        language: Utility.locale(),
        deviceToken: 'make_custom_header'
      }
      return info
    }
    return makeCustomHeader()
  })

  let authToken = Utility.getCookie('authToken')

  const isHybrid = useMemo(() => (customHeader.isFirst !== undefined ? 'Y' : 'N'))

  async function fetchData() {
    const commonData = await Api.splash()
    if (commonData.result === 'success') {
      context.action.updateCommon(commonData.data)

      const res = await Api.getToken()
      if (res.result === 'success') {
        console.table(res.data)
        context.action.updateToken(res.data)

        if (res.data.isLogin) {
          if (location.href.indexOf('/private/') === -1) {
            const profileInfo = await Api.profile({params: {memNo: res.data.memNo}})
            if (profileInfo.result === 'success') {
              context.action.updateProfile(profileInfo.data)
            }
          }
        }

        //###--하이브리드일때
        if (isHybrid === 'Y') {
          if (customHeader.isFirst !== undefined && customHeader.isFirst === 'Y') {
            //active
            Hybrid('GetLoginToken', res.data)
          } else {
            if (res.data.authToken !== authToken) Hybrid('GetLoginToken', res.data)
          }
          //최초앱 기동할때만적용
          if (customHeader.isFirst === 'Y') {
            Utility.setCookie('native-player-info', '', -1)
          }
          if (customHeader.isFirst === 'N') {
            //-----@안드로이드 Cookie
            let cookie = Utility.getCookie('native-player-info')
            if (customHeader.os + '' === '1' && cookie !== null && cookie !== undefined) {
              cookie = JSON.parse(cookie)
              context.action.updateMediaPlayerStatus(true)
              context.action.updateNativePlayer(cookie)
            }
            //-----@iOS
            if (customHeader.os + '' === '2' && cookie !== null && cookie !== undefined) {
              cookie = decodeURIComponent(cookie)
              cookie = JSON.parse(cookie)
              context.action.updateMediaPlayerStatus(true)
              context.action.updateNativePlayer(cookie)
            }
            //-----@
          }
        }

        //모든처리완료
        setReady(true)
      } else {
        //토큰에러
        context.action.alert({
          title: res.messageKey,
          msg: res.message
        })
      }
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

    fetchData()
  }, [])

  return (
    <React.Fragment>
      {ready && <Interface />}
      {ready && <Route />}
      {ready && isHybrid === 'N' && window.location.pathname === '/' && <SocketCluster />}
    </React.Fragment>
  )
}
export default App

/**
 * @title 글로벌변수
 * @example const context=useContext(Context) 와 동일
 */
export const Global = () => {
  return App.context()
}
