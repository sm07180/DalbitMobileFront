/**
 * @file App.js
 * @brief React 최초실행시토큰검증및 필수작업
 */
import React, {useMemo, useState, useEffect, useContext} from 'react'

//context
import {Context} from 'context'
import {Hybrid} from 'context/hybrid'

//components
import Utility from 'components/lib/utility'
import Route from './Route'
import Interface from './Interface'

import Api from 'context/api'
import {OS_TYPE} from 'context/config.js'

const App = () => {
  const globalCtx = useContext(Context)
  App.context = () => context

  const [ready, setReady] = useState(false)

  const isJsonString = str => {
    try {
      var parsed = JSON.parse(str)
      return typeof parsed === 'object'
    } catch (e) {
      return false
    }
  }

  const customHeader = useMemo(() => {
    const customHeaderTag = document.getElementById('customHeader')
    if (customHeaderTag && customHeaderTag.value) {
      // The data that got from server is encoded as URIComponent.
      const decodeValue = decodeURIComponent(customHeaderTag.value)
      if (isJsonString(decodeValue)) {
        const parsed = JSON.parse(decodeValue)
        if (parsed['os']) {
          parsed['os'] = Number(parsed['os'])
        }

        parsed['FROM'] = '@@ CUSTOM @@'

        if (__NODE_ENV === 'dev') {
          if (parsed['os'] === OS_TYPE['Android']) {
            // alert(`custom ${JSON.stringify(parsed)}`)
          }
        }
        return parsed
      }
    }

    const customHeaderCookie = Utility.getCookie('custom-header')
    if (customHeaderCookie) {
      if (isJsonString(customHeaderCookie)) {
        const parsed = JSON.parse(customHeaderCookie)
        if (parsed['os']) {
          parsed['os'] = Number(parsed['os'])
        }

        parsed['FROM'] = '@@ COOKIE @@'

        if (__NODE_ENV === 'dev') {
          if (parsed['os'] === OS_TYPE['Android']) {
            // alert(`cookie ${JSON.stringify(parsed)}`)
          }
        }
        return parsed
      }
    }

    return {os: OS_TYPE['Desktop']}
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
      if (customHeader['os'] === OS_TYPE['Android'] || customHeader['os'] === OS_TYPE['IOS']) {
        //
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
          /*개발테스트코드*/
          if (__NODE_ENV === 'dev') {
            alert('isFirst : ' + customHeader['isFirst'])
            console.log(nativeInfo)
            if (parsed !== undefined) {
              console.log(parsed)
            }
          }
          /*개발테스트종료*/
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
    if (customHeader['os'] === OS_TYPE['Android'] || customHeader['os'] === OS_TYPE['IOS']) {
      customHeader['isHybrid'] = 'Y'
    }

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
