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
    const cookie = Utility.getCookie('custom-header')
    if (cookie !== undefined) {
      let jsonPared = JSON.parse(cookie)
      jsonPared.appVersion = '1.0.1'
      jsonPared.locale = Utility.locale()
      return jsonPared
    }

    const tempCustomHeaderTag = document.getElementById('customHeader')
    if (tempCustomHeaderTag && tempCustomHeaderTag.value) {
      let jsonPared = JSON.parse(tempCustomHeaderTag.value)
      jsonParsed.nativeApp = true
      jsonPared.appVersion = '1.0.1'
      jsonPared.locale = Utility.locale()
      return jsonPared
    } else {
      return {
        os: '3',
        locale: 'temp_KR',
        deviceId: Utility.createUUID(),
        language: Utility.locale(),
        deviceToken: 'make_custom_header'
      }
    }
  }, [])

  const authToken = useMemo(() => {
    const cookie = Utility.getCookie('authToken')
    if (cookie !== undefined) {
      return cookie
    }

    const tempAuthTokenTag = document.getElementById('authToken')
    if (tempAuthTokenTag && tempAuthTokenTag.value) {
      return tempAuthTokenTag.value
    }
    return ''
  }, [])

  async function fetchData() {
    const commonData = await Api.splash()
    if (commonData.result === 'success') {
      context.action.updateCommon(commonData.data)

      // Renew token
      const res = await Api.getToken()
      if (res.result === 'success') {
        context.action.updateToken(res.data)

        if (res.data.isLogin) {
          if (location.href.indexOf('/private/') === -1) {
            const profileInfo = await Api.profile({params: {memNo: res.data.memNo}})
            if (profileInfo.result === 'success') {
              context.action.updateProfile(profileInfo.data)
            }
          }
        }

        // *** Native App case
        if (customHeader.nativeApp) {
          if (customHeader.isFirst !== undefined && customHeader.isFirst === 'Y') {
            Hybrid('GetLoginToken', res.data)
          } else {
            if (res.data.authToken !== authToken) {
              Hybrid('GetLoginToken', res.data)
            }
          }

          //최초앱 기동할때만적용
          if (customHeader.isFirst === 'Y') {
            Utility.setCookie('native-player-info', '', -1)
          } else if (customHeader.isFirst === 'N') {
            //-----@안드로이드 Cookie
            let cookie = Utility.getCookie('native-player-info')
            if (customHeader.os === '1' && cookie !== null && cookie !== undefined) {
              cookie = JSON.parse(cookie)
              context.action.updateMediaPlayerStatus(true)
              context.action.updateNativePlayer(cookie)
            }
            //-----@iOS
            if (customHeader.os === '2' && cookie !== null && cookie !== undefined) {
              cookie = decodeURIComponent(cookie)
              cookie = JSON.parse(cookie)
              context.action.updateMediaPlayerStatus(true)
              context.action.updateNativePlayer(cookie)
            }
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
    context.action.updateCustomHeader(customHeader)
    Api.setAuthToken(authToken)

    // Renew all initial data
    fetchData()
  }, [])

  return (
    <React.Fragment>
      {ready && <Interface />}
      {ready && <Route />}
      {ready && window.location.pathname === '/' && <SocketCluster />}
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
