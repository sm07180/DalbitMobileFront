/**
 * @file App.js
 * @brief React 최초실행시토큰검증및 필수작업
 */
import React, {useMemo, useState, useEffect, useContext} from 'react'

//components
import Api from 'context/api'
//context
import {Context} from 'context'
import {Hybrid} from 'context/hybrid'
//components
import Utility from 'components/lib/utility'
import Route from './Route'
import Interface from './Interface'

const App = () => {
  const globalCtx = useContext(Context)
  App.context = () => context

  const [ready, setReady] = useState(false)

  const isJsonString = str => {
    try {
      alert(str)
      var parsed = JSON.parse(str)
      return typeof parsed === 'object'
    } catch (e) {
      return false
    }
  }

  const customHeader = useMemo(() => {
    const customHeaderTag = document.getElementById('customHeader')
    if (customHeaderTag && customHeaderTag.value) {
      if (isJsonString(cutomeHeaderTag.value)) {
        alert('check2')
        return JSON.parse(customHeaderTag.value)
      }
    }

    const cookie = Utility.getCookie('custom-header')
    if (cookie) {
      if (isJsonString(cookie)) {
        return JSON.parse(cookie)
      }
    }

    return {os: '3'}
  }, [])

  const authToken = useMemo(() => {
    const authTokenTag = document.getElementById('authToken')
    if (authTokenTag && authTokenTag.value) {
      return authTokenTag.value
    }

    return Utility.getCookie('authToken')
  }, [])

  async function fetchData() {
    // Renew token
    const tokenInfo = await Api.getToken()
    if (tokenInfo.result === 'success') {
      globalCtx.action.updateCustomHeader(customHeader)
      globalCtx.action.updateToken(tokenInfo.data)

      if (tokenInfo.data.isLogin) {
        const profileInfo = await Api.profile({params: {memNo: tokenInfo.data.memNo}})
        if (profileInfo.result === 'success') {
          globalCtx.action.updateProfile(profileInfo.data)
        }
      }

      // *** Native App case
      // os => '1': Android, '2': IOS
      if (customHeader['os'] === '1' || customHeader['os'] === '2') {
        customHeader['isHybrid'] = 'Y'

        if (customHeader['isFirst'] === 'Y' || tokenInfo.data.authToken !== authToken) {
          Hybrid('GetLoginToken', tokenInfo.data)
        }

        if (customHeader['isFirst'] === 'Y') {
          Utility.setCookie('native-player-info', '', -1)
        }

        if (customHeader['isFirst'] === 'N') {
          const nativeInfo = Utility.getCookie('native-player-info')
          if (nativeInfo) {
            if (isJsonString(nativeInfo)) {
              const parsed = JSON.parse(nativeInfo)
              globalCtx.action.updateMediaPlayerStatus(true)
              globalCtx.action.updateNativePlayer(parsed)
            }
          }
        }
      }

      //모든 처리 완료
      setReady(true)
    } else {
      globalCtx.action.alert({
        title: tokenInfo.messageKey,
        msg: tokenInfo.message
      })
    }
  }

  //useEffect token
  useEffect(() => {
    // set header (custom-header, authToken)
    Api.setCustomHeader(JSON.stringify(customHeader))
    Api.setAuthToken(authToken)

    // Renew all initial data
    fetchData()
  }, [])

  return (
    <React.Fragment>
      {ready && <Interface />}
      {ready && <Route />}
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
