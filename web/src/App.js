/**
 * @file App.js
 * @brief React 최초실행시토큰검증및 필수작업
 */
import React, {useMemo, useState, useEffect, useContext, useCallback} from 'react'
import {ErrorBoundary} from 'react-error-boundary'
import 'styles/errorstyle.scss'

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

  const createDeviceUUid = () => {
    var dt = new Date().getTime()
    var uuid = Utility.getCookie('deviceUUid')
    if (uuid === undefined || uuid === null || uuid === '') {
      uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0
        dt = Math.floor(dt / 16)
        return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16)
      })
    }
    return uuid
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

        if (parsed['deviceId'] && (parsed['os'] === 1 || parsed['os'] === 2)) {
          Utility.setCookie('custom-header', JSON.stringify(parsed), 60)
          parsed['FROM'] = '@@ CUSTOM @@'
          return parsed
        }
      }
    }

    const customHeaderCookie = Utility.getCookie('custom-header')
    if (customHeaderCookie) {
      if (isJsonString(customHeaderCookie)) {
        const parsed = JSON.parse(customHeaderCookie)
        if (parsed['os']) {
          parsed['os'] = Number(parsed['os'])
        }

        if (parsed['deviceId']) {
          Utility.setCookie('custom-header', JSON.stringify(parsed), 60)
          parsed['FROM'] = '@@ COOKIE @@'
          return parsed
        }
      }
    }

    const createHeader = {
      os: OS_TYPE['Desktop'],
      deviceId: createDeviceUUid(),
      appVersion: '1.0.1',
      locale: 'ko',
      FROM: '@@ CREATED @@'
    }
    Utility.setCookie('custom-header', JSON.stringify(createHeader), 60)
    return createHeader
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

      if (isHybrid()) {
        //
        if (customHeader['isFirst'] === 'Y') {
          Hybrid('GetLoginToken', tokenInfo.data)

          if (
            sessionStorage.getItem('room_no') === undefined ||
            sessionStorage.getItem('room_no') === null ||
            sessionStorage.getItem('room_no') === ''
          ) {
            Utility.setCookie('native-player-info', '', -1)
          }

          if (
            sessionStorage.getItem('clip_info') === undefined ||
            sessionStorage.getItem('clip_info') === null ||
            sessionStorage.getItem('clip_info') === ''
          ) {
            Utility.setCookie('clip-player-info', '', -1)
          }

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
          }

          // ?webview=new 형태로 이루어진 player종료
        }
        const nativeInfo = Utility.getCookie('native-player-info')
        if (nativeInfo) {
          if (isJsonString(nativeInfo) && window.location.href.indexOf('webview=new') === -1) {
            const parsed = JSON.parse(nativeInfo)
            globalCtx.action.updatePlayer(true)
            globalCtx.action.updateMediaPlayerStatus(true)
            globalCtx.action.updateNativePlayer(parsed)
          }
        }

        const nativeClipInfo = Utility.getCookie('clip-player-info')
        if (nativeClipInfo) {
          if (isJsonString(nativeClipInfo) && window.location.href.indexOf('webview=new') === -1) {
            const parsed = JSON.parse(nativeClipInfo)
            globalCtx.action.updateClipState(true)
            globalCtx.action.updateClipPlayerState(parsed.playerState)
            globalCtx.action.updateClipPlayerInfo({bgImg: parsed.bgImg, title: parsed.title, nickname: parsed.nickname})
            globalCtx.action.updatePlayer(true)
          }
        }

        const appIsFirst = Utility.getCookie('appIsFirst')
        if (appIsFirst !== 'N') {
          Utility.setCookie('appIsFirst', 'N')
          if (tokenInfo.data.isLogin === false) {
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
    } else if (result === 'fail') {
      const yesterDay = (() => {
        const date = new Date()
        date.setDate(date.getDate() - 1)
        return date.toUTCString()
      })()

      const splited = document.cookie.split(';')
      splited.forEach((bundle) => {
        let [key, value] = bundle.split('=')
        key = key.trim()
        document.cookie = key + '=' + '; expires=' + yesterDay + '; path=/; secure; domain=.dalbitlive.com'
      })

      globalCtx.action.alert({
        title: tokenInfo.messageKey,
        msg: tokenInfo.message,
        callback: () => {
          window.location.reload()
        }
      })
    }
  }
  const myInfoRes = async () => {
    console.log('myInfoRes')
    const res = await Api.mypage()
    if (res.result === 'success') {
      console.log(res.data)
      globalCtx.action.updateMyInfo(res.data)
    }
  }
  //admincheck
  const fetchAdmin = async () => {
    const adminFunc = await Api.getAdmin()
    if (adminFunc.result === 'success') {
      globalCtx.action.updateAdminChecker(true)
    } else if (adminFunc.result === 'fail') {
      globalCtx.action.updateAdminChecker(false)
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
  useEffect(() => {
    fetchAdmin()
    myInfoRes()
  }, [])

  function ErrorFallback({error, resetErrorBoundary}) {
    if (error) {
      Api.error_log({
        data: {
          os: 'mobile',
          appVer: customHeader.appVersion,
          dataType: __NODE_ENV,
          commandType: window.location.pathname,
          desc: error.name + '\n' + error.message + '\n' + error.stack
        }
      })
    }

    return (
      <section id="error">
        <button
          className="closeButon"
          onClick={() => {
            window.location.href = '/'
          }}>
          닫기
        </button>

        <div className="img"></div>

        <p className="text">
          해당 페이지 접속이 지연되고 있습니다.
          <br />
          다시 시도해주세요
        </p>

        <div className="buttonWrap">
          <button
            onClick={() => {
              window.location.href = '/'
            }}>
            확인
          </button>
        </div>
      </section>
    )
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      {/* {ready && <Interface />}
      {ready && <Route />} */}

      {ready ? (
        <>
          <Interface />
          <Route />
        </>
      ) : (
        <>
          <div className="loading">
            <span></span>
          </div>
          <button
            id="btn-home"
            onClick={() => {
              location.href = '/'
            }}
          />
        </>
      )}
    </ErrorBoundary>
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
