/**
 * @file App.js
 * @brief React 최초실행시토큰검증및 필수작업
 */
import React, {useMemo, useState, useEffect, useContext} from 'react'

//context
import {Context} from 'context'
import {Hybrid, isHybrid} from 'context/hybrid'

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
  const myInfo = globalCtx.myInfo

  const isJsonString = (str) => {
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
        return parsed
      }
    }

    return {os: OS_TYPE['Desktop']}
  }, [])

  const authToken = useMemo(() => {
    return Utility.getCookie('authToken')
  }, [])

  async function fetchData() {
    // Renew token
    const tokenInfo = await Api.getToken()
    if (tokenInfo.result === 'success') {
      globalCtx.action.updateCustomHeader(customHeader)
      globalCtx.action.updateToken(tokenInfo.data)

      // *** Native App case
      /*if (__NODE_ENV === 'dev') {
            alert(JSON.stringify(customHeader));
            alert(isHybrid());
        }*/

      if (isHybrid()) {
        //
        if (customHeader['isFirst'] === 'Y') {
          Hybrid('GetLoginToken', tokenInfo.data)
          if (__NODE_ENV === 'dev') {
            alert('after GetLoginToken isFirst : Y')
          }

          /*if (__NODE_ENV === 'dev'){
              alert('sned loginData isFirst\n' + JSON.stringify(tokenInfo.data));
            }*/
          Utility.setCookie('native-player-info', '', -1)

          // replace custom header isFirst value 'Y' => 'N'
          const customHeaderCookie = Utility.getCookie('custom-header')
          if (customHeaderCookie) {
            if (isJsonString(customHeaderCookie)) {
              const parsed = JSON.parse(customHeaderCookie)
              if (parsed['isFirst'] === 'Y') {
                parsed['isFirst'] = 'N'
                globalCtx.action.updateCustomHeader(parsed)
              }
            }
          }
        } else if (customHeader['isFirst'] === 'N') {
          if (tokenInfo.data.authToken !== authToken) {
            //#토큰업데이트
            Hybrid('GetUpdateToken', tokenInfo.data)
            /*if (__NODE_ENV === 'dev'){
              alert('sned loginData\n' + JSON.stringify(tokenInfo.data));
            }*/
          }

          // ?webview=new 형태로 이루어진 player종료
          const nativeInfo = Utility.getCookie('native-player-info')
          if (nativeInfo) {
            if (isJsonString(nativeInfo) && window.location.href.indexOf('webview=new') === -1) {
              const parsed = JSON.parse(nativeInfo)
              globalCtx.action.updatePlayer(true)
              globalCtx.action.updateMediaPlayerStatus(true)
              globalCtx.action.updateNativePlayer(parsed)
            }
          }
        }

        const appIsFirst = Utility.getCookie('appIsFirst')
        if(appIsFirst !== 'N'){
            Utility.setCookie('appIsFirst', 'N')
            if(tokenInfo.data.isLogin === false){
              window.location.href = '/login'
            }
        }
      }
      if (tokenInfo.data && tokenInfo.data.memNo) {
        const myProfile = await Api.profile({
          params: {
            memNo: tokenInfo.data.memNo
          }
        })
        if (myProfile.result === 'success') {
          globalCtx.action.updateProfile(myProfile.data)
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

    const myInfoRes = await Api.mypage()
    if (myInfoRes.result === 'success') {
      globalCtx.action.updateMyInfo(myInfoRes.data)
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
    <>
      {ready && <Interface />}
      {ready && <Route />}
    </>
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
